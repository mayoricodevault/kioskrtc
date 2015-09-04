xively.controller('baristaController', ['$scope','$location','localStorageService','Socket','$http','OrdersService','API_URL', 'LSFactory','Orders','FIREBASE_URI_ORDERS', 'SessionsService','SubscriptionFactory', function ($scope, $location,localStorageService,Socket,$http,OrdersService,API_URL, LSFactory, Orders, FIREBASE_URI_ORDERS, SessionsService, SubscriptionFactory) {
    
    $scope.currentPerson;
    $scope.currentIndex;
    $scope.serveOrders = [];
    $scope.orders = [];
    $scope.totalOrders = 0;
    $scope.totalOrdersActive = 0;
    $scope.currentfavcoffee;
    $scope.baristaTagID;
    
    Orders(FIREBASE_URI_ORDERS).$bindTo($scope, "fbBind");
    $scope.$watch('fbBind', function() {
        refreshFb();
    });    
    
    var currentPersonOld=localStorageService.get('currentPerson');
    $scope.currentPerson=currentPersonOld || [];
    
    var currentIndexOld=localStorageService.get('currentIndex');
    $scope.currentIndex=currentIndexOld || 0;
    
    var baristaTagOld=LSFactory.getTagId();
    $scope.baristaTagID=baristaTagOld;
    
    $scope.$watch('currentPerson',function(){
        if($scope.currentPerson){
            console.log($scope.currentPerson);
            $http.post('https://kiosk-mmayorivera.c9.io/weather',$scope.getPlace($scope.currentPerson))
        	.success(function(data){
        		$scope.weather=data.query.results.channel;
            });
            $scope.coffee($scope.currentPerson.favcoffee);
            localStorageService.set('currentPerson',$scope.currentPerson);
        }
    },true);
    $scope.$watch('currentIndex',function(){
        localStorageService.set('currentIndex',$scope.currentIndex);
    },true);

    $scope.served=function(){
        var people=$scope.currentPerson;
		people.zonefrom = LSFactory.getSessionId();
		OrdersService.updateOrderStatus(people, 0);
        $scope.orders.sort(compare);
        for(var i=0;i<$scope.orders.length;i++){
            $scope.currentIndex=i;
            $scope.currentPerson=$scope.orders[i];
            if($scope.orders[i].active==1 && $scope.orders[i].masterId==$scope.baristaTagID)
                break;
        }
        $scope.totalOrdersActive--;
    };
    
    $scope.isActiveOrder=function(active)
    {
        if(active==1)
            return true;
        return false;
    };
    
    $scope.isActive=function(email){
 	    if(email===$scope.currentPerson.email && $scope.totalOrdersActive>0){
 	        return true;
 	    }
 	    return false;
 	};
    
    $scope.active=function(person,index) {
         $scope.currentPerson=person;
         $scope.currentIndex=index;
        $scope.coffee($scope.currentPerson.favcoffee);
        $scope.userSearch.name="";        
         
    };

   
	
	function refreshFb(){
	    var total = 0;
	    $scope.totalOrdersActive=0;
		$scope.orders = [];
		angular.forEach($scope.fbBind, function(order){
			if (!order || !order.name) {
				return;
			}
	        $scope.orders.push(order);
	        if (order.active==1 && order.masterId==$scope.baristaTagID) {
	            $scope.totalOrdersActive++;
	        }
        	total++;
		}); 
		$scope.totalOrders = total;
		$scope.orders.sort(compare);
		if($scope.totalOrdersActive==1 ){
		    for(var i=0;i<$scope.totalOrders;i++){
		        if($scope.orders[i].active==1 && $scope.orders[i].masterId==$scope.baristaTagID){
		            $scope.currentIndex=i;
		            $scope.currentPerson=$scope.orders[i];
		        }
		    }
		}
	}
    $scope.coffee= function(coffee){
   
        if(coffee==="Espresso")
            $scope.currentfavcoffee="esp";
        if(coffee==="Cappuccino")
            $scope.currentfavcoffee="cap";
        if(coffee==="Regular Coffee")
            $scope.currentfavcoffee="reg";
        if(coffee==="Tea")
            $scope.currentfavcoffee="tea";
        if(coffee==="Decaf Coffee")
            $scope.currentfavcoffee="dec";
        if(coffee==="Americano")
            $scope.currentfavcoffee="amer";
    };
    
    Socket.on('ping', function(data){
        console.log(data);
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
    
    function compare(a,b) {
        if (a.timeStamp < b.timeStamp)
            return -1;
        if (a.timeStamp > b.timeStamp)
            return 1;
    return 0;
    }
    
    function replaceAll( text){
      while (text.toString().indexOf(".") != -1)
          text = text.toString().replace(".",",");
      return text;
    }
    $scope.getPlace=function(person){
         $scope.place ={"city":person.city,"state":person.state};
         return $scope.place;
    };
    
}]);