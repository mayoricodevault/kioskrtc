xively.controller('splashController', ['$scope', 
    '$rootScope', 
    'Socket',
    '$location',
    'storeService',
    'SubscriptionFactory', 
    'LSFactory' ,
    '$window', 
    'SessionsService',
    'Orders',
    'Sessions',
    'FIREBASE_URI_ORDERS',
    'FIREBASE_URI_SESSIONS',
    'API_URL','localStorageService', 
    function($scope, 
    $rootScope, 
    Socket, 
    $location, 
    storeService, 
    SubscriptionFactory, 
    LSFactory,
    $window, 
    SessionsService,
    Orders,
    Sessions,
    FIREBASE_URI_ORDERS,
    FIREBASE_URI_SESSIONS,
    API_URL,localStorageService){
    $scope.base64 = '';
    $scope.orders = [];
    
    $scope.sessions = [];
    Orders(FIREBASE_URI_ORDERS).$bindTo($scope, "fbOBind");
    $scope.isFavorite="splash";
    $scope.$watch('isFavorite',function(){
        localStorageService.set('isFavorite',$scope.isFavorite);
    },true);
    
    $scope.$watch('fbOBind', function() {
		$scope.orders = [];
		angular.forEach($scope.fbOBind, function(order){
			if (!order || !order.active) {
				return;
			}
            $scope.orders.push(order);
		}); 
    });   
    Sessions(FIREBASE_URI_SESSIONS).$bindTo($scope, "fbSBind");
    $scope.$watch('fbSBind', function() {
		$scope.sessions = [];
		angular.forEach($scope.fbSBind, function(session){
			if (!session || !session.socketid) {
				return;
			}
            $scope.sessions.push(session);
		}); 
    });  
    storeService.jsonWrite('paneSelected',{id:'2'});
    Socket.on('register', function(data){
        $rootScope.currentPerson = data;
        console.log("data --> ",data);
        if (isStation(data.zoneto)) {
           if(getOrderCoffee(data.email)){
                storeService.jsonWrite('paneSelected',{id:'3'});
                $location.path('/kiosk/select');
           }  else {
             storeService.jsonWrite('paneSelected',{id:'1'});
             $location.path('/kiosk/select');
           }
        }
    });
    
    Socket.on('unknown', function(data){
         $rootScope.currentPerson = data;
        if (isStation(data.zoneto)) {
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
    function getOrderCoffee(personId) {
       var isOrder=false;
       console.log("getOrderCoffee --> ", $scope.orders);
        var activeOrder = _.find($scope.orders, function(findord) {
                return findord.email === personId && parseInt(findord.active,10) == 1 ; 
        });
        if (activeOrder) {
            if (activeOrder.active == 1  || activeOrder.active =='1') {
                isOrder = true;
            }
         }
		return isOrder;
    } // end function 
    function isStation(tagId) {
       var thisOneIsCall=false;
       var thisSi = LSFactory.getSocketId();
       var activeSession = _.find($scope.sessions, function(findses) {
            return findses.tagId == tagId || findses.socketid == tagId && findses.socketid == thisSi; 
        });
        if (activeSession) {
            thisOneIsCall = true;
         }
		return thisOneIsCall;
    } 
}]);