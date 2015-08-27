xively.controller('setupController',['$scope','$rootScope','$window',  'Api', 'Socket', 'SubscriptionFactory', 'LSFactory', 'API_URL' ,function($scope,$rootScope,$window,  Api, Socket, SubscriptionFactory, LSFactory, API_URL){
	$scope.isFullScreen = false;

	$scope.DeviceTye="KIOSK";
	
    $scope.serverSelected = "";
    Api.Device.query({}, function(data){
    	$scope.devices=data;
    });
    Api.Server.query({}, function(data){
    	$scope.servers=data;
    }); 
    
    $scope.goFullscreen = function () {
		console.log("ASD");
      // Fullscreen
      if (Fullscreen.isEnabled())
         Fullscreen.cancel();
      else
         Fullscreen.all();

      // Set Fullscreen to a specific element (bad practice)
      // Fullscreen.enable( document.getElementById('img') )

   };



   $scope.goFullScreenViaWatcher = function() {
      $scope.isFullScreen = !$scope.isFullScreen;
   };
    
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