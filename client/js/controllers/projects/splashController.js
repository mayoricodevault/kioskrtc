xively.controller('splashController', ['$scope', '$rootScope', 'Socket','localStorageService','$location','sharedProperties','storeService', 'SubscriptionFactory', 'LSFactory' , '$window', 'API_URL', 'SessionsService',function($scope, $rootScope, Socket,localStorageService, $location,sharedProperties,storeService, SubscriptionFactory, LSFactory,$window, API_URL, SessionsService){
    $scope.base64 = '';
    storeService.jsonWrite('paneSelected',{id:'2'});

    Socket.on('register', function(data){
        if (LSFactory.getSessionId() === data.zoneto) {
               sharedProperties.setPerson(data);
               storeService.jsonWrite('paneSelected',{id:'1'});
               $location.path('/kiosk/select'); 
        }
    });
    
    Socket.on('unknown', function(data){
        if (LSFactory.getSessionId() === data.zoneto) {
            $location.path('/kiosk/register'); 
        }
    });
    
    Socket.on('ping', function(data){
        if (LSFactory.getSessionId() === data.sessionid) {
            var socketid = LSFactory.getSocketId();
            SessionsService.updateSessionStatus(socketid, data.ts);
        } else if (data.sessionid ==="All") {
            var socketid = LSFactory.getSocketId();
            SessionsService.updateSessionStatus(LSFactory.getSessionId() , data.ts);
        }
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
            if (data.action === 'snap') {
                $scope.base64 = '';
                $('#snap').html("");
                html2canvas(document.body, {
                  onrendered: function(canvas) {
                    var binaryData = canvas.toDataURL();  
                    $scope.base64  = binaryData.replace(/^data:image\/png;base64,/,"");
                    $('#snap').html('<img id="imgscreen" src="'+ $scope.base64 +'" />');
                    var snapname = LSFactory.getSocketId();
                    Socket.emit('snap',  {snapname :snapname, binaryData :  $scope.base64 });
                    $scope.base64= '';
                  }
                });

            }
        }
        
        
         
    });
  
    function subsError(response) {
        alert("error" + response.data);
    }
}])