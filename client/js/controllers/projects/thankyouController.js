
xively.controller('thankyouController', ['$scope', 'Socket','localStorageService','sharedProperties',function($scope, Socket,localStorageService,sharedProperties){

   $scope.actual=sharedProperties.getPerson();
    
}])