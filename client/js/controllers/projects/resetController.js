xively.controller('resetController', ['$scope', 
    'Socket',
    'SubscriptionFactory', 
    'LSFactory' ,
    '$window',
    'API_URL',
    function($scope, 
    Socket, 
    SubscriptionFactory, 
    LSFactory,
    $window,
    API_URL
    ){
    SubscriptionFactory.unsubscribe(LSFactory.getSocketId()).
    then(function success(response){
        console.log("resetting");
        Socket.disconnect(true);
    	$window.location.href = API_URL+"/settings";
    }, subsError);
    function subsError(response) {
        console.log("Error");
    }
}]);