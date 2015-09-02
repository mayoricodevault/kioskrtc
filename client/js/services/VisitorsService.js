xively.factory('VisitorsService', ['$firebaseArray', 'FIREBASE_URI', function ($firebaseArray, FIREBASE_URI) {
    var ref = new Firebase(FIREBASE_URI);
    var activeVisitors = $firebaseArray(ref);
    var getVisitors = function () {
        return activeVisitors;
    };

    return {
        getVisitors: getVisitors
    };
}]);