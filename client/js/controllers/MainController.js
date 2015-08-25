'use strict';

xively.controller('MainCtrl', function(Api, $scope, shareComponentService, SubscriptionFactory , $rootScope, Socket, $window, API_URL, LSFactory) {
	$scope.DeviceTye="KIOSK";
	$scope.locations = [];
	$scope.servers = [];
	$scope.locationId = null;
	$scope.serverId = null;
	$rootScope.Session = null;
	
	$scope.subscribe($scope.DeviceTye, 100, 1);

	SubscriptionFactory.getSession().then(function success(response){
		$rootScope.Session = response.data;	
	});
	
	$scope.subscribe = function(deviceType,locationId, serverId) {
		$scope.ioConn = Socket.connect();
		SubscriptionFactory.subscribe($scope.ioConn, deviceType, locationId, serverId).
		then(function success(response){
			LSFactory.setData("scio", response.data.scio);
         	LSFactory.setData("locationid", response.data.locationid);
         	LSFactory.setData("serverid", response.data.serverid);
         	Socket.on('subscribed', response);
			console.log("Success"+ response.data.scio);
			$window.location.href = API_URL+"/splash";
		}, subsError);
		
	}
	
	$scope.unsubscribe = function() {
		SubscriptionFactory.unsubscribe();
		LSFactory.setData("scio");
        LSFactory.setData("locationid");
        LSFactory.setData("serverid");
		$rootScope.user = null;
		$rootScope.socketidSession = null;
		Socket.disconnect(true);
		$window.location.href = API_URL;
	}
	function subsError(response) {
		alert("error" + response.data);
	}
})