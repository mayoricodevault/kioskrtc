xively.controller('wi5Controller', ['$scope','$timeout', function($scope, $timeout){
    var totals = [0, 0, 0, 0, 0, 0, 0];
    var nStations = 3;
    var percentLimits=[0.9, 0.6, 0.01];
    var maxStation=1;
    function getMaxStation() {
        maxStation = 1;
        if ($scope.station1 > maxStation)
            maxStation = $scope.station1;
        if ($scope.station2 > maxStation)
            maxStation = $scope.station2;
        if ($scope.station3 > maxStation)
            maxStation = $scope.station3;
        return maxStation;
    }
    $scope.getClouda = function(value) {
        var percent = (value*1.0)/getMaxStation();
        return ((percent <= 1.0) && (percent >= percentLimits[0]));
    };
    $scope.getCloudb = function(value) {
        var percent = (value*1.0)/getMaxStation();
        return ((percent < percentLimits[0]) && (percent >= percentLimits[1]));
    };
    $scope.getCloudc = function(value) {
        var percent = (value*1.0)/getMaxStation();
        return ((percent < percentLimits[1]) && (percent >= percentLimits[2]));
    };
}]);