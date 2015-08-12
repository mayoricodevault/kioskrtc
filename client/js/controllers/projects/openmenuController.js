xively.controller('openmenuController', ['$scope', 'Socket', function($scope, Socket){
    Socket.connect();
    $scope.numberofusers=0;
    $scope.individualBoard=0;

    Socket.on('xternal', function(data){
    
        if (data.action=="iu") {
            $scope.numberofusers = data.value;
        }
        if (data.action=="ib") {
            $scope.individualBoard = data.value;
        }
        if (data.action=="reset") {
            $scope.individualBoard = data.value;
            $scope.numberofusers = data.value;
        }
        
         
    });
    
    $scope.$on('$locationChangeStart', function(event){
        Socket.disconnect(true);
    })
}])