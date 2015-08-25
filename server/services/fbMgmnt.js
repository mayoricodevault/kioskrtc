var configDB = require('../config/database.js');
var Firebase = require('firebase');
var appfire = new Firebase(configDB.firebase);
//var activeVisitors = appfire.child('people');
var _ = require("underscore");
var moment = require('moment');
var sessionsConnections = [];
var dbManagement = {
  
  getSessionBySocketId: function(sessionId) {
      var fSession = _.find(sessionsConnections, function(sc){ return sc.sessionid == sessionId  });
      if (fSession) {
          return fSession;
      }
    return null;
  },
  getDBSessionBySessionId: function(sessionId) {
    var foundSession = appfire.child('sessions/'+sessionId);
    foundSession
      .once('value', function(snap) {
        if(snap.val()) {
            return foundSession.socketId;
         }
    });
    return null;
  },
  getDBSessionBySocketId : function(socketId) {
    var foundSession = appfire.child('sessions/'+socketId);
    foundSession
      .once('value', function(snap) {
        if(snap.val()) {
            return snap.val().sessionid;
         }
    });
    return null;
  },
  getDBSessionByTagId : function(tagid) {
    var foundSessions = appfire.child('sessions');
    foundSessions.orderByChild("tagId").equalTo(tagid).on("child_added", function(snapshot) {
        return snapshot.socketId;
    });
    return null;
  },
  subscribe: function(sessionData) {
    var foundSession = appfire.child('sessions/'+sessionData.socketid);
    foundSession
      .once('value', function(snap) {
        var sess = new Object();
        sess.sessionid = sessionData.sessionid;
        sess.socketid = sessionData.socketid;
        sess.deviceName = sessionData.deviceName;
        sess.tagId = sessionData.tagId;
        sess.serverUrl = sessionData.serverUrl;
        sess.ipaddr = process.env.IP;
        sess.stamp = moment().format();
        if(!snap.val()) {
             foundSession.set(sess);
         }
    });

    
  },
  unsubscribe: function(socketid) {
    var foundSession = new appfire.child('sessions/'+socketid);
    foundSession.remove(function(error) {
      if (error) {
        console.log('Synchronization failed');
      } else {
        console.log('Synchronization succeeded');
      }
    });
  },
  getPeople : function (people) {
     var isKnown = true;
     var activePeople = appfire.child('people/'+dbManagement.escapeEmail(people.email));
      activePeople
        .once('value', function(snap) {
          if(!snap.val()) {
             isKnown = false;   
             activePeople.set(people);
           }
        });
      return  isKnown; 
  },
  escapeEmail: function(email) {
    return (email || '').replace('.', ',');
  },
  unescapeEmail: function(email) {
      return (email || '').replace(',', '.');
  }
};

module.exports = dbManagement;