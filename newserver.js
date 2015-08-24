var express = require('express');
var app = express();
//socket IO stuff
var http = require('http').Server(app);
var _ = require("underscore");
var io = require('socket.io')(http);
var path = require('path');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
//get our port # from enviromental variable: PORT
// var port = process.env.PORT || 3002;
var port = 3002;
var jwtSecret = 'asesam0/3uk';
var session = require("express-session")({
    secret: jwtSecret,
    resave: true,
    saveUninitialized: true
  });
var user = {
  username : "xively",
  password : "123"
};
var sharedsession = require("express-socket.io-session");
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var sessionMgm = require("./server/services/sessionMgmnt");
var deviceMgm = require("./server/services/deviceMgmnt");
app.use(session);
app.use(cors());
var cors= require('cors');

var requestify = require('requestify');

app.use(bodyParser.json());
app.use(methodOverride());
//Set our view engine to EJS, and set the directory our views will be stored in
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'client', 'views'));
app.use(express.static(path.resolve(__dirname, 'client')));
//setup, configure, and connect Data Bases
var mongoose = require('mongoose');
var configDB = require('./server/config/database.js');
mongoose.connect(configDB.url);
var Firebase = require('firebase');
var appfire = new Firebase(configDB.firebase);
var activeVisitors = appfire.child('people');
var activeSessions = appfire.child('sessions');
//Socket io Specific Settings
io.use(sharedsession(session));
io.set('heartbeat timeout',10000);
io.set('heartbeat interval',9000);
var devices = [];
var sessionsConnections = {};
var numberofusers = 0;
//Socket io Events Handling
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
  
  socket.on('subscribe', function(data){
    if (!_.isEmpty(data)) {
       var ssio = deviceMgm.getSessionBySocketId(data.socketid);
      if(!ssio){
        ssio.subscribe(data);
      }
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
app.post('/login', authenticate, function(req, res) {
  var token = jwt.sign({
    username: user.username
  }, jwtSecret);
  res.send({
    token: token,
    user: user
  });
});

app.post('/me', function(req, res) {
    res.send(req.user);
});

app.post('/remote', function (req, res) {
    requestify.request('https://rtc-mmayorivera.c9.io/xively', {
    method: 'POST',
    body: req.body,
    headers : {
            'Content-Type': 'application/json'
    },
    dataType: 'json'        
    }).then(function(response) {
        // Get the response body
        console.log(response);
    });
    res.json(200, {results: "Message received and proceed to Forward"});
});
// ---> routes <---- 
app.get('/', function(req, res) {
  res.render('index.ejs');
});
//Api Routes
var api = express.Router();
require('./server/routes/api')(api);
app.use('/api', api);
// Else Route
app.get('/*', function(req, res) {
  res.render('index.ejs');
});
// ---> end routes <---- 
function escapeEmail(email) {
    return (email || '').replace('.', ',');
}
function unescapeEmail(email) {
    return (email || '').replace(',', '.');
}
function authenticate(req,res, next) {
  var body =  req.body;
  if(!body.username || !body.password) {
    res.status(400).end("Must Provide Username or Password");
  }
  if (body.username!==user.username || body.password !==user.password)  {
     res.status(401).end("Username or Password invalid or incorrect");
  }
  next();
}
//make our app listen for incoming requests on the port assigned above
http.listen(port, function() {
  console.log('SERVER RUNNING... PORT: ' + port);
})