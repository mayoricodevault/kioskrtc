var configDB = require('../config/database.js');
var Firebase = require('firebase');
var geappfire = new Firebase(configDB.firebase);
var _ = require("underscore");
var moment = require('moment');
var sessionsConnections = [];
var deviceManagement = {
  getSessionByTag: function(tagId) {
    var logVisitors = appfire.child('people');
      var fSession = _.find(sessionsConnections, function(sc){ return sc.tagId == tagId  });
      if (fSession) {
          return fSession;
      }
    return null;
  },
  getSessionBySocketId: function(sessionId) {
      var fSession = _.find(sessionsConnections, function(sc){ return sc.sessionid == sessionId  });
      if (fSession) {
          return fSession;
      }
    return null;
  },
  subscribe: function(sessionData) {
    var sess = new Object();
    sess.sessionid = sessionData.sessionId;
    sess.socketid = sessionData.socketId;
    sess.tagid = sessionData.deviceType;
    sess.locationid = sessionData.locationId;
    sess.serverid = sessionData.serverId;
    sess.ipaddr = process.env.IP;
    sess.stamp = moment().format();
    activeSessions.set(sess);
  },
  unsubscribe: function(sessionId) {
    sessionsConnections =  _.without(sessionsConnections, _.findWhere(sessionsConnections, {id: 3}));
  },
  
};

module.exports = deviceManagement;