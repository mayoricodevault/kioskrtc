xively.controller('wi5Controller', ['$scope','$timeout', function($scope, $timeout){
    var totals = [0, 0, 0, 0, 0, 0, 0];
    var nStations = 3;
    var percentLimits=[0.9, 0.6, 0.05];
    var maxStation=1;
    $scope.getClouda = function(value) {
        var percent = (value*1.0)/maxStation;
        return ((percent <= 1.0) && (percent >= percentLimits[0]));
    };
    $scope.getCloudb = function(value) {
        var percent = (value*1.0)/maxStation;
        return ((percent < percentLimits[0]) && (percent >= percentLimits[1]));
    };
    $scope.getCloudc = function(value) {
        var percent = (value*1.0)/maxStation;
        return ((percent < percentLimits[1]) && (percent >= percentLimits[2]));
    };
    $scope.station1=0;
    $scope.station2=0;
    $scope.station3=0;
    function TimeCtrl() {
        
        $scope.clock = "loading clock..."; // initialise the time variable
        $scope.tickInterval = 2000; //ms
    
        var tick = function() {
            var indexState = Math.floor(Math.random()*nStations);
            if (indexState==1) totals[indexState] ++;
            else totals[indexState] += Math.floor(Math.random()*5);
            maxStation = 1;
            for (var i=0; i<nStations; i++) {
                if (totals[i]>maxStation) maxStation = totals[i];
            }
            $scope.station1 = totals[0];
            $scope.station2 = totals[1];
            $scope.station3 = totals[2];
            $timeout(tick, $scope.tickInterval); // reset the timer
        };
    
        // Start the timer
        $timeout(tick, $scope.tickInterval);
    }
    TimeCtrl();
}]);