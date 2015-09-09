xively.controller('thankyouController', ['$scope', 'Socket','localStorageService','sharedProperties','$location','storeService','$timeout','LSFactory','SessionsService', 'Orders', 'FIREBASE_URI_ORDERS','$route' ,function($scope, Socket,localStorageService,sharedProperties, $location,storeService,$timeout, LSFactory, SessionsService,Orders, FIREBASE_URI_ORDERS,$route){
    
    
    $scope.currentPerson;
    $scope.baristaTagID;
    
    var baristaTagOld=LSFactory.getMasterId();
    $scope.baristaTagID=baristaTagOld;
    
    var oldPerson=localStorageService.get('currentPerson');
    $scope.currentPerson=oldPerson || [];
    $scope.people=[];
    
    Orders(FIREBASE_URI_ORDERS).$bindTo($scope, "fbBind");
    $scope.$watch('fbBind', function() {
        refreshFb();
    });    
    
    function refreshFb(){
	    var total = 0;
	    $scope.totalOrdersActive=0;
		$scope.people = [];
		angular.forEach($scope.fbBind, function(order){
			if (!order || !order.name) {
				return;
			}
			
	        if (order.active==1 &&  $scope.baristaTagID==order.masterId ) {
	            $scope.people.push(order);
	            $scope.totalOrdersActive++;
	        }
        	total++;
		}); 
		$scope.totalOrders = total;
		$scope.people.sort(compare);
	
		if($scope.totalOrdersActive>0 ){
		    
		   	$scope.currentIndex=$scope.totalOrdersActive;
	    	$scope.currentPerson=$scope.people[$scope.currentIndex-1];
	    	console.log($scope.currentPerson,"cuure");
		}
	}

    Socket.on('sync', function(data){
            if (LSFactory.getSessionId() === data.sessionid) {
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
  
    
    Socket.on('ping', function(data){
        var socketid = LSFactory.getSocketId();
        if (LSFactory.getSessionId() === data.sessionid) {
            SessionsService.updateSessionStatus(socketid, data.ts, data.isdeleted);
        } else {
            if (data.sessionid=="All") {
                SessionsService.updateSessionStatus(socketid, 0 , false);
            }
        }
    });


    if ($scope.people.length>9){
      $scope.people.shift();
    }
    
    $scope.redirectSplash=function(){
         $timeout(function() {
             
        
        $timeout(function() {
        location.reload();    
        },500);
        $location.path("/splash");
        }, 15000);
        
        
        
        
    };
    
    function compare(a,b) {
        if (a.timeStamp < b.timeStamp)
            return -1;
        if (a.timeStamp > b.timeStamp)
            return 1;
    return 0;
    }
    
    $scope.redirectSplash();
    
}]);