
xively.controller('thankyouController', ['$scope', 'Socket','localStorageService','sharedProperties','$location','storeService','$timeout',function($scope, Socket,localStorageService,sharedProperties, $location,storeService,$timeout){

        $scope.people = [];
    
        //watch change local Storage;
        var oldPeople=localStorageService.get('people');
        $scope.people=oldPeople || [];
        
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
        }, 10000);
    };
    $scope.redirectSplash();
}]);