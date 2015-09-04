
xively.controller('thankyouController', ['$scope', 'Socket','localStorageService','sharedProperties','$location','storeService','$timeout','OrdersService', 'LSFactory','SessionsService' ,function($scope, Socket,localStorageService,sharedProperties, $location,storeService,$timeout,OrdersService, LSFactory, SessionsService){
    
    //$scope.people=[] || OrdersService.getOrdersArray();
    $scope.people=OrdersService.getOrdersArray(); 
    $scope.currentPerson;
    
    Socket.on('ping', function(data){
        var socketid = LSFactory.getSocketId();
        if (LSFactory.getSessionId() === data.sessionid) {
            SessionsService.updateSessionStatus(socketid, data.ts);
        } else {
            SessionsService.updateSessionStatus(LSFactory.getSocketId() , data.ts);
        }
    });
  
    var oldPerson=localStorageService.get('currentPerson');
    $scope.currentPerson=oldPerson || [];
    
    if ($scope.people.length>9){
      $scope.people.shift();
    }
    
    Socket.on('register', function(data){
        sharedProperties.setPerson(data);
        storeService.jsonWrite('paneSelected',{id:'1'});
        $location.path('/kiosk/select'); 
    });
    
    $scope.redirectSplash=function(){
         $timeout(function() {
         $location.path('/splash'); 
        }, 25000);
    };
    
    $scope.redirectSplash();
    
}]);