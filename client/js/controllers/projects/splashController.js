xively.controller('splashController', ['$scope', 
    '$rootScope', 
    'Socket',
    '$location',
    'storeService',
    'SubscriptionFactory', 
    'LSFactory' ,
    '$window', 
    'SessionsService',
    'hotkeys',
    'FIREBASE_URI_SESSIONS',
    'API_URL','localStorageService',
    function($scope, 
    $rootScope, 
    Socket, 
    $location, 
    storeService, 
    SubscriptionFactory, 
    LSFactory,
    $window, 
    SessionsService,
    hotkeys,
    FIREBASE_URI_SESSIONS,
    API_URL,localStorageService){
    $scope.base64 = '';
    $scope.helpVisible=false;
    $scope.deviceName = LSFactory.getDeviceName();
    $scope.deviceDetected = LSFactory.getDeviceDetected();
    $scope.deviceTagid = LSFactory.getTagId();
    $scope.deviceType = LSFactory.getDeviceType().toUpperCase();
    hotkeys.bindTo($scope)
    .add({
      combo: 'esc+s',
      description: 'Kiosk Information',
      callback: function() {
        if ($scope.helpVisible) {
            $scope.helpVisible = false;
        } else {
            $scope.helpVisible = true;
        }
      }
    });
    $scope.serving = false;
    $scope.isFavorite="splash";
    $scope.$watch('isFavorite',function(){
        localStorageService.set('isFavorite',$scope.isFavorite);
    },true);
    Socket.on('register', function(data){
        $rootScope.currentPerson = data;
        if (isStation(data.zoneto) &&  !$scope.serving ) {
           $scope.serving = true;
           if(data.hasOrder==true || data.hasOrder=='true' ){
                storeService.jsonWrite('paneSelected',{id:'3'});
                $location.path('/kiosk/select');
           }  else {
                storeService.jsonWrite('paneSelected',{id:'1'});
                $location.path('/kiosk/select');
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
     $scope.ordernow=function() {
          $rootScope.currentPerson={};
          $scope.serving = true;
          storeService.jsonWrite('paneSelected',{id:'2'});
          $location.path('/kiosk/select');
    };
    $scope.unregister=function() {
     SubscriptionFactory.unsubscribe(LSFactory.getSocketId()).
		then(function success(response){
            Socket.disconnect(true);
			$window.location.href = API_URL+"/settings";
		}, subsError);
    };
    function subsError(response) {
        console.log("Error");
    }
    function isStation(tagId) {
        
       var thisOneIsCall=false;
       var thisSi = LSFactory.getSocketId();
       var activeSession = SessionsService.findSession(thisSi) ;
       if (activeSession) {
           if (activeSession.tagId == tagId || activeSession.socketid == tagId && activeSession.socketid == thisSi) {
               thisOneIsCall = true;
           } 
       }
		return thisOneIsCall;
    } 
}]);