xively.controller('setupController',['$scope','$rootScope','$window',  'Api', 'Socket', 'SubscriptionFactory', 'LSFactory', 'API_URL', '$animate', 'deviceDetector', 'ngToast','$location',function($scope,$rootScope,$window,  Api, Socket, SubscriptionFactory, LSFactory, API_URL, $animate, deviceDetector, ngToast, $location){
    $scope.deviceDetector=deviceDetector;
	$scope.DeviceTye="KIOSK";
    $scope.serverSelected = "";
    $scope.devices = [];
    $scope.formShow = true;
    Api.Device.query({}, function(data){
        for(var key in data){
                $scope.devices.push(data[key]);
        }
        $scope.formShow=$scope.devices.length > 0 ? true : false;
    });
    $scope.subscribe = function(deviceName,tagid, serverUrl, deviceType, masterid) {
        $scope.formShow = false;
        var typeLower = angular.lowercase(deviceType);
		var socket =  Socket.connect();
		var deviceDetected = deviceDetector.os + " "+deviceDetector.browser;
		$rootScope.ioConn = socket.id;
        if (!masterid) masterid=""; 
		SubscriptionFactory.subscribe($rootScope.ioConn, deviceName, tagid, serverUrl, typeLower, deviceDetected, masterid).
		then(function success(response){
		    if (response.status == 200) {
             	Socket.emit('subscribed', response);
             	if (typeLower==="kiosk") {typeLower="splash"}
             	$location.path('/'+typeLower);
		    } else {
		        $scope.formShow = true;
		        ngToast.create({
                  className: 'warning',
                  content: response.data
                });
		    }
		});
	};
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