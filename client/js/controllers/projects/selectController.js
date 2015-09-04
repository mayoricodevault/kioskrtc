xively.controller('selectController', ['$scope','$rootScope','Socket','localStorageService','sharedProperties','VisitorsService','storeService','$http','$location','SubscriptionFactory', 'LSFactory', 'API_URL','$window','$timeout','ngToast','OrdersService','Api', 'SessionsService',function($scope,$rootScope, Socket,localStorageService,sharedProperties,VisitorsService,storeService,$http,$location,SubscriptionFactory, LSFactory, API_URL,$window,$timeout,ngToast,OrdersService,Api, SessionsService){

    $scope.currentfavcoffee;
    $scope.currentPerson;
    $scope.paneSelected = storeService.jsonRead('paneSelected');
    $scope.isFavorite = false;
    $scope.selected = undefined;
    $scope.trySelect = false;
    $scope.visitors = [];
    $scope.cleanVisitorsT = VisitorsService.getVisitors();
    $scope.currentPerson=sharedProperties.getPerson();
    $scope.oldFavorite=$scope.currentPerson;
    $scope.people;

    var oldPeople=localStorageService.get('people');
    $scope.people=oldPeople || [];
    
    $scope.$watch('currentPerson',function(){
        if($scope.currentPerson){
            $scope.coffee($scope.currentPerson.favcoffee);
            $http.post('https://kiosk-mmayorivera.c9.io/weather',$scope.getPlace($scope.currentPerson))
            .success(function(data){
            	$scope.weather=data.query.results.channel;
            });
            localStorageService.set('currentPerson',$scope.currentPerson);    
        }
    },true);
    
    $scope.$watch('cleanVisitorsT', function () {
        visitorsToArray($scope.cleanVisitorsT);
    }, true);
    
    $scope.$watch('people',function(){
        localStorageService.set('people',$scope.people);
    },true);
    
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
    
    Socket.on('ping', function(data){
        var socketid = LSFactory.getSocketId();
        if (LSFactory.getSessionId() === data.sessionid) {
            SessionsService.updateSessionStatus(socketid, data.ts);
        } else {
            SessionsService.updateSessionStatus(LSFactory.getSocketId() , data.ts);
        }
    });
    
    $scope.menuBar=function(){
       $scope.isFavorite=true;
       $scope.paneSelected = {id:'3'};
       storeService.jsonWrite('paneSelected',$scope.paneSelected);
    };
    
    $scope.reset = function () {
        $scope.visitors = null;
        $scope.visitors = VisitorsService.getVisitors();
        $scope.visitors.sort();
    };
    
    function visitorsToArray(oVisitors) {
    	$scope.visitors = oVisitors;
    }
    

    $scope.selectUser = function(){
        console.info("*** CLICK SELECT USER ***");
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
    
        // *** looking for favorite coffee    
        var people=$scope.currentPerson;
        var orders=[];
         orders=OrdersService.getOrdersArray();        
         
        var favcoffeeOld=getFavCoffee(orders,people);
        var favorite = {Espresso:1, Cappuccino:2, Americano:3,
                        Regular_Coffee:4, Decaf_Coffee:5, Tea:6};
        console.log("***** favcoffeeOld:"+favcoffeeOld);                        
        console.log("$scope.currentPerson.favcoffee "+$scope.currentPerson.favcoffee);
         if(favcoffeeOld!=""){
            var outCoffee=favorite[favcoffeeOld];
         }else{
             var outCoffee=favorite[$scope.currentPerson.favcoffee.replace(" ","_")];
         }
        LSFactory.setData("favcoffee",outCoffee);    
        
        
        // *************  init beverages
        var currCoffee=LSFactory.getFavCoffee();
        if(currCoffee!="null"){
            selectCoffee (currCoffee);
        }//end if
        
        
        $scope.activeGlass = function(coffee){
              selectCoffee (coffee);
        };    
    
        function selectCoffee(coffee){
            var cof = parseInt(coffee)
            console.info("ARIe:"+coffee);
            $scope.esp=false;
            $scope.cap=false;
            $scope.ame=false;
            $scope.reg=false;
            $scope.dec=false;
            $scope.tea=false;
              switch (cof) {
                case 1: 
                    $scope.esp=true;
                    $scope.favcoffee="Espresso";
                    break;
                case 2: 
                    $scope.cap=true;
                    $scope.favcoffee="Cappuccino";
                    break;
                case 3: 
                    $scope.ame=true;
                    $scope.favcoffee="Americano";
                    break;
                case 4: 
                    $scope.reg=true;
                    $scope.favcoffee="Regular Coffee";
                    break;
                case 5: 
                    $scope.dec=true;
                    $scope.favcoffee="Decaf Coffee";
                    break;
                case 6: 
                    $scope.tea=true;
                    $scope.favcoffee="Tea";
                    break;                
                default: 
                   $scope.esp=true;
                   $scope.favcoffee="Espresso";
                } // end switch 
                
        } // end selecCoffee        
        
        function getFavCoffee(orders,obj) {
            var coffee="";
            //console.info("FOR EACH ");
    		orders.forEach(function (order) {
    		    console.info(" order.email "+order.email +" coffee "+ order.favcoffee+" active "+order.active);
    		    console.info(" obj.email "+obj.email+" coffee "+ obj.favcoffee+" active "+obj.active);
    		    var active = parseInt(order.active);
    			if (order.email === obj.email && active===1) {
    			    if(obj.favcoffee==="Regular Coffee"){
    			        obj.favcoffee="Regular_Coffee";
    			    }
    			     if(obj.favcoffee==="Decaf Coffee"){
    			        obj.favcoffee="Decaf_Coffee";
    			    }
    				coffee=obj.favcoffee;
    				return coffee;
    			}
    		});
    		return coffee;
        } // end function           
        // END  looking for favorite coffee
    
        return true;
    }; // end function select
    
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
    
    $scope.defaultValues = function() {
    $scope.blacks = true; 
    };
    

    /*
     *************************
     *  click Order
     *************************
    */
    $scope.order=function(){
        console.info("*** CLICK ORDER ****");
        var people=$scope.currentPerson;	
        var timeStamp = Math.floor(Date.now() / 1000);
        people.active="1";
        people.timeStamp=timeStamp;
        var tagId=LSFactory.getTagId();
        people.tagId=tagId;
        people.favcoffee=$scope.favcoffee;
    /*
        //Find devices
        console.info("^^^^ FIND DEVICES ");
        Api.Device.query({}, function(data){
            for(var key in data){
                if(data[key].tagid===tagId){
                    people.masterId=data[key].master;
                    break;
                }else
                    people.masterId="";
            }
            console.info(">>>>> SAVE ORDER ");
            //Save Order
            $timeout(function(){
                $http.post(API_URL + '/add-order', { people: people }).
                    then(function(response) {
                        console.info("SAVE ORDER SUCCESSFUL!!!");
                    }, function(response) {
                        console.info("ERROR SAVE ORDER");
                },1000);                
            });
        });// end Find 
      */  
        $timeout(function(){
            $http.post(API_URL + '/add-order', { people: people }).
                then(function(response) {
                    console.info("SAVE ORDER SUCCESSFUL!!!");
                }, function(response) {
                    console.info("ERROR SAVE ORDER");
            },1000);                
        });
        
        
        $scope.people.push($scope.currentPerson);
        $scope.hideMsg();   
        
    };// end Click Order
    
    $scope.cancelMenuBar = function(){
        $scope.currentPerson=$scope.oldFavorite;
        if($scope.isFavorite===true)
            $scope.paneSelected = {id:'1'};
        else
            $scope.paneSelected = {id:'2'};
        storeService.jsonWrite('paneSelected',$scope.paneSelected);
    };
    
    $scope.coffee= function(coffee){
        $scope.black = false;
        $scope.mocha = false;
        $scope.iced = false;
        $scope.latte = false;
        $scope.cappuccino = false;
        $scope.other = false;
        if(coffee==="Espresso"){
            $scope.currentfavcoffee="esp";
            $scope.black = true;
        }
            
        if(coffee==="Cappuccino"){
            $scope.mocha = true;
            $scope.currentfavcoffee="cap";
        }
        if(coffee==="Regular Coffee"){
            $scope.latte = true;
            $scope.currentfavcoffee="reg";
        }
            
        if(coffee==="Tea"){
            $scope.other = true;
            $scope.currentfavcoffee="tea";
        }
        if(coffee==="Decaf Coffee"){
            $scope.cappuccino = true;
            $scope.currentfavcoffee="dec";
        }
        if(coffee==="Americano"){
            $scope.iced = true;
            $scope.currentfavcoffee="amer";
        }
        
    };
    
    $scope.getPlace=function(person){
         $scope.place ={"city":person.city,"state":person.state};
         return $scope.place;
    };
    
}]);