xively.controller('splashController', ['$scope', '$rootScope', 'Socket','localStorageService','$location','sharedProperties','storeService', 'SubscriptionFactory', 'LSFactory' , '$window', 'API_URL',function($scope, $rootScope, Socket,localStorageService, $location,sharedProperties,storeService, SubscriptionFactory, LSFactory,$window, API_URL){
    
    storeService.jsonWrite('paneSelected',{id:'2'});

    Socket.on('register', function(data){
       sharedProperties.setPerson(data);
       storeService.jsonWrite('paneSelected',{id:'1'});
       $location.path('/kiosk/select'); 

    });
    
    Socket.on('unknown', function(data){
       $location.path('/kiosk/register'); 
    });
    
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
  
    function subsError(response) {
        alert("error" + response.data);
    }
}])