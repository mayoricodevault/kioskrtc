var express = require('express');
// var ipfilter = require('express-ipfilter');
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
// var ips = ['127.0.0.1', '172.17.95.96'];

app.use(session);
app.use(cors());
app.use(favicon(__dirname + '/client/img/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
// app.use(ipfilter(ips));
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
  
  socket.on('unsubscribed', function(data){
    
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
app.post("/vizix-served", function(request, response) {
  var pushDash =request.body;
  var activeOrder = appfire.child('orders/'+pushDash.id);
   activeOrder
    .once('value', function(snap) {
        if(snap.val()) {
            var currentOrder = snap.val();  
            var dataValues = { "values" : [
                {"operationId":4,"value":"","field":{"fieldTypeId":37,"thingId": currentOrder.orderthingid}}
            ]};  
            requestify.request(configDB.vizixserved , {
            method: 'POST',
            headers : {'api_key':'root','Content-Type': 'application/json'},
            dataType: 'json' ,
             body: dataValues,
            }).then(function(res) {
                requestify.request(configDB.vizixdasboard , {
                    method: 'GET',
                    headers : {'Content-Type': 'application/json'},
                    dataType: 'json' ,
                    body: {},
                }).then(function(res) {
                      // console.log(res.body);
                      return response.status(200);
                }, function(res){
                      // console.log("error servido");
                      // console.log(res.body);
                      return response.status(400).json(res.body);
                });      
            }, function(res) {
              // console.log('------->');
              // console.log(res.body);
              return response.status(400).json(res.body);
            });
        }
    });
});
app.post("/vizix-order", function(request, response) {
  var tDate = new Date();
  var timeStamp = tDate.getTime().toString();
  var orderTo = {
    "thingType.id" : 4,
    "group.id": 5,
    "name": request.body.serial+"O"+timeStamp,
     "serial": request.body.serial+"O"+timeStamp,
     "childrenIdList": [],
     "fields":[
      {"id":37,"unit":"","timeSeries":false,"symbol":"","name":"zone","type":1,"typeLabel":"String"},
      {"id":35,"unit":"","timeSeries":false,"symbol":"","name":"drink","type":1,"typeLabel":"String"},
      {"id":33,"unit":"","timeSeries":false,"symbol":"","name":"orderTime","type":11,"typeLabel":"Date"},
      {"id":36,"unit":"","timeSeries":false,"symbol":"","name":"region","type":1,"typeLabel":"String"},
      {"id":34,"unit":"","timeSeries":false,"symbol":"","name":"person","type":1,"typeLabel":"String"}]
  };
  requestify.request(configDB.vizixorder , {
    method: 'PUT',
    headers : {'api_key':'root','Content-Type': 'application/json'},
    dataType: 'json' ,
    body: orderTo,
    }).then(function(res) {
        var addOrder = JSON.parse(res.body) ;
        var activeOrder = appfire.child('orders/'+request.body.serial);
        var serialThing = request.body.serial;
         activeOrder
          .once('value', function(snap) {
              if(snap.val()) {
                 var currentOrder = snap.val();
                 currentOrder.orderthingid = addOrder.id;
                 currentOrder.ordertTimeStamp = timeStamp;
                 var orderTime = moment().format();
                 activeOrder.set(currentOrder);
                 var dataValues = { "values" : [
                     {"operationId":0,"value":request.body.serial,"field":{"fieldTypeId":34,"thingId": addOrder.id}},
                     {"operationId":1,"value":currentOrder.favcoffee,"field":{"fieldTypeId":35,"thingId": addOrder.id}},
                     {"operationId":2,"value":currentOrder.region,"field":{"fieldTypeId":36,"thingId": addOrder.id}},
                     {"operationId":3,"value":tDate,"field":{"fieldTypeId":33,"thingId": addOrder.id}},
                     {"operationId":4,"value":currentOrder.masterId,"field":{"fieldTypeId":37,"thingId": addOrder.id}},
                     {"operationId":5,"value":currentOrder.favcoffee,"field":{"fieldTypeId":32,"thingId":currentOrder.thingid}} 
                  ]};
                requestify.request(configDB.vizixserved , {
                    method: 'POST',
                    headers : {'api_key':'root','Content-Type': 'application/json'},
                    dataType: 'json' ,
                    body: dataValues,
                    }).then(function(res) {
                        requestify.request(configDB.vizixdasboard , {
                            method: 'POST',
                            headers : {'Content-Type': 'application/json'},
                            dataType: 'json' ,
                            body: {},
                        }).then(function(res) {
                              console.log('Vizix Order -'+currentOrder.orderthingid);
                              console.log('For Tag:'+serialThing)
                              return response.status(200);
                        }, function(res){
                              console.log('Error:'+res.body);
                              return response.status(400).json(res.body);
                        });
                    }, function(res){
                      return response.status(400).json(res.body);
                    });
              }
          });
    }, function(res) {
      console.log(res.body);
      return response.status(400).json(res.body);
    });

});
app.post("/weather", function(request, response) {
  var city = request.body.city;
  var state = request.body.state;
  var weather =null;
  if(_.isUndefined(city) || _.isEmpty(city) || _.isUndefined(state) || _.isEmpty(state)) {
    return response.status(400).json({error: "Invalid Data"});
  }
  requestify.request("https://query.yahooapis.com/v1/public/yql?q=select wind from weather.forecast where woeid in (select woeid from geo.places(1) where text='"+city+", "+state+"')&format=json&callback=", {
    method: 'GET',
    dataType: 'json' ,
    }).then(function(res) {
         weather = JSON.parse(res.body);
         return response.status(200).json(weather);
    });

});
app.post("/xdashboard", function(request, response) {
  var remoteIp = getRemoteIp(request);
  var totals = JSON.stringify(request.body);
  var toJsonTotals = JSON.parse(totals);
  var toJsonBody = JSON.parse(toJsonTotals.body);
  if(_.isUndefined(toJsonBody) || _.isEmpty(toJsonBody)) {
    return response.status(400).json({error: "Invalid Data for Dashboard -- Totals"});
  }
  if(_.isUndefined(toJsonBody.triggering_datastream) || _.isEmpty(toJsonBody.triggering_datastream)) {
    return response.status(400).json({error: "Invalid Data for Dashboard -- Totals"});
  }
  var data = toJsonBody.triggering_datastream;
  if(_.isUndefined(data.id) || _.isEmpty(data.id)) {
    return response.status(400).json({error: "Invalid Id Data for Dashboard -- Totals"});
  }
  var keyWord = data.id;
  var datafinal = new Object();
  if (data.id.indexOf("drinksServed") > -1) {
      var subType = keyWord.indexOf("_");
      var coffee = data.id.substring(subType + 1, data.id.length);
      var drinksServedObj = new Object();
      if (coffee == 'esp') {
        drinksServedObj.esp = data.value.value;
      }
      if (coffee == 'amer') {
        drinksServedObj.amer = data.value.value;
      }
      if (coffee == 'cap') {
        drinksServedObj.cap = data.value.value;
      }
      if (coffee == 'dcaf') {
        drinksServedObj.dcaf = data.value.value;
      }
      if (coffee == 'reg') {
        drinksServedObj.reg = data.value.value;
      }
       if (coffee == 'tea') {
        drinksServedObj.tea = data.value.value;
      }
      datafinal.drinksServed = drinksServedObj;  
    
  }
  if (data.id.indexOf("consumption") > -1) {
     datafinal.totalounces = data.value.value;
  }
  if (data.id=="totVisitors") {
     datafinal.totVisitors = data.value.value;
  }
  if (data.id=="totVisitorsServed") {
     datafinal.totVisitorsServed = data.value.value;
  }
  if (data.id.indexOf("stations") > -1) {
    var subStat = keyWord.indexOf("_");
     var station = data.id.substring(subStat + 1, data.id.length);
     var stationsObj = new Object();
     if (station == 'station1') {
        stationsObj.station1 = data.value.value;
      }
      if (station == 'station2') {
        stationsObj.station2 = data.value.value;
      }
      if (station == 'station3') {
        stationsObj.station3 = data.value.value;
      }
      datafinal.stations = stationsObj; 
  }
  if (data.id.indexOf("regions") > -1) {
     var subReg = keyWord.indexOf("_");
     var region = data.id.substring(subReg + 1, data.id.length);
     var resgionsObj = new Object();
     if (region == 'West') {
        resgionsObj.west = data.value.value;
      }
      if (region == 'Midwest') {
        resgionsObj.midwest = data.value.value;
      }
      if (region == 'Mid_Atlantic') {
        resgionsObj.neMidAtlantic = data.value.value;
      }
      if (region == 'New_England') {
        resgionsObj.neNewEngland = data.value.value;
      }
      if (region == 'Southwest') {
        resgionsObj.sWestSouthCentral = data.value.value;
      }
      if (region == 'Southeast') {
        resgionsObj.sSouthAtlanticESCentral = data.value.value;
      }
      datafinal.regions = resgionsObj;
  }
  datafinal.zoneto ="dashboard";
  datafinal.zonefrom ="Xively";
  io.sockets.emit('dashboard', datafinal);
  datafinal.remoteIp = remoteIp;
  sendRequests(datafinal);
  response.status(200).json({results: "Message Send"}); 
});
app.post("/vdashboard", function(request, response) {
  var remoteIp = getRemoteIp(request);
  var data = request.body;
  if(_.isUndefined(data) || _.isEmpty(data)) {
    return response.status(400).json({error: "Invalid Data for Dashboard -- Totals"});
  }
  var dataArray = data.datastreams;
  var datafinal = new Object();
  var drinksServedObj = new Object();
  var resgionsObj = new Object();
  var stationsObj = new Object();
  for(var key in dataArray){
    var obj = dataArray[key];
    var expr = obj.id;
    switch(expr){
      case "consumption":
        datafinal.totalounces = obj.current_value;
        break;
      case "drinksServed_amer":
        drinksServedObj.amer = obj.current_value;
        break;
      case "drinksServed_cap":
        drinksServedObj.cap = obj.current_value;
        break;
      case "drinksServed_dcaf":
        drinksServedObj.dcaf = obj.current_value;
        break;
      case "drinksServed_esp":
        drinksServedObj.esp = obj.current_value;
        break;
      case "drinksServed_reg":
        drinksServedObj.reg = obj.current_value;
        break;
      case "drinksServed_tea":
        drinksServedObj.tea = obj.current_value;
        break;
      case "regions_Mid_Atlantic":
        resgionsObj.neMidAtlantic = obj.current_value;
        break;
      case "regions_Midwest":
        resgionsObj.midwest = obj.current_value;
        break;
      case "regions_New_England":
        resgionsObj.neNewEngland = obj.current_value;
        break;
      case "regions_Southeast":
        resgionsObj.sSouthAtlanticESCentral = obj.current_value;
        break;
      case "regions_Southwest":
        resgionsObj.sWestSouthCentral = obj.current_value;
        break;
      case "regions_West":
        resgionsObj.west = obj.current_value;
        break;
      case "stations_station3":
        stationsObj.station3 = obj.current_value;
        break;
      case "stations_station1":
        stationsObj.station1 = obj.current_value;
        break;
      case "stations_station2":
        stationsObj.station2 = obj.current_value;
        break;
      case "totVisitors":
        datafinal.totVisitors = obj.current_value;
        break;
      case "totVisitorsServed":
        datafinal.totVisitorsServed = obj.current_value;
        break;
    }
  }
  datafinal.drinksServed = drinksServedObj;
  datafinal.regions = resgionsObj;
  datafinal.stations = stationsObj;
  
  datafinal.zoneto ="dashboard";
  datafinal.zonefrom ="Xively";
  io.sockets.emit('dashboard', datafinal);
  datafinal.remoteIp = remoteIp;
  sendRequests(datafinal);
  response.status(200).json({results: "Message Send"}); 
});
app.post("/dashboard", function(request, response) {
  var remoteIp = getRemoteIp(request);
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
  totals.remoteIp = remoteIp;
  sendRequests(totals);
  response.status(200).json({results: "Message Send"}); 
});
// CR ->: Pass : xively
app.post("/xwelcome", function(request, response) {
   var remoteIp = getRemoteIp(request);
  var infoXively = JSON.stringify(request.body);
  var toJsonTotals = JSON.parse(infoXively);
  var toJsonBody = JSON.parse(toJsonTotals.body);

  if(_.isUndefined(toJsonBody) || _.isEmpty(toJsonBody)) {
    return response.status(400).json({error: "Invalid Data for Welcome -- Body"});
  }
  if(_.isUndefined(toJsonBody.triggering_datastream) || _.isEmpty(toJsonBody.triggering_datastream)) {
    return response.status(400).json({error: "Invalid Data for Welcome -- Totals"});
  }
  var people = toJsonBody.triggering_datastream;
  if(_.isUndefined(people.id) || _.isEmpty(people.id)) {
    return response.status(400).json({error: "Invalid Id Data for People "});
  }
  
  var strObjDelimited = people.value.value.split("|");
  var preJsonString = {};
  for (var i = 0; i < strObjDelimited.length; i++) {
    var pairWord = strObjDelimited[i].split(":");
    preJsonString[pairWord[0]] = pairWord[1];
  }
  var toJsonString = JSON.stringify(preJsonString);
  var peopleXively = JSON.parse(toJsonString);

  if(_.isUndefined(peopleXively.tagId) || _.isEmpty(peopleXively.tagId)) {
    return response.status(400).json({error: "Invalid People Card"});
  }
  if(_.isUndefined(peopleXively.zoneto) || _.isEmpty(peopleXively.zoneto)) {
    return response.status(400).json({error: "Invalid Zone Destination"});
  }  
  var peopleid = peopleXively.tagId;
  var zoneto = peopleXively.zoneto;
  var activePeople = appfire.child('people/'+peopleid);
  activePeople
    .once('value', function(snap) {
      if(snap.val()) {
        var peopleObj = new Object();
        peopleObj = snap.val();
        peopleObj.zonefrom = "Xively";
        peopleObj.zoneto =  zoneto;
        io.sockets.emit('welcome', peopleObj);
      }
  });
  peopleXively.zonefrom = "Xively";
  peopleXively.remoteIp = remoteIp;
  sendRequests(peopleXively);
  response.status(200).json({results: "Message Send"});   
});
app.post("/vwelcome", function(request, response) {
  var remoteIp = getRemoteIp(request);
  var peopleXively = request.body;
  if(_.isUndefined(peopleXively) || _.isEmpty(peopleXively)) {
    return response.status(400).json({error: "Invalid Data for Welcome -- Body"});
  }
  if(_.isUndefined(peopleXively.tagId) || _.isEmpty(peopleXively.tagId)) {
    return response.status(400).json({error: "Invalid People Card"});
  }
  if(_.isUndefined(peopleXively.zoneto) || _.isEmpty(peopleXively.zoneto)) {
    return response.status(400).json({error: "Invalid Zone Destination"});
  }
  var peopleid = peopleXively.tagId;
  var zoneto = peopleXively.zoneto;
  var activePeople = appfire.child('people/'+peopleid);
  activePeople
    .once('value', function(snap) {
      if(snap.val()) {
        var peopleObj = new Object();
        peopleObj = snap.val();
        peopleObj.zonefrom = "Xively";
        peopleObj.zoneto =  zoneto;
        io.sockets.emit('welcome', peopleObj);
      }
  });
  peopleXively.zonefrom = "Xively";
  peopleXively.remoteIp = remoteIp;
  sendRequests(peopleXively);
  response.status(200).json({results: "Message Send"});   
});
app.post("/welcome", function(request, response) {
  var remoteIp = getRemoteIp(request);
  var people = request.body;
  if(_.isUndefined(people) || _.isEmpty(people)) {
    return response.status(400).json({error: "Invalid People Card"});
  }
  if(_.isUndefined(people.tagId) || _.isEmpty(people.tagId)) {
    return response.status(400).json({error: "Invalid People Card"});
  }
  if(_.isUndefined(people.zoneto) || _.isEmpty(people.zoneto)) {
    return response.status(400).json({error: "Invalid Zone Destination"});
  }  
  var peopleid = people.tagId;
  var zoneto = people.zoneto;
  if (people.zonefrom == 'IoT') {
    var fSession = appfire.child('sessions/'+people.zoneto);
    fSession
      .once('value', function(snap) {
        if(snap.val()) {
           var currentSess = snap.val();
           var activePeople = appfire.child('people/'+peopleid);
            activePeople
              .once('value', function(snap) {
                if(snap.val()) {
                  var peopleObj = new Object();
                  peopleObj = snap.val();
                  peopleObj.zonefrom = "IoT";
                  peopleObj.zoneto =  currentSess.tagId;
                  io.sockets.emit('welcome', peopleObj);
                }
            });
        } else {
           response.status(400).json({results: "Socket id Session Not Found.. Rejected"});
        }
      });
  }
  people.zonefrom = "Xively";
  people.remoteIp = remoteIp;
  sendRequests(people);
  response.status(200).json({results: "Message Send"});   
});
app.post("/xively", function(request, response) {
  var remoteIp = getRemoteIp(request);
  var msgXively = request.body;
  if(_.isUndefined(msgXively) || _.isEmpty(msgXively)) {
    return response.status(400).json({error: "Invalid People Card"});
  }
  if(_.isUndefined(msgXively.zonefrom) || _.isEmpty(msgXively.zonefrom)) {
    return response.status(400).json( {error: "Zone Must be defined IoT from Admin or Other"});
  }
  if(_.isUndefined(msgXively.zoneto) || _.isEmpty(msgXively.zoneto)) {
    return response.status(400).json({error: "Zone/Socket or Device ID Must be defined"});
  }
  if(_.isUndefined(msgXively.tagId) || _.isEmpty(msgXively.tagId)) {
    return response.status(400).json({error: "Need People Id to Continue"});
  }
  var activePeople = appfire.child('people/'+msgXively.tagId);
  activePeople
    .once('value', function(snap) {
      if(snap.val()) {
         var newPeople = new Object();
         newPeople = snap.val();
         newPeople.zoneto= msgXively.zoneto;
         newPeople.zonefrom= msgXively.zonefrom;
         var activeOrder = appfire.child('orders/'+msgXively.tagId);
         activeOrder
          .once('value', function(snap) {
              newPeople.hasOrder = false;
              if(snap.val()) {
                 var currentOrder = snap.val();
                 if (currentOrder.active==1 || currentOrder.active=='1') {
                     newPeople.hasOrder = true;
                 } 
              } 
              io.sockets.emit('register', newPeople);
          });
       }
  });
  msgXively.remoteIp = remoteIp;
  sendRequests(msgXively);
  response.status(200).json({results: "Message Send"});
});
app.post("/xxively", function(request, response) {
  var remoteIp = getRemoteIp(request);
  var infoXively = JSON.stringify(request.body);
  var toJsonTotals = JSON.parse(infoXively);
  var toJsonBody = JSON.parse(toJsonTotals.body);
  if(_.isUndefined(toJsonBody) || _.isEmpty(toJsonBody)) {
    return response.status(400).json({error: "Invalid Data for Kiosk -- Body"});
  }
  if(_.isUndefined(toJsonBody.triggering_datastream) || _.isEmpty(toJsonBody.triggering_datastream)) {
    return response.status(400).json({error: "Invalid Data for Kiosk -- Totals"});
  }
  var msgStream = toJsonBody.triggering_datastream;
  var strObjDelimited = msgStream.value.value.toString().split("|");
  var preJsonString = {};
  for (var i = 0; i < strObjDelimited.length; i++) {
    var pairWord = strObjDelimited[i].split(":");
    preJsonString[pairWord[0]] = pairWord[1];
  }
  var toJsonString = JSON.stringify(preJsonString);
  var msgXively = JSON.parse(toJsonString);
   if(_.isUndefined(msgXively.zoneto) || _.isEmpty(msgXively.zoneto)) {
    return response.status(400).json({error: "Zone/Socket or Device ID Must be defined"});
  }
  if(_.isUndefined(msgXively.tagId) || _.isEmpty(msgXively.tagId)) {
    return response.status(400).json({error: "Need Msg Id to Continue"});
  }  
  msgXively.zonefrom = "Vizix";
  var activePeople = appfire.child('people/'+msgXively.tagId);
  activePeople
    .once('value', function(snap) {
      if(snap.val()) {
         var newPeople = new Object();
         newPeople = snap.val();
         newPeople.zoneto= msgXively.zoneto;
         newPeople.zonefrom= msgXively.zonefrom;
         var activeOrder = appfire.child('orders/'+msgXively.tagId);
         activeOrder
          .once('value', function(snap) {
              newPeople.hasOrder = false;
              if(snap.val()) {
                 var currentOrder = snap.val();
                 if (currentOrder.active==1 || currentOrder.active=='1') {
                     newPeople.hasOrder = true;
                 } 
              } 
              io.sockets.emit('register', newPeople);
          });
       }
  });
  msgXively.remoteIp = remoteIp;
  sendRequests(msgXively);
  response.status(200).json({results: "Message Send"}); 
});
app.post("/vxively", function(request, response) {
  var remoteIp = getRemoteIp(request);
  var msgXively = request.body;
  if(_.isUndefined(msgXively) || _.isEmpty(msgXively)) {
    return response.status(400).json({error: "Invalid Data for Kiosk -- Body"});
  }
  if(_.isUndefined(msgXively.zoneto) || _.isEmpty(msgXively.zoneto)) {
    return response.status(400).json({error: "Zone/Socket or Device ID Must be defined"});
  }
  if(_.isUndefined(msgXively.tagId) || _.isEmpty(msgXively.tagId)) {
    return response.status(400).json({error: "Need Msg Id to Continue"});
  }
  msgXively.zonefrom = "Vizix";
  var activePeople = appfire.child('people/'+msgXively.tagId);
  activePeople
    .once('value', function(snap) {
      if(snap.val()) {
         var newPeople = new Object();
         newPeople = snap.val();
         newPeople.zoneto= msgXively.zoneto;
         newPeople.zonefrom= msgXively.zonefrom;
         var activeOrder = appfire.child('orders/'+msgXively.tagId);
         activeOrder
          .once('value', function(snap) {
              newPeople.hasOrder = false;
              if(snap.val()) {
                 var currentOrder = snap.val();
                 if (currentOrder.active==1 || currentOrder.active=='1') {
                     newPeople.hasOrder = true;
                 } 
              } 
              io.sockets.emit('register', newPeople);
          });
       }
  });
  msgXively.remoteIp = remoteIp;
  sendRequests(msgXively);
  response.status(200).json({results: "Message Send"}); 
});
// CR END ->: Pass : xively
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
        res.status(400).json({results: "Synchronization failed"});
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
function sendRequests(msgIn) {
  var newMsg = new Object();
  newMsg = msgIn;
  newMsg.timeStamp = new Date().getTime();
  var msgActive = appfire.child('requests');
  var newPostRef = msgActive.push();
  newPostRef
    .once('value', function(snap) {
      if(!snap.val()) {
         newPostRef.set(msgIn);
       } 
  });
}

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

function getRemoteIp(req) {
        return ( req.headers["X-Forwarded-For"]
                || req.headers["x-forwarded-for"]
                || req.client.remoteAddress );
};
