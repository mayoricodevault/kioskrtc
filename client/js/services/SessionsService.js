xively.factory('SessionsService', ['$firebaseObject', 'FIREBASE_URI_ROOT', 'LSFactory', function ( $firebaseObject, FIREBASE_URI_ROOT, LSFactory) {
    var ref = new Firebase(FIREBASE_URI_ROOT+"/sessions");
    var activeSessions =  $firebaseObject(ref);
    var sessions =[]; 
    var getSessions = function () {
        return activeSessions;
    };
    var updateSessionStatus = function (socketid, ts, isdeleted) {
        var syncObject =  $firebaseObject(ref.child(socketid));
            syncObject.$loaded().then(function() {
                 if (syncObject.deviceName) {
                    syncObject.ping_dt =ts;
                    syncObject.isdeleted = isdeleted;
                    syncObject.$save();
                 } else {
                    syncObject.socketid = LSFactory.getSocketId();
                    syncObject.sessionid = LSFactory.getSessionId();
                    syncObject.deviceName = LSFactory.getDeviceName();
                    syncObject.deviceType = LSFactory.getDeviceType();
                    syncObject.serverUrl = LSFactory.getServerUrl();
                    syncObject.deviceDetected = LSFactory.getDeviceDetected();
                    syncObject.tagId =LSFactory.getTagId();
                    syncObject.masterid =LSFactory.getMasterId();
                    syncObject.ipaddr="0.0.0.0";
                    syncObject.ping_dt = ts;
                    syncObject.isdeleted = isdeleted;
                    syncObject.$save();
                 }
            });
        
    };
    
    function checkIfSessExists(sessId, exists) {
      ref.child(sessId).once('value', function(snap) {
        exists = (snap.val() !== null);
      });
      return exists;
    }
    
    function findActiveSess(sessId, activeSess) {
      activeSess = false;
      ref.child(sessId).once('value', function(snap) {
        if (snap.val() ) {
            activeSess = snap.val();
        }
      });
      return activeSess;
    }
    
    var addSession = function (session){
        activeSessions.$add(session);
    };

    var removeSession = function (socketid){
        var session_url = FIREBASE_URI_ROOT + '/sessions/' + socketid;
        var refSession = new Firebase(session_url);
        var syncObject = $firebaseObject(refSession);
         syncObject.$loaded().then(function() {
            syncObject.$remove();
        });
    };

    var findSession = function (sessId){
        return findActiveSess(sessId);
    };

    return {
        all: activeSessions,
        getSessions: getSessions,
        findSession: findSession,
        addSession: addSession,
        removeSession:removeSession,
        updateSessionStatus: updateSessionStatus
    };
}]);