xively.controller('selectController', ['$scope','$rootScope','Socket','localStorageService','sharedProperties','VisitorsService','storeService','$http','$location','SubscriptionFactory', 'LSFactory', 'API_URL','$window','$timeout','ngToast','OrdersService','Api',function($scope,$rootScope, Socket,localStorageService,sharedProperties,VisitorsService,storeService,$http,$location,SubscriptionFactory, LSFactory, API_URL,$window,$timeout,ngToast,OrdersService,Api){

    $scope.currentfavcoffee;
    $scope.currentPerson;
    
    $scope.coffee= function(coffee){

    if(coffee==="Espresso")
        $scope.currentfavcoffee="esp";
    if(coffee==="Cappuccino")
        $scope.currentfavcoffee="cap";
    if(coffee==="Regular Coffee")
        $scope.currentfavcoffee="reg";
    if(coffee==="Tea")
        $scope.currentfavcoffee="tea";
    if(coffee==="Decaf Coffee")
        $scope.currentfavcoffee="dec";
    if(coffee==="Americano")
        $scope.currentfavcoffee="amer";
    };
    
    $scope.$watch('currentPerson',function(){
        console.log($scope.currentPerson)
        $scope.coffee($scope.currentPerson.favcoffee);
        console.log($scope.currentfavcoffee+"adasdasd"+$scope.currentPerson.favcoffee);
        localStorageService.set('currentPerson',$scope.currentPerson);
        
    },true);
    
    $scope.currentPerson=sharedProperties.getPerson();

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
    
    $scope.paneSelected = storeService.jsonRead('paneSelected');
 //   $scope.currentPerson=storeService.jsonRead('dataActual');
    $scope.isFavorite=false;
    
    $scope.selected = undefined;
    $scope.trySelect = false;
    
    
    /// WELCOME CONTROLLER 
    
    //function "NO" button redirect MenuBar
    $scope.menuBar=function(){
       $scope.isFavorite=true;
       $scope.paneSelected = {id:'3'};
       storeService.jsonWrite('paneSelected',$scope.paneSelected);
    };
    
    /// END WELCOME CONTROLLER
    
    $scope.visitors = [];
    $scope.cleanVisitorsT = VisitorsService.getVisitors();
    
    $scope.$watch('cleanVisitorsT', function () {
        visitorsToArray($scope.cleanVisitorsT);
    }, true);
    
    Socket.on('sync', function(data){
        if (data.action == 'restart') {
            // goto to splacj
        }
    });
    
    $scope.reset = function () {
        $scope.visitors = null;
        $scope.visitors = VisitorsService.getVisitors();
        $scope.visitors.sort();
    };
    
    function visitorsToArray(oVisitors) {
    	$scope.visitors = oVisitors;
    }
    
    $scope.selectUser = function(){
        $scope.isFavorite=false;
         
        if($scope.selected===undefined) {
            ngToast.create('a toast message...');
            $scope.trySelect=true;
            return false;
        }
        if($scope.selected==="") {
            ngToast.create('a toast message...');
            $scope.trySelect=true;
            return false;
        }
        if(typeof $scope.selected!=='object') {
            ngToast.create('a toast message...');
            $scope.trySelect=true;
            return false;
        }
        $scope.paneSelected = {id:'3'};
        $scope.currentPerson = $scope.selected;
        storeService.jsonWrite('paneSelected',$scope.paneSelected);
        return true;
    };
    
    $scope.trySelectFun=function() {
        return $scope.trySelect;
    };
    $scope.closeMsg = function () {
        
        $scope.trySelect=false;
    };
    // Hiding alert
    $scope.hideMsg = function(){
        $timeout(function() {
            $scope.closeMsg();
        }, 3000);
    };
    
    $scope.oldFavorite=$scope.currentPerson;
    
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
    
    $scope.activate = function(value) {
       
        $scope.black = false;
        $scope.mocha = false;
        $scope.iced = false;
        $scope.latte = false;
        $scope.cappuccino = false;
        $scope.other = false;
           
        switch (value) {
            case 1:
                $scope.black = true;  $scope.currentPerson.favcoffee="Espresso";
                break;
            case 2: $scope.mocha = true; $scope.currentPerson.favcoffee="Cappuccino";
                 break;
            case 3: $scope.iced = true; $scope.currentPerson.favcoffee="Americano";
                 break;
            case 4: $scope.latte = true; $scope.currentPerson.favcoffee="Regular Coffee";
                break;
            case 5: $scope.cappuccino = true; $scope.currentPerson.favcoffee="Decaf Coffee";
                 break;
            case 6: $scope.other = true; $scope.currentPerson.favcoffee="Tea";
                 break;
            default:
                // code
                break;
        }
    };
    
    // Start SideMenu
    
    $scope.people = [];
    
    //watch change local Storage;
    var oldPeople=localStorageService.get('people');
    $scope.people=oldPeople || [];
    
    $scope.$watch('people',function(){
        localStorageService.set('people',$scope.people);
    },true);
                
    
    // click Order
    $scope.order=function(){
        var people=$scope.currentPerson;	
    
        var timeStamp = Math.floor(Date.now() / 1000);
        people.active="1";
        people.timeStamp=timeStamp;
        var tagId=LSFactory.getTagId();
        people.tagId=tagId;
        
        //find order
        $http.post(API_URL + '/get-order', { people: people }).
            then(function(response) {
                console.info("EXIST:"+response);
                console.info("response OK "+JSON.stringify(response.config.data.people));
                //console.info("response coffee OK "+JSON.stringify(response.config.data.people.favcoffee));
                LSFactory.setData("favcoffee", JSON.stringify(response.config.data.people.favcoffee));
                 //var favcoffee=localStorageService.get('favcoffee');
                 //console.info("favcoffee "+JSON.stringify(response.config.data.people.favcoffee));
            }, function(response) {
                console.info("responseBAD"+response);
        });         
        
        
        
        
        //Find devices
        Api.Device.query({}, function(data){
            for(var key in data){
                if(data[key].tagid===tagId){
                    people.masterId=data[key].master;
                    break;
                }else
                    people.masterId="";
            }
            //Save Order
            $timeout(function(){
                $http.post(API_URL + '/add-order', { people: people }).
                    then(function(response) {
                    }, function(response) {
                },1000);                
            });
        });// end Find 
        $scope.people.push($scope.currentPerson);
        $scope.hideMsg();   
        
        
        
        
    };// end Click Order
    
        
     //function "CANCEL" button 1 FAVORITE 2 REGISTER
    $scope.cancelMenuBar = function(){
        $scope.currentPerson=$scope.oldFavorite;
        if($scope.isFavorite===true)
            $scope.paneSelected = {id:'1'};
        else
            $scope.paneSelected = {id:'2'};
        storeService.jsonWrite('paneSelected',$scope.paneSelected);
    };
    // End SideMenu
   /* 
    $scope.zip ={"zipcode":$scope.currentPerson.zipcode};
    //$scope.zip ={"zipcode":"75462"};
    $http.post('https://kiosk-mmayorivera.c9.io/weather',$scope.zip)
    .success(function(data){
    	$scope.weather=data.query.results.channel;
    
    });
    function subsError(response) {
    alert("error" + response.data);
    }*/

    
}]);