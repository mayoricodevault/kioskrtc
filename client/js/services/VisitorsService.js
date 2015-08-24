xively.factory('VisitorsService', ['$firebaseObject', 'FIREBASE_URI', function ($firebaseObject, FIREBASE_URI) {
    var ref = new Firebase(FIREBASE_URI);
    var activeVisitors = $firebaseObject(ref);
    var getVisitors = function () {
        return activeVisitors;
    };

    return {
        getVisitors: getVisitors
    };
}]);