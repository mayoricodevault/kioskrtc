
xively.controller('thankyouController', ['$scope', 'Socket','localStorageService','sharedProperties','$location','storeService','$timeout','OrdersService',function($scope, Socket,localStorageService,sharedProperties, $location,storeService,$timeout,OrdersService){

        
    
        //watch change local Storage;
        //var oldPeople=localStorageService.get('people');
        //$scope.people=oldPeople || [];
        
        
        //$scope.cleanOrders = OrdersService.getOrders();
        $scope.people=OrdersService.getOrders();
        //console.info("TAMANIO "+$scope.people.length);
       //console.info("dsd"+$scope.people[0].name);
        
        
        
        
         //get current Person of Local Storage 
        $scope.currentPerson=sharedProperties.getPerson();
        if($scope.currentPerson===undefined)
        {
             var oldPerson=localStorageService.get('currentPerson');
             $scope.currentPerson=oldPerson || [];
             
        }
        
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
        }, 10000000);
    };
    $scope.redirectSplash();
    
}]);