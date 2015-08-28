var express = require('express');
var app = express();
var favicon = require('express-favicon');
var http = require('http').Server(app);
var _ = require("underscore");
var io = require('socket.io')(http);
var path = require('path');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var port = process.env.PORT || 3001;
var jwtSecret = 'asesam0/3uk';
var session = require("express-session")({secret: jwtSecret,resave: true,saveUninitialized: true});
var sharedsession = require("express-socket.io-session");
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors= require('cors');
var requestify = require('requestify');
var configDB = require('./server/config/config.js');
var Firebase = require('firebase');
var appfire = new Firebase(configDB.firebase);
var moment = require('moment');
var fs = require('fs');
app.use(session);
app.use(cors());
app.use(favicon(__dirname + '/client/img/favicon.ico'));
app.use(bodyParser.json());
app.use(methodOverride());
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'client', 'views'));
app.use(express.static(path.resolve(__dirname, 'client')));
io.use(sharedsession(session));
io.set('heartbeat timeout',10000);
io.set('heartbeat interval',9000);
var devices = [];
var numberofusers = 0;
//Socket io Events Handling
io.on('connection', function(socket) {
  var devicename = '';
  numberofusers = io.sockets.server.eio.clientsCount;
  console.log("Number of Users : " + numberofusers);
  console.log("A Device has Connected!" + socket.id);
  // console.log(io.sockets.connected)
  socket.on('snap', function(data){
      var binaryData = new Buffer(data.binaryData, 'base64').toString('binary');
      fs.writeFile(data.snapname+ "-out.png", binaryData, "binary", function(err) {
          console.log(err); // writes out file without error, but it's not a valid image
      });
      var snapFileName ='https://kiosk-mmayorivera.c9.io/'+data.snapname+"-out.png";
      var activeSession = appfire.child('sessions/'+data.snapname);
      activeSession
        .once('value', function(snap) {
          if(snap.val()) {
             var SessionRequest = snap.val();
             SessionRequest.snapshot = data.binaryData;
             activeSession.set(SessionRequest);
           } 
      });
  });
  
  socket.on('subscribed', function(data){
      console.log("---> Subscribed");
      console.log(data);
      console.log("---> end Subscribed");
      //Todo: Send Message to Admin
  });
  
  socket.on('disconnect', function(data){
    console.log(data + ' has Disconnected!');
    io.emit('remove-device', {devicename: devicename});
  });
});
app.post("/weather", function(request, response) {
  var zipcode = request.body.zipcode;
  var weather =null;
  if(_.isUndefined(zipcode) || _.isEmpty(zipcode)) {
    return response.status(400).json({error: "Invalid Zip Code"});
  }
  requestify.request('https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20weather.forecast%20WHERE%20location%3D%22' + zipcode + '%22&format=json&diagnostics=true&callback=', {
    method: 'GET',
    dataType: 'json' ,
    }).then(function(res) {
         weather = JSON.parse(res.body);
         return response.status(200).json(weather);
    });

});
app.post("/xively", function(request, response) {
  var people = request.body;
  if(_.isUndefined(people) || _.isEmpty(people)) {
    return response.status(400).json({error: "Invalid People Card"});
  }
  if(_.isUndefined(people.name) || _.isEmpty(people.name)) {
    return response.status(400).json({error: "Name is invalid"});
  }
  if(_.isUndefined(people.email) || _.isEmpty(people.email)){
    return response.status(400).json( {error: "Email Must be defined"});
  }
  if(_.isUndefined(people.favcoffe) || _.isEmpty(people.favcoffe)) {
    return response.status(400).json( {error: "Favorite Must be defined"});
  }
  if(_.isUndefined(people.zipcode) || _.isEmpty(people.zipcode)) {
    return response.status(400).json( {error: "Zip Code Must be defined"});
  }
  if(_.isUndefined(people.zonefrom) || _.isEmpty(people.zonefrom)) {
    return response.status(400).json( {error: "Zone Must be defined"});
  }
  if(_.isUndefined(people.zoneto) || _.isEmpty(people.zoneto)) {
    return response.status(400).json({error: "Zone Must be defined"});
  }
  if(_.isUndefined(people.companyname) || _.isEmpty(people.companyname) ){
    return response.status(400).json({error: "Company Must be defined"});
  }
  
  var activePeople = appfire.child('people/'+escapeEmail(people.email));
  activePeople
    .once('value', function(snap) {
      if(!snap.val()) {
         activePeople.set(people);
         io.sockets.emit('unknown', people);
       } else {
         io.sockets.emit('register', people);
       }
  });
  response.status(200).json({results: "Message Send it"});

});
// ******************* ORDER ************
app.post("/add-order", function (req, res) {
  var people = req.body.people;
  var activePeople = appfire.child('orders/'+escapeEmail(people.email));
  activePeople
    .once('value', function(snap) {
      if(!snap.val()) {
         activePeople.set(people);
       } 
  });
  res.status(200).json({results: "People Added Successfully"});
});
// ****************** END_ORDER
app.post("/sync", function(request, response) {
  var sync = request.body;
  if(_.isUndefined(sync) || _.isEmpty(sync)) {
    return response.json(400, {error: "Message is invalid"});
  }
  if(_.isUndefined(sync.action)) {
    return response.json(400, {error: "Action Must be defined"});
  }
  if(_.isUndefined(sync.tagId)) {
    return response.json(400, {error: "Tag Id Must be defined"});
  }
  if(_.isUndefined(sync.sessionid)) {
    return response.json(400, {error: "Session Id Must be defined"});
  }
  if(_.isUndefined(sync.socketid)) {
    return response.json(400, {error: "Socket Id Must be defined"});
  }
  if(_.isUndefined(sync.url)) {
    return response.json(400, {error: "Url Must be defined"});
  }
  sync.sessionid=sync.sessionid;
  io.sockets.emit('sync', sync);
  response.status(200).json({results: "Action Syncronized!!"});
   // io.sockets.connected[sync.socketid].emit('sync', { action: sync.action });
});
app.post('/subscribe', authenticate, function(req, res) {
  var body =  req.body;
  var foundSession = appfire.child('sessions/'+body.socketid);
    foundSession
      .once('value', function(snap) {
        if(!snap.val()) {
            var sessionid = jwt.sign({
                deviceName: body.deviceName,
                socketid : body.socketid
            }, jwtSecret);
            body.sessionid = sessionid;
            var sess = new Object();
            sess.sessionid = body.sessionid;
            sess.socketid = body.socketid;
            sess.deviceName = body.deviceName;
            sess.tagId = body.tagId;
            sess.serverUrl = body.serverUrl;
            sess.ipaddr = process.env.IP;
            sess.stamp = moment().format();
            foundSession.set(sess);
            res.send({
              sessionid: body.sessionid,
              socketid : body.socketid,
              tagId: body.tagId,
              deviceDesc : body.deviceName,
              serverUrl : body.serverUrl
            });            
        } else {
           res.json(200, {results: "Already in Session"});
        }
    });
   
});
app.post('/unsubscribe', unAuth, function(req, res) {
  var body =  req.body;
  var foundSession = appfire.child('sessions/'+body.socketid);
    foundSession.remove(function(error) {
      if (error) {
       res.status(400).json({results: "Synchronization failed"})
      } else {
        res.status(200).json({results: "Session Removed"})
      }
    });
});
app.post('/me', function(req, res) {
    res.send(req.user);
});
app.post('/ping', function(req, res) {
    var body = req.body;
    if(_.isUndefined(body.sessionid) || _.isEmpty(body.sessionid)) {
        res.status(400).json({results: "Invalid Request!!!"});
    }
    if(_.isUndefined(body.ts)) {
        res.status(400).json({results: "Invalid Request!!!"});
    }
     io.sockets.emit('ping', {sessionid : body.sessionid, ts : body.ts});
    res.status(200).end({results: "Message received and proceed to Forward"});
});

// app.post('/remote', function (req, res) {
//     requestify.request('https://rtc-mmayorivera.c9.io/xively', {
//     method: 'POST',
//     body: req.body,
//     headers : {
//             'Content-Type': 'application/json'
//     },
//     dataType: 'json'        
//     }).then(function(response) {
//         // Get the response body
//         console.log(response);
//     });
//     res.json(200, {results: "Message received and proceed to Forward"});
// });
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
function authenticate(req,res, next) {
  var body =  req.body;
  if(!body.socketid) {
    res.status(400).end("Must Have Socket Session Id");
  }
  if(!body.deviceName) {
    res.status(400).end("Must Have a Device Name");
  }
  if(!body.tagId) {
    res.status(400).end("Must Have a Device Tag / Type");
  }
  if(!body.serverUrl) {
    res.status(400).end("Must Have a valid Sever Selected");
  }
  
  next();
}
function unAuth(req,res, next) {
  var body =  req.body;
  if(!body.socketid) {
    res.status(400).end("Must Have Socket Session Id");
  }
  next();
}

function  escapeEmail(email) {
    return (email || '').replace('.', ',');
}
http.listen(port, function() {
  console.log('SERVER RUNNING... PORT: ' + port);
})