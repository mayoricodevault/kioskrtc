xively.controller('menubarController', ['$scope', '$rootScope','Socket','localStorageService','sharedProperties' ,'SubscriptionFactory', 'LSFactory', 'API_URL', '$window',function($scope,$rootScope, Socket,localStorageService,sharedProperties,SubscriptionFactory, LSFactory, API_URL,$window){

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

    $scope.actual=sharedProperties.getPerson();
    
    $scope.black = false;
    $scope.mocha = false;
    $scope.iced = false;
    $scope.latte = false;
    $scope.cappuccino = false;
    $scope.other = false;
    
    
    $scope.defaultValues = function() {
       $scope.blacks = true; 
    };
    
    $scope.isActive = function(value) {
        switch (value) {
            case 1: return $scope.black;
            case 2: return $scope.mocha;
            case 3: return $scope.iced;
            case 4: return $scope.latte;
            case 5: return $scope.cappuccino;
            case 6: return $scope.other;
            
            default:
                // code
                break;
        }
    };
     $scope.coffee="Other";
    $scope.activate = function(value) {
        $scope.black = false;
        $scope.mocha = false;
        $scope.iced = false;
        $scope.latte = false;
        $scope.cappuccino = false;
        $scope.other = false;
           
        switch (value) {
            case 1:
                $scope.black = true;  $scope.coffee="black";
                break;
            case 2: $scope.mocha = true; $scope.coffee="mocha";
                 break;
            case 3: $scope.iced = true; $scope.coffee="iced coffee";
                 break;
            case 4: $scope.latte = true; $scope.coffee="latte";
                break;
            case 5: $scope.cappuccino = true; $scope.coffee="cappuccino";
                 break;
            case 6: $scope.other = true; $scope.coffee="other";
                 break;
            default:
                // code
                break;
        }
        
    };
    
    // Start SideMenu

    $scope.people = [];
    $scope.personActual=[];
    
    //watch change local Storage;
    var oldPeople=localStorageService.get('people');
    $scope.people=oldPeople || [];
    $scope.$watch('people',function(){
        localStorageService.set('people',$scope.people);
    },true);
    function subsError(response) {
		
		alert("error" + response.data);
	}

    
}]);