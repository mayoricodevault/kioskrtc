xively.controller('setupController',['$scope','$rootScope','$window',  'Api', 'Socket', 'SubscriptionFactory', 'LSFactory', 'API_URL',function($scope,$rootScope,$window,  Api, Socket, SubscriptionFactory, LSFactory, API_URL){
	$scope.DeviceTye="KIOSK";
	
    $scope.serverSelected = "";
    Api.Device.query({}, function(data){
    	$scope.devices=data;
    });
    Api.Server.query({}, function(data){
    	$scope.servers=data;
    }); 
    
    $scope.subscribe = function(deviceName,tagId, serverUrl) {
		var socket =  Socket.connect();
		$rootScope.ioConn = socket.id;
		SubscriptionFactory.subscribe($rootScope.ioConn, deviceName, tagId, serverUrl).
		then(function success(response){
			LSFactory.setData("sessionid", response.data.sessionid);
			LSFactory.setData("socketid", response.data.socketid);
         	LSFactory.setData("deviceName", response.data.deviceDesc);
         	LSFactory.setData("serverUrl", response.data.serverUrl);
         	Socket.emit('subscribed', response);
			$window.location.href = API_URL+"/splash";
		}, subsError);
		
	}
	function subsError(response) {
		
		alert("error" + response.data);
	}
}]);