xively.controller('wi4Controller', ['$scope','$timeout', function($scope, $timeout){
    var totals = [0, 0, 0, 0, 0, 0, 0];
    var nStates = 7;
    var percentLimits=[0.8,0.5,0.01];
    var percentClasses=["circle-40","circle-30","circle-20"];
    
    function getMax() {
        var max=1;
        if ($scope.state1 > max)
            max = $scope.state1;
        if ($scope.state2 > max)
            max = $scope.state2;
        if ($scope.state3 > max)
            max = $scope.state3;
        if ($scope.state4 > max)
            max = $scope.state4;
        if ($scope.state5 > max)
            max = $scope.state5;
        if ($scope.state6 > max)
            max = $scope.state6;
        return max;
    }
    $scope.circleClass40 = function(value) {
        var percent = (value*1.0)/getMax();
        return ((percent <= 1.0) && (percent >= percentLimits[0]))
    }
    $scope.circleClass30 = function(value) {
        var percent = (value*1.0)/getMax();
        return ((percent < percentLimits[0]) && (percent >= percentLimits[1]))
    }
    $scope.circleClass20 = function(value) {
        var percent = (value*1.0)/getMax();
        return ((percent < percentLimits[1]) && (percent >= percentLimits[2]))
    }
}]);