
xively.controller('welcomeController', ['$scope', '$rootScope','Socket','localStorageService','sharedProperties','LSFactory', '$window','API_URL','SubscriptionFactory' ,function($scope, $rootScope, Socket,localStorageService,sharedProperties,LSFactory, $window,API_URL){
    
  
    Socket.on('sync', function(data){
        if (LSFactory.getSessionId() === data.sessionid) {
            if (data.action === 'reset') {
                SubscriptionFactory.unsubscribe(data.socketid).
            		then(function success(response){
                        LSFactory.setData("sessionid");
                        LSFactory.setData("socketid");
                        LSFactory.setData("serverUrl");
                        LSFactory.setData("deviceName");
                        $rootScope.user = null;
                        $rootScope.socketidSession = null;
                        Socket.disconnect(true);
            			$window.location.href = API_URL+"/splash";
            		}, subsError);
            }
        }
         
    });
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
    function subsError(response) {
		
		alert("error" + response.data);
	}
    
}])