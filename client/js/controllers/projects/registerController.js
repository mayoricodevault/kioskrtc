
xively.controller('registerController', ['$scope', '$rootScope', 'Socket','localStorageService','VisitorsService', 'sharedProperties' ,'LSFactory','SubscriptionFactory','$window', 'API_URL',function($scope, $rootScope, Socket,localStorageService, VisitorsService, sharedProperties, LSFactory,SubscriptionFactory, $window, API_URL){
   
    $scope.cleanVisitors = VisitorsService.getVisitors();
    $scope.visitors = [];
    $scope.selected = undefined;
    
    $scope.$watch('cleanVisitors', function () {
        visitorsToArray($scope.cleanVisitors);
		
	}, true);
    
   Socket.on('sync', function(data){
        if (LSFactory.getSessionId() === data.sessionid) {
            if (data.action === 'reset') {
                SubscriptionFactory.unsubscribe(data.socketid).
            		then(function success(response){
                        LSFactory.setData("sessionid");
                        LSFactory.setData("socketid");
                        LSFactory.setData("serverUrl");
                        LSFactory.setData("deviceName");
                        $rootScope.user = null;
                        $rootScope.socketidSession = null;
                        Socket.disconnect(true);
            			$window.location.href = API_URL+"/splash";
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
    
    $scope.reset = function () {
        $scope.visitors = null;
        $scope.visitors = VisitorsService.getVisitors();
    };
    
    function visitorsToArray(oVisitors) {
        var total = 0;
		$scope.visitors = [];
		oVisitors.forEach(function (visitor) {
			// Skip invalid entries so they don't break the entire app.
			if (!visitor || !visitor.name) {
				return;
			}
            $scope.visitors.push(visitor);    
			total++;
		});
		$scope.totalCount = total;
    }
    
    $scope.selectUser = function(){
        console.log("selected --> ",$scope.selected.name);
        sharedProperties.setPerson($scope.selected);
    }
    function subsError(response) {
        alert("error" + response.data);
    }
}]);