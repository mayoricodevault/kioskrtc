var express = require('express');
var app = express();
//socket IO stuff
var http = require('http').Server(app);
var _ = require("underscore");
var io = require('socket.io')(http);
//native NodeJS module for resolving paths
var path = require('path');
//get our port # from c9's enviromental variable: PORT
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var methodOverride = require('method-override');   

//setup, configure, and connect to MongoDB
var mongoose = require('mongoose');
var configDB = require('./server/config/database.js');
mongoose.connect(configDB.url);
var Firebase = require('firebase');
var FIREBASE_URL = 'https://kxively.firebaseio.com';
var appfire = new Firebase(FIREBASE_URL);
var activeVisitors = appfire.child('people');
//

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
  
  socket.on('sync', function(data){
      io.emit('sync', {socketId: data.soid, action: data.action });
  });
  
  socket.on('register', function(data){
      io.emit('message', data);
  });
  
  socket.on('unknown', function(data){
      io.emit('message', data);
  });
  
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
      });
    }
  });
  
  socket.on('disconnect', function(){
    console.log(devicename + ' has Disconnected!');
    devices.splice(devices.indexOf(devicename), 1);
    io.emit('remove-device', {devicename: devicename});
  });
});

app.post("/xively", function(request, response) {

  //The request body expects a param named "message"
  var people = request.body;
  if(_.isUndefined(people) || _.isEmpty(people)) {
    return response.json(400, {error: "Invalid People Card"});
  }
  //If the message is empty or wasn't sent it's a bad request
  if(_.isUndefined(people.name) || _.isEmpty(people.name)) {
    return response.json(400, {error: "Name is invalid"});
  }
  if(_.isUndefined(people.email) || _.isEmpty(people.email)){
    return response.json(400, {error: "Email Must be defined"});
  }
  if(_.isUndefined(people.favcoffe) || _.isEmpty(people.favcoffe)) {
    return response.json(400, {error: "Favorite Must be defined"});
  }
  if(_.isUndefined(people.zipcode) || _.isEmpty(people.zipcode)) {
    return response.json(400, {error: "Zip Code Must be defined"});
  }
  if(_.isUndefined(people.zonefrom) || _.isEmpty(people.zonefrom)) {
    return response.json(400, {error: "Zone Must be defined"});
  }
  if(_.isUndefined(people.zoneto) || _.isEmpty(people.zoneto)) {
    return response.json(400, {error: "Zone Must be defined"});
  }
  if(_.isUndefined(people.companyname) || _.isEmpty(people.companyname) ){
    return response.json(400, {error: "Company Must be defined"});
  }
  // Find Visitor
  var isKnown = true;
  var activeVisitors = appfire.child('people/'+escapeEmail(people.email));
  activeVisitors
    .once('value', function(snap) {
      if(!snap.val()) {
         isKnown = false;   
         activeVisitors.set(people);
       }
  });
  
  var fSession = _.find(sessionsConnections, function(sessionC){ return sessionC.name == people.zoneto; });

  if (fSession) {
    if (isKnown) {
      io.sockets.connected[fSession.id].emit('register', people);
    } else {
      io.sockets.connected[fSession.id].emit('unknown', people);
    }
  } else {
    if (isKnown) {
      io.sockets.emit("register", people);
    } else  {
      io.sockets.emit("unknown", people);
    }
  }
  // //Looks good, let the client know
  response.json(200, {results: "Message received"});

});

app.post("/sync", function(request, response) {

  //The request body expects a param named "message"
  var sync = request.body.sync;
  //If the message is empty or wasn't sent it's a bad request
  if(_.isUndefined(sync) || _.isEmpty(sync.trim())) {
    return response.json(400, {error: "Message is invalid"});
  }
  if(_.isUndefined(sync.action)) {
    return response.json(400, {error: "Action Must be defined"});
  }
  
  if(_.isUndefined(sync.device)) {
    return response.json(400, {error: "Device Must be defined"});
  }

  //let them know there was a new message
  var fSession = _.find(sessionsConnections, function(sessionC){ return sessionC.name == sync.device; });

   if (fSession) {
     console.log('Sending..');
     io.sockets.connected[fSession.id].emit('sync', { action: sync.action });
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
function escapeEmail(email) {
    return (email || '').replace('.', ',');
}
function unescapeEmail(email) {
    return (email || '').replace(',', '.');
}
//make our app listen for incoming requests on the port assigned above
http.listen(port, function() {
  console.log('SERVER RUNNING... PORT: ' + port);
})