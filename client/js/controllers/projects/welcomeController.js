
xively.controller('welcomeController', ['$scope', 'Socket','localStorageService','sharedProperties' ,function($scope, Socket,localStorageService,sharedProperties){
    
  
    
    /////////////// Welcome HI Name


    //get current Person of Local Storage 
    $scope.currentPerson=sharedProperties.getPerson();
    if($scope.currentPerson===undefined)
    {
         var oldPerson=localStorageService.get('currentPerson');
         $scope.currentPerson=oldPerson || [];
         
    }
    
    //Save current Person in Local Storage
    $scope.$watch('currentPerson',function(){
            localStorageService.set('currentPerson',$scope.currentPerson);
    },true);
    
    //////////////End Welcome HI Name
    
    
}])