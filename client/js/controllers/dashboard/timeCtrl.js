xively.controller('timeCtrl', ['$scope','$timeout', function($scope, $timeout){
    // Chart
    $scope.labels = ['ESP', 'AMER', 'REG', 'DCAF', 'CAP', 'TEA'];
    $scope.series = ['COFFEE'];

    $scope.data = [
        [34, 20, 44, 6, 24, 18]
    ];
    // end Chart 
    function TimeCtrl() {
        $scope.clock = "loading clock..."; // initialise the time variable
        $scope.tickInterval = 1000; //ms
    
        var tick = function() {
            $scope.clock = Date.now(); // get the current time
            $timeout(tick, $scope.tickInterval); // reset the timer
        };
    
        // Start the timer
        $timeout(tick, $scope.tickInterval);
    }
    TimeCtrl();
}]);