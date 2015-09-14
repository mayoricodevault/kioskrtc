var express = require('express');
var app = express();
var favicon = require('express-favicon');
var http = require('http').Server(app);
var _ = require("underscore");
var io = require('socket.io')(http);
var path = require('path');
var jwt = require('jsonwebtoken');
var port = process.env.PORT || 3010;
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
var numberofusers = 0;
//Socket io Events Handling
io.on('connection', function(socket) {
  var devicename = '';
  numberofusers = io.sockets.server.eio.clientsCount;
  console.log("Number of Users : " + numberofusers);
  console.log("A Device has Connected!" + socket.id);

  socket.on('snap', function(data){
      var binaryData = new Buffer(data.binaryData, 'base64').toString('binary');
      fs.writeFile("./public/"+data.snapname+ "-out.png", binaryData, "binary", function(err) {
          console.log(err); // writes out file without error, but it's not a valid image
      });
      var activeSession = appfire.child('sessions/'+data.snapname);
      activeSession
        .once('value', function(snap) {
             var SessionRequest = snap.val();
             SessionRequest.snapshot = data.binaryData;
             activeSession.set(SessionRequest);
           }) ;
   });
   
  socket.on("served", function(data) {
    requestify.request(configDB.url_controller+"/xively", {
      method: 'POST',
      body: data,
      headers : {
              'Content-Type': 'application/json'
      },
      dataType: 'json'        
      }).then(function(response) {
      });
  });
  
  socket.on('subscribed', function(data){
      requestify.request(configDB.url_controller+"/xively", {
        method: 'POST',
        body: data,
        headers : {
                'Content-Type': 'application/json'
        },
        dataType: 'json'        
      }).then(function(response) {
      });
  });
  
  socket.on('disconnect', function(data){
    console.log(data + ' has Disconnected!');
  });
});

app.post("/weather", function(request, response) {
  var city = request.body.city;
  var state = request.body.state;
  var weather =null;
  if(_.isUndefined(city) || _.isEmpty(city) || _.isUndefined(state) || _.isEmpty(state)) {
    return response.status(400).json({error: "Invalid Zip Code"});
  }
  requestify.request("https://query.yahooapis.com/v1/public/yql?q=select wind from weather.forecast where woeid in (select woeid from geo.places(1) where text='"+city+", "+state+"')&format=json&callback=", {
    method: 'GET',
    dataType: 'json' ,
    }).then(function(res) {
         weather = JSON.parse(res.body);
         return response.status(200).json(weather);
    });

});

app.post("/dashboard", function(request, response) {
  var totals = request.body;
  if(_.isUndefined(totals) || _.isEmpty(totals)) {
    return response.status(400).json({error: "Invalid Data for Dashboard -- Totals"});
  }
  if(_.isUndefined(totals.zonefrom) || _.isEmpty(totals.zonefrom)) {
    return response.status(400).json( {error: "Zone Must be defined"});
  }
  if(_.isUndefined(totals.zoneto) || _.isEmpty(totals.zoneto)) {
    return response.status(400).json({error: "Zone Must be defined"});
  }
  io.sockets.emit('dashboard', totals);
  
});

app.post("/welcome", function(request, response) {
  var people = request.body;
  if(_.isUndefined(people) || _.isEmpty(people)) {
    return response.status(400).json({error: "Invalid People Card"});
  }
  if (people.zonefrom == 'IoT') {
    var fSession = appfire.child('sessions/'+people.zoneto);
    fSession
      .once('value', function(snap) {
        if(snap.val()) {
            var fSess = snap.val();
            //people.zoneto = fSess.tagId;  // Todo : Please Do not touch
        } else {
           response.status(400).json({results: "Socket id Session Not Found.. Rejected"});
        }
      });
  }
  // var activePeople = appfire.child('people/'+replaceAll(people.email));
  // activePeople
  //   .once('value', function(snap) {
  //     if(snap.val()) {
  //       io.sockets.emit('welcome', people);
  //     }
  // });
  
  io.sockets.emit('welcome', people);

  people.dt =  moment().format();
  requestify.request(configDB.url_controller+"/xively", {
      method: 'POST',
      body: people,
      headers : {
              'Content-Type': 'application/json'
      },
      dataType: 'json'        
      }).then(function(response) {
          // Get the response body
          console.log(response);
      });
  // // TODO:  Send to Server
  response.status(200).json({results: "Message Send it"});
  

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
  if(_.isUndefined(people.favcoffee) || _.isEmpty(people.favcoffee)) {
    return response.status(400).json( {error: "Favorite Must be defined"});
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
  
   var fsessType = 'xternal';
   
  if (people.zonefrom == 'IoT') {
    console.log("---");
    var fSession = appfire.child('sessions/'+people.zoneto);
    fSession
      .once('value', function(snap) {
        if(snap.val()) {
            var fSess = snap.val();
        } 
      });
  }
  
  var activePeople = appfire.child('people/'+replaceAll(people.email));
  activePeople
    .once('value', function(snap) {
      if(!snap.val()) {
         activePeople.set(people);
         io.sockets.emit('unknown', people);
       } else {
         io.sockets.emit('register', people);
       }
  });
  
  people.dt =  moment().format();
  people.deviceType =fsessType;
  requestify.request(configDB.url_controller+"/xively", {
      method: 'POST',
      body: people,
      headers : {
              'Content-Type': 'application/json'
      },
      dataType: 'json'        
      }).then(function(response) {
          // Get the response body
          console.log(response);
      });
  // TODO:  Send to Server
  response.status(200).json({results: "Message Send it"});
  

});
app.post("/add-order", function (req, res) {
  var order = req.body.people;
  var activeOrder = appfire.child('orders/'+ replaceAll(order.email));
  activeOrder.once('value', function(snap) {
      //if(!snap.val()) {
         var obj = new Object();
         obj.companyname = order.companyname;
         obj.email = order.email;
         obj.favcoffee = order.favcoffee;
         obj.name = order.name;
         obj.zonefrom = order.zonefrom;
         obj.zoneto = order.zoneto;
         obj.active = order.active;
         obj.timeStamp = order.timeStamp;
         obj.tagId = order.tagId;
         obj.masterId = order.masterId;
         obj.city = order.city;
         obj.state = order.state;
         activeOrder.set(obj);
       //} 
       io.emit("served", order);
  });
  res.status(200).json({results: "People Served Successfully"});
});
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
            sess.deviceType =body.deviceType;
            sess.stamp = moment().format();
            sess.deviceDetected= body.deviceDetected;
            sess.masterid = body.masterid;
            sess.ping_dt = new Date().getTime();
            foundSession.set(sess);
            res.send({sessionid: sess.sessionid});            
        } else {
          res.status(200).json({results: "Already in Session"});
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
        res.status(200).json({results: "Session Removed"});
      }
    });
});
app.post('/me', function(req, res) {
    res.send(req.user);
});
app.post('/alive', function(req, res) {
    var body = req.body;
    if(_.isUndefined(body.sessionid) || _.isEmpty(body.sessionid)) {
        res.status(400).json({results: "Invalid Request!!!"});
    }
    if(_.isUndefined(body.ts)) {
        res.status(400).json({results: "Invalid Request!!!"});
    }
    if(_.isUndefined(body.isdeleted)) {
        res.status(400).json({results: "Invalid Request!!!"});
    }
    console.log(body);
    io.sockets.emit('ping', {sessionid : body.sessionid, ts : body.ts, isdeleted: body.isdeleted});
    res.status(200).send("Message received and proceed to Forward");
});

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
  if(_.isUndefined(body.socketid)) {
    res.status(400).end("Must Have Socket Session Id");
  }
  if(_.isUndefined(body.deviceName)) {
    res.status(400).end("Must Have a Device Name");
  }
  if(_.isUndefined(body.tagId)) {
    res.status(400).end("Must Have a Device Tag / Type");
  }
  if(_.isUndefined(body.serverUrl)) {
    res.status(400).end("Must Have a valid Sever Selected");
  }
  if(_.isUndefined(body.deviceType)) {
    res.status(400).end("Must Have a valid Device Type Selected");
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
http.listen(port, function() {
  console.log('SERVER RUNNING... PORT: ' + port);
});

function replaceAll( text){
  while (text.toString().indexOf(".") != -1)
      text = text.toString().replace(".",",");
  return text;
}