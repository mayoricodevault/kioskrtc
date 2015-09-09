xively.controller('splashController', ['$scope', '$rootScope', 'Socket','localStorageService','$location','sharedProperties','storeService', 'SubscriptionFactory', 'LSFactory' , '$window', 'API_URL', 'SessionsService','OrdersService',function($scope, $rootScope, Socket,localStorageService, $location,sharedProperties,storeService, SubscriptionFactory, LSFactory,$window, API_URL, SessionsService,OrdersService){
    $scope.base64 = '';
    storeService.jsonWrite('paneSelected',{id:'2'});
    Socket.on('register', function(data){

        if (SubscriptionFactory.isStation(data.zoneto)) {
           sharedProperties.setPerson(data);
           var orders=[];
           orders=OrdersService.getOrdersArray();   
           if(getOrderCoffee(orders,data)){
                 storeService.jsonWrite('paneSelected',{id:'3'});
           }
               
            else
            {
             storeService.jsonWrite('paneSelected',{id:'1'});
            }
           $location.path('/kiosk/select'); 
           
        }
    });
    
    Socket.on('unknown', function(data){
        if (SubscriptionFactory.isStation(data.zoneto)) {
            $location.path('/kiosk/register'); 
        }
    });
    
    Socket.on('ping', function(data){
        var socketid = LSFactory.getSocketId();
        if (LSFactory.getSessionId() === data.sessionid) {
            console.log(data);
            SessionsService.updateSessionStatus(socketid, data.ts, data.isdeleted);
        } else {
            if (data.sessionid=="All") {
                SessionsService.updateSessionStatus(socketid, 0 , false);
            }
        }
    });
    
    Socket.on('sync', function(data){
        if (LSFactory.getSessionId() === data.sessionid) {
            if (data.action === 'reset') {
                SubscriptionFactory.unsubscribe(data.socketid).
            		then(function success(response){
                        Socket.disconnect(true);
            			$window.location.href = API_URL+"/settings";
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
        console.log("Error");
    }
    
        
     function getOrderCoffee(orders,obj) {
    	    var isOrder=false;
    		orders.forEach(function (order) {
    		   var active = parseInt(order.active);
    		
    			if (order.email === obj.email && active === 1) {
    			   isOrder=true;
    			}
    		});
    		return isOrder;
        } // end function 
    
}])