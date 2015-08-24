
xively.controller('registerController', ['$scope', 'Socket','localStorageService','VisitorsService', 'sharedProperties' ,function($scope, Socket,localStorageService, VisitorsService, sharedProperties){
   
    $scope.cleanVisitors = VisitorsService.getVisitors();
    $scope.visitors = [];
    $scope.selected = undefined;
    
    $scope.$watch('cleanVisitors', function () {
        visitorsToArray($scope.cleanVisitors);
		
	}, true);
    
    Socket.on('sync', function(data){
        if (data.action == 'restart') {
            // goto to splacj
        }
    });
    
    $scope.reset = function () {
        $scope.visitors = null;
        $scope.visitors = VisitorsService.getVisitors();
    };
    
    function visitorsToArray(oVisitors) {
        var total = 0;
		$scope.visitors = [];
		oVisitors.forEach(function (visitor) {
			// Skip invalid entries so they don't break the entire app.
			if (!visitor || !visitor.name) {
				return;
			}
            $scope.visitors.push(visitor);    
			total++;
		});
		$scope.totalCount = total;
    }
    
    $scope.selectUser = function(){
        console.log("selected --> ",$scope.selected.name);
        sharedProperties.setPerson($scope.selected);
    }
    
}]);