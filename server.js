var express = require('express');
var app = express();
//socket IO stuff
var http = require('http').Server(app);
var _ = require("underscore");
var io = require('socket.io')(http);
//native NodeJS module for resolving paths
var path = require('path');
//get our port # from c9's enviromental variable: PORT
var port = process.env.PORT;
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

//setup, configure, and connect to MongoDB
var mongoose = require('mongoose');
var configDB = require('./server/config/database.js');
mongoose.connect(configDB.url);
app.use(bodyParser.json());
app.use(methodOverride());
//Set our view engine to EJS, and set the directory our views will be stored in
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'client', 'views'));

//serve static files from client folder.
//ex: libs/bootstrap/bootstrap.css in our html actually points to client/libs/bootstrap/bootstrap.css
app.use(express.static(path.resolve(__dirname, 'client')));

//io Specific Settings
io.set('heartbeat timeout',10000);
io.set('heartbeat interval',9000);
var devices = [];
var sessionsConnections = {};
var numberofusers = 0;

io.on('connection', function(socket) {
  var devicename = '';
  numberofusers = io.sockets.server.eio.clientsCount;
  console.log("Number of Users : " + numberofusers);
  console.log("A Device has Connected!" + socket.id);
  
  socket.on('request-devices', function(){
    socket.emit('devices', {devices: devices});
  });
  
  socket.on('message', function(data){
      io.emit('message', {devicename: devicename, message: "room : " + data.message });
  })
  
  socket.on('xternal', function(data){
      io.emit('message', {devicename: devicename, message: {action: data.action , value: data.value }});
  })
  
  socket.on('add-device', function(data){

    if(devices.indexOf(data.devicename) == -1){
      io.emit('add-device', {
        devicename: data.devicename
      });
      devicename = data.devicename;
      devices.push(data.devicename);
      sessionsConnections[socket.id] = { id : socket.id, name : data.devicename};
      console.log(devicename + ' has subscribed!');
    } else {
      socket.emit('prompt-device', {
        message: 'Device Already Subscribed'
      })
    }
  })
  
  socket.on('disconnect', function(){
    console.log(devicename + ' has Disconnected!');
    devices.splice(devices.indexOf(devicename), 1);
    io.emit('remove-device', {devicename: devicename});
  })
});
//POST method to create a chat message
app.post("/xively", function(request, response) {

  //The request body expects a param named "message"
  var message = request.body.message;

  // console.log(request.body);
  //If the message is empty or wasn't sent it's a bad request
  if(_.isUndefined(message) || _.isEmpty(message.trim())) {
    return response.json(400, {error: "Message is invalid"});
  }
  if(_.isUndefined(request.body.action)) {
    return response.json(400, {error: "Action Must be defined"});
  }
  if(_.isUndefined(request.body.value)) {
    return response.json(400, {error: "Values must be defined"});
  }
  
  //We also expect the sender's name with the message
  var devicename = request.body.devicename;
  var to = request.body.to;
  var action = request.body.action;
  var value = request.body.value;
  

  //let them know there was a new message
  var fSession = _.find(sessionsConnections, function(sessionC){ return sessionC.name == to; });

   if (fSession) {
     console.log('Sending..');
     io.sockets.connected[fSession.id].emit('xternal', {devicename: devicename, message: message, action: action, value: value});
   } else {
      io.sockets.emit("message", {message: message, devicename: devicename});
       io.sockets.emit("xternal", {message: message, action: action, value: value});
   }
  //Looks good, let the client know
  response.json(200, {results: "Message received"});

});

//set our first route
app.get('/', function(req, res) {
  res.render('index.ejs');
});

var api = express.Router();
require('./server/routes/api')(api);
app.use('/api', api);

app.get('/*', function(req, res) {
  res.render('index.ejs');
});

//make our app listen for incoming requests on the port assigned above
http.listen(port, function() {
  console.log('SERVER RUNNING... PORT: ' + port);
})