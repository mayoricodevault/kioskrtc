xively.controller('settingsController',['$scope',function($scope){
    
    $scope.ubications =[];
    $scope.ubSelected = "";
    
    $scope.servers =[];
    $scope.svSelected = "";
    
    $scope.setData = function(){
        console.log("ubication: ",$scope.ubSelected);
        console.log("server: ",$scope.svSelected);
    }
}]);