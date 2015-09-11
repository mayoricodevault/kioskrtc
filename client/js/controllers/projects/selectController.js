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
    var coffee;

    var oldPeople=localStorageService.get('people');
    $scope.people=oldPeople || [];
    
    $scope.$watch('currentPerson',function(){
        if($scope.currentPerson){
            $scope.favcoffee=$scope.currentPerson.favcoffee;
            $scope.coffee($scope.favcoffee);
            if($scope.paneSelected.id==="3"){
                $scope.menuBar();
                
            }
                
            $http.post('https://kiosk-mmayorivera.c9.io/weather',$scope.getPlace($scope.currentPerson))
            .success(function(data){
            	$scope.weather=data.query.results.channel;
            });
           // localStorageService.set('currentPerson',$scope.currentPerson);    
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
            SessionsService.updateSessionStatus(socketid, data.ts, data.isdeleted);
        } else {
            if (data.sessionid=="All") {
                SessionsService.updateSessionStatus(socketid, 0 , false);
            }
        }
    });

    $scope.menuBar=function(){
       $scope.isFavorite=true;
       var people=$scope.currentPerson;
       var orders=[];
         orders=OrdersService.getOrdersArray();  
          var favcoffeeOld=getFavCoffee(orders,people);
        var favorite = {Espresso:1, Cappuccino:2, Americano:3,
                        Regular_Coffee:4, Decaf_Coffee:5, Tea:6};
         if(favcoffeeOld!=""){
            var outCoffee=favorite[favcoffeeOld];
         }else{
              outCoffee=favorite[$scope.currentPerson.favcoffee.replace(" ","_")];
         }
        LSFactory.setData("favcoffee",outCoffee);    
        
                
        //$('#vista').css('background-image', 'url(../images/coffee-bar-bg4.jpg)');
        //$('#vista').css('background-image', 'url(../images/coffee-bar-bg4-1600.jpg)');
        $('body').css('background-image', 'url(../images/coffee-bar-bg4-1600.jpg)');
        
        // *************  init beverages
       // var currCoffee=LSFactory.getFavCoffee();
       var currCoffee=outCoffee;
        if(currCoffee!="null"){
          $scope.selectCoffee(currCoffee);
        }//end if
        
        
        $scope.activeGlass = function(coffee){
             $scope.selectCoffee (coffee);
        };    
        function getFavCoffee(orders,obj) {
            var coffee="";
    		orders.forEach(function (order) {
    		   var active = parseInt(order.active);
    			if (order.email === obj.email && active===1) {
    			    if(order.favcoffee==="Regular Coffee"){
    			        order.favcoffee="Regular_Coffee";
    			    }
    			     if(order.favcoffee==="Decaf Coffee"){
    			        order.favcoffee="Decaf_Coffee";
    			    }
    				coffee=order.favcoffee; 
    				return coffee;
    			}
    		});
    		return coffee;
        }
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
    

    /*var $body = $('body');
    $("body").css({"background-color": "red"});
    */
    
    
    
    $scope.selectUser = function(){
        console.info("*** SELECT USER ]]");
   // document.body.style.backgroundImage = "url('../images/coffee-bar-bg4-1600.jpg')";    
 //$('body').css('background-image', 'url(../images/coffee-bar-bg4-1600.jpg)');
      //$('#vista').css('background-image', 'url(../images/coffee-bar-bg4-1600.jpg)');
     // $('#bodys').css('background-image', 'url(../images/coffee-bar-bg4-1600.jpg)');
      
       $scope.isFavorite=false;
        if($scope.selected===undefined) {
            ngToast.create({
            className: 'danger',
            content: 'Select full name.'
            });
            $scope.trySelect=true;
            return false;
        }
        if($scope.selected==="") {
            ngToast.create({
            className: 'danger',
            content: 'Select full name.'
            });
            $scope.trySelect=true;
            return false;
        }
        if(typeof $scope.selected!=='object') {
            ngToast.create({
            className: 'danger',
            content: 'Full name incorrect.'
            });
            $scope.trySelect=true;
            return false;
        }
        
        $scope.paneSelected = {id:'3'};
        $scope.currentPerson = $scope.selected;
       // storeService.jsonWrite('paneSelected',$scope.paneSelected);
    
        //**find orders or putting favorite coffee
        
        
        var favorite = {Espresso:1, Cappuccino:2, Americano:3,
                        Regular_Coffee:4, Decaf_Coffee:5, Tea:6};
                        
        // Get Orders
        var orders=[];
        orders=OrdersService.getOrdersArray();        
         //find favorite coffee of seleted person
         
        var orderCoffeeOld=getOrderCoffee(orders,$scope.currentPerson);
        var outCoffee="";
         if(orderCoffeeOld!=""){
             outCoffee=favorite[orderCoffeeOld];
         }else{
            // console.info("FAVOTITE VIDEO "+getFavCoffeePerson($scope.selected));
             $scope.currentPerson.favcoffee=getFavCoffeePerson($scope.selected);            
             outCoffee=favorite[$scope.currentPerson.favcoffee.replace(" ","_")];
         }
        LSFactory.setData("favcoffee",outCoffee);    
        
        // *************  init beverages
        var currCoffee=LSFactory.getFavCoffee();
        //if(currCoffee!="null"){
          $scope.selectCoffee(currCoffee);
        //}//end if
        
    
        return true;
    }; // end function select
    
    
    //select coffee button
    $scope.activeGlass = function(coffee){
        $scope.selectCoffee(coffee);
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
    
    $scope.defaultValues = function() {
    $scope.blacks = true; 
    };
    
    
    /*
     *************************
     *  click Order
     *************************
    */
    $scope.order=function(){

        var people=$scope.currentPerson;	
        var timeStamp = Math.floor(Date.now() / 1000);
        people.active="1";
        people.timeStamp=timeStamp;
        var tagId=LSFactory.getTagId();
        people.tagId=tagId;
        if($scope.paneSelected.id==="3")
            people.favcoffee=$scope.favcoffee;
        
        people.zoneto="";
        people.zonefrom="";
        
        people.masterId=LSFactory.getMasterId();
            //Save Order
            $timeout(function(){
                $http.post(API_URL + '/add-order', { people: people }).
                    then(function(response) {
                    }, function(response) {
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
        if(coffee==="Espresso"){
            $scope.currentfavcoffee="esp";
        }
            
        if(coffee==="Cappuccino"){
            $scope.currentfavcoffee="cap";
        }
        if(coffee==="Regular Coffee"){
            $scope.currentfavcoffee="reg";
        }
            
        if(coffee==="Tea"){
            $scope.currentfavcoffee="tea";
        }
        if(coffee==="Decaf Coffee"){
            $scope.currentfavcoffee="dec";
        }
        if(coffee==="Americano"){
            $scope.currentfavcoffee="amer";
        }
    };
    
    $scope.selectCoffee=function(coffee){
        var cof = parseInt(coffee)
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
        }
        
    };
    
    $scope.getPlace=function(person){
         $scope.place ={"city":person.city,"state":person.state};
         return $scope.place;
    };
    
    
    function getFavCoffeePerson(personSelected){
        var peopleTbl=VisitorsService.getVisitors();
        var favoriteCoffee="";
        
        var arrayLength = peopleTbl.length;
        for (var i = 0; i < arrayLength; i++) {
            if(peopleTbl[i].email===personSelected.email){
                favoriteCoffee =peopleTbl[i].favcoffee;
                break;
            }    
            //Do something
        }

        return favoriteCoffee;
    } // end function getFavCoffeePerson
    
    
     function getOrderCoffee(orders,obj) {
            var coffee="";
    		orders.forEach(function (order) {
    		   var active = parseInt(order.active);
    			if (order.email === obj.email && active===1) {
    			    if(order.favcoffee==="Regular Coffee"){
    			        order.favcoffee="Regular_Coffee";
    			    }
    			     if(order.favcoffee==="Decaf Coffee"){
    			        order.favcoffee="Decaf_Coffee";
    			    }
    				coffee=order.favcoffee; 
    				return coffee;
    			}
    		});
    		return coffee;
        } // end function 
    
}]);