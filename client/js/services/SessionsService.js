xively.factory('SessionsService', ['$firebaseObject', 'FIREBASE_URI_ROOT', 'LSFactory', function ( $firebaseObject, FIREBASE_URI_ROOT, LSFactory) {
    var ref = new Firebase(FIREBASE_URI_ROOT+"/sessions");
    var activeSessions =  $firebaseObject(ref);
    var getSessions = function () {
        return activeSessions;
    };
    
    var updateSessionStatus = function (socketid, ts) {
        var syncObject =  $firebaseObject(ref.child(socketid));
        if (syncObject.deviceName) {
            syncObject.$loaded().then(function() {
                syncObject.ping_dt =ts;
                syncObject.$save();
            });
        } else {
            syncObject.$loaded().then(function() {
                syncObject.socketid = LSFactory.getSocketId();
                syncObject.sessionid = LSFactory.getSessionId();
                syncObject.deviceName = LSFactory.getDeviceName();
                syncObject.deviceType = LSFactory.getDeviceType();
                syncObject.serverUrl = LSFactory.getServerUrl();
                syncObject.tagId =LSFactory.getTagId();
                syncObject.ipaddr;
                syncObject.ping_dt = ts;
                syncObject.$save();
            });
            
        }
    };
    
    
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

    return {
        all: activeSessions,
        getSessions: getSessions,
        addSession: addSession,
        removeSession:removeSession,
        updateSessionStatus: updateSessionStatus
    };
}]);