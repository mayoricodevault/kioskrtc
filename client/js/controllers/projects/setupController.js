xively.controller('setupController',['$scope','$rootScope','$window',  'Api', 'Socket', 'SubscriptionFactory', 'LSFactory', 'API_URL', '$animate', 'deviceDetector',function($scope,$rootScope,$window,  Api, Socket, SubscriptionFactory, LSFactory, API_URL, $animate, deviceDetector){
    $scope.deviceDetector=deviceDetector;
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
    $scope.subscribe = function(deviceName,tagid, serverUrl, deviceType, masterid) {
        var typeLower = angular.lowercase(deviceType);
        $scope.formShow = false;
		var socket =  Socket.connect();
		var deviceDetected = deviceDetector.os + " "+deviceDetector.browser;
		$rootScope.ioConn = socket.id;
        if (!masterid) masterid=""; 
		SubscriptionFactory.subscribe($rootScope.ioConn, deviceName, tagid, serverUrl, typeLower, deviceDetected, masterid).
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
			if (typeLower==="welcome") {
         	    	$window.location.href = API_URL+"/welcome";
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