xively.factory('SessionsService', ['$firebaseObject', 'FIREBASE_URI_ROOT', function ( $firebaseObject, FIREBASE_URI_ROOT) {
    var ref = new Firebase(FIREBASE_URI_ROOT+"/sessions");
    var activeSessions =  $firebaseObject(ref);
    var getSessions = function () {
        return activeSessions;
    };
    
    var updateSessionStatus = function (socketid, ts) {
        console.log(activeSessions);
        var session_url = FIREBASE_URI_ROOT + '/sessions/' + socketid;
        var refSession = new Firebase(session_url);
        var syncObject = $firebaseObject(refSession);
        syncObject.$loaded().then(function() {
                syncObject.status ='online';
                syncObject.ping_dt =ts;
                syncObject.$save();
        });
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