xively.controller('wi4Controller', ['$scope','$timeout', function($scope, $timeout){
    var totals = [0, 0, 0, 0, 0, 0, 0];
    var nStates = 7;
    var percentLimits=[0.8,0.5,0.1];
    var percentClasses=["circle-40","circle-30","circle-20"];
    var total=1;
    $scope.circleClass40 = function(value) {
        var percent = (value*1.0)/total;
        return ((percent <= 1.0) && (percent >= percentLimits[0]))
    }
    $scope.circleClass30 = function(value) {
        var percent = (value*1.0)/total;
        return ((percent < percentLimits[0]) && (percent >= percentLimits[1]))
    }
    $scope.circleClass20 = function(value) {
        var percent = (value*1.0)/total;
        return ((percent < percentLimits[1]) && (percent >= percentLimits[2]))
    }
    function TimeCtrl() {
        $scope.state1=0;
        $scope.state2=0;
        $scope.state3=0;
        $scope.state4=0;
        $scope.state5=0;
        $scope.state6=0;
        $scope.state7=0;
        $scope.clock = "loading clock..."; // initialise the time variable
        $scope.tickInterval = 2000; //ms
    
        var tick = function() {
            var indexState = Math.floor(Math.random()*nStates);
            totals[indexState] += Math.floor(Math.random()*5);
            total = 1;
            for (var i=0; i<nStates; i++) {
                if (totals[i]>total) total = totals[i];
            }
            $scope.state1=totals[0];
            $scope.state2=totals[1];
            $scope.state3=totals[2];
            $scope.state4=totals[3];
            $scope.state5=totals[4];
            $scope.state6=totals[5];
            $scope.state7=totals[6];
            
            $timeout(tick, $scope.tickInterval); // reset the timer
        };
    
        // Start the timer
        $timeout(tick, $scope.tickInterval);
    }
    TimeCtrl();
}]);