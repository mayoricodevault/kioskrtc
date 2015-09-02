xively.controller('setupController',['$scope','$rootScope','$window',  'Api', 'Socket', 'SubscriptionFactory', 'LSFactory', 'API_URL', '$animate',function($scope,$rootScope,$window,  Api, Socket, SubscriptionFactory, LSFactory, API_URL, $animate){

	$scope.DeviceTye="KIOSK";
    $scope.serverSelected = "";
    $scope.devices = [];
    $scope.formShow = false;
    Api.Device.query({}, function(data){
   
        for(var key in data){
            // if(data[key].type=='Kiosk'){
                $scope.devices.push(data[key]);
            // }
           
        }
         $scope.formShow=$scope.devices.length > 0 ? true : false;
    });
    $scope.subscribe = function(deviceName,tagid, serverUrl, deviceType) {
        var typeLower = angular.lowercase(deviceType);
        $scope.formShow = false;
		var socket =  Socket.connect();
		$rootScope.ioConn = socket.id;
		SubscriptionFactory.subscribe($rootScope.ioConn, deviceName, tagid, serverUrl,typeLower).
		then(function success(response){
         	Socket.emit('subscribed', response);
         	if (typeLower==="kiosk") {
         	    	$window.location.href = API_URL+"/splash";
         	}
         	if (typeLower==="barista") {
         	   	$window.location.href = API_URL+"/barista";
         	}
         	if (typeLower==="dashboard") {
         	    	$window.location.href = API_URL+"/dashboard";
         	}
			
		}, subsError);
	};
	function subsError(response) {
		
		alert("error" + response.data);
	}
}])
.animation('.fade-left', function($animateCss){
    return {
        enter: function(element) {
            return $animateCss(element, {
                from : {
                    opacity: 0
                },
                to : {
                    opacity : 1
                },
                duration : 1.5
            });
        }
    }
});