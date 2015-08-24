xively.controller('settingsController',['$scope',function($scope){
    
    $scope.ubications =["Zone A", "Zone B","Zone C","Zone D","Zone E"];
    $scope.ubSelected = "";
    
    $scope.servers =["Server A", "Server B","Server C","Server D","Server E"];
    $scope.svSelected = "";
    
    $scope.setData = function(){
        console.log("ubication: ",$scope.ubSelected);
        console.log("server: ",$scope.svSelected);
    }
}]);