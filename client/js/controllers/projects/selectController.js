xively.controller('selectController', ['$scope','$rootScope','Socket','localStorageService','VisitorsService','storeService','$http','$location','SubscriptionFactory', 'LSFactory', 'API_URL','$window','$timeout','ngToast','OrdersService','Api', 'SessionsService','Orders','FIREBASE_URI_ORDERS', 'Visitors', 'FIREBASE_URI', function($scope,$rootScope, Socket,localStorageService,VisitorsService,storeService,$http,$location,SubscriptionFactory, LSFactory, API_URL,$window,$timeout,ngToast,OrdersService,Api, SessionsService, Orders, FIREBASE_URI_ORDERS, Visitors, FIREBASE_URI){
    $scope.currentfavcoffee;
    $scope.currentPerson=$rootScope.currentPerson;
    $scope.paneSelected = getPaneSelected();
    $scope.isFavorite;
    $scope.selected = undefined;
    $scope.trySelect = false;
    $scope.visitors = [];
    $scope.oldFavorite=$rootScope.currentPerson;
    $scope.people;
    $scope.searchNameFocus=false;
    if($scope.paneSelected.id=='2'){
        $scope.searchNameFocus = true;
    }
    
    Visitors(FIREBASE_URI).$bindTo($scope, "fbVBind");
    $scope.$watch('fbVBind', function() {
		$scope.visitors = [];
		angular.forEach($scope.fbVBind, function(visitor){
			if (!visitor || !visitor.email) {
				return;
			}
            $scope.visitors.push(visitor);
		}); 
    });    
    Orders(FIREBASE_URI_ORDERS).$bindTo($scope, "fbOBind");
    $scope.$watch('fbOBind', function() {
		$scope.orders = [];
		angular.forEach($scope.fbOBind, function(order){
			if (!order || !order.active) {
				return;
			}
            $scope.orders.push(order);
		}); 
    });    
    var oldPeople=localStorageService.get('people');
    $scope.people=oldPeople || [];
    $scope.$watch('currentPerson',function(){
        if($scope.currentPerson){
            $scope.favcoffee=$scope.currentPerson.favcoffee;
            complementCoffeePrefix($scope.favcoffee);
            if($scope.paneSelected.id==="3"){
                $scope.menuBar();
            }
        }
    },true);
    $scope.$watch('people',function(){
        localStorageService.set('people',$scope.people);
    },true);
    
     var oldisFavorite=localStorageService.get('isFavorite');
    $scope.isFavorite=oldisFavorite || false;
    $scope.$watch('isFavorite',function(){
        localStorageService.set('isFavorite',$scope.isFavorite);
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

    $scope.selectUser = function(selVisitor){
       $scope.isFavorite=false;
        if($scope.selected===undefined) {
            ngToast.create({
                className: 'danger',
                content: 'Select full name.'
            });
            $scope.trySelect=true;
            return false;
        }
        else {
            if($scope.selected==="") {
                ngToast.create({
                className: 'danger',
                    content: 'Select full name.'
                });
                $scope.trySelect=true;
                return false;
            }
            else {
                if(typeof $scope.selected!=='object') {
                    ngToast.create({
                    className: 'danger',
                    content: 'Full name incorrect.'
                    });
                    $scope.trySelect=true;
                    return false;
                }
            }
        }
        if(_.isUndefined(selVisitor.zonefrom) || _.isEmpty(selVisitor.zonefrom)) {
            selVisitor.zonefrom = "kiosk";
            selVisitor.zoneto = LSFactory.getTagId() ;
        }
        var SelPerson = Object();
        SelPerson.favcoffee = selVisitor.favcoffee;
        SelPerson.city = selVisitor.city;
        SelPerson.name = selVisitor.name;
        SelPerson.email = selVisitor.email;
        SelPerson.tagId = selVisitor.tagId;
        SelPerson.state = selVisitor.state;
        SelPerson.zoneto = selVisitor.zoneto;
        SelPerson.zonefrom = selVisitor.zonefrom;
        SelPerson.region = selVisitor.region;
        SelPerson.thingid = selVisitor.thingid;
        SelPerson.id = selVisitor.id;
        $scope.currentPerson = SelPerson;
        LSFactory.setData("favcoffee",SelPerson.favcoffee);    
        $scope.paneSelected = {id:'3'};
        selectCoffee(SelPerson.favcoffee);
        return false;
    }; 
    
   /*
     *************************
     *  click Order
     *************************
    */
    $scope.order=function(){
        var orderPerson = _.find($scope.orders, function(findord) {
            return findord.id === $scope.currentPerson.id ; 
        });
        if (orderPerson) {
            if (orderPerson.active == 1 || orderPerson.active=='1') {
                orderPerson.tagId=LSFactory.getTagId();
                if($scope.paneSelected.id==="3")
                    orderPerson.favcoffee=$scope.favcoffee;
                orderPerson.active=1;
                orderPerson.masterId=LSFactory.getMasterId();
                orderPerson.timeStamp = new Date().getTime();
            }
        } else  {
            orderPerson = $scope.currentPerson;	
            orderPerson.tagId=LSFactory.getTagId();
            if($scope.paneSelected.id==="3")
                orderPerson.favcoffee=$scope.favcoffee;
            orderPerson.active=1;
            orderPerson.masterId=LSFactory.getMasterId();
            orderPerson.timeStamp = new Date().getTime();
            OrdersService.updateOrderStatus(orderPerson, 1);
        }
        $scope.hideMsg(); 
        var bodyOrder = {
            name: orderPerson.thingid,
            serial: orderPerson.thingid
        };
        $http.post(API_URL + '/vizix-order', {bodyOrder}).
                then(function(response) {
                    console.log("Response message1: ");
                    console.log(response);
                }, function(response) {
                    console.log("Response message2: ");
                    console.log(response);
        },1000);       
        
        // End post vizix
        //
        $location.path("/kiosk/thankyou");
    };// end Click Order
    
    $scope.selectMenuBar=function(){
       $scope.isFavorite=true;
       $scope.menuBar();
    };

    $scope.menuBar=function(){
       var people=$scope.currentPerson;
       var curretOrderCoffee=getOrderCoffee(people.favcoffee, people.email);
        LSFactory.setData("favcoffee",curretOrderCoffee);    
        selectCoffee(curretOrderCoffee);
        $scope.activeGlass = function(coffee){
             selectCoffee(coffee);
        };    
       $scope.paneSelected = {id:'3'};
       storeService.jsonWrite('paneSelected',$scope.paneSelected);
    };
    
    $scope.reset = function () {
        $scope.visitors = null;
        $scope.visitors = [];
        $scope.visitors.sort();
    };
    
    //select coffee button
    $scope.activeGlass = function(coffee){
        selectCoffee(coffee);
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
    
    $scope.cancelMenuBar = function(){
        $scope.currentPerson = $scope.oldFavorite;
        $scope.selected = '';
        $scope.searchNameFocus = true;        
        if($scope.isFavorite=="splash") {
            $location.path("/kiosk/splah");
        } else {
            if($scope.isFavorite==true)
                $scope.paneSelected = {id:'1'};
            else
                $scope.paneSelected = {id:'2'};
        }

        storeService.jsonWrite('paneSelected',$scope.paneSelected);
    };
    
    function complementCoffeePrefix(coffee){
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
    }
    
    function selectCoffee(cofSel){
        $scope.esp=false;
        $scope.cap=false;
        $scope.ame=false;
        $scope.reg=false;
        $scope.dec=false;
        $scope.tea=false;
      switch (cofSel) {
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
        
    }

    function getPaneSelected(){
        if (_.isEmpty(storeService.jsonRead('paneSelected')) || _.isUndefined(storeService.jsonRead('paneSelected'))) {
            return { id : 2};
        } else {
            return storeService.jsonRead('paneSelected');
        }
    }
    function getOrderCoffee(favcoffee, personId) {
            var coffeeSel;
            var favorite = {Espresso:1, Cappuccino:2, Americano:3,
                        Regular_Coffee:4, Decaf_Coffee:5, Tea:6};
            if (favcoffee.toString().search('Regular') >-1) {
                favcoffee= "Regular_Coffee";
            }   
             if (favcoffee.toString().search('Decaf') >-1) {
                favcoffee= "Decaf_Coffee";
            }  
            var coffee=favcoffee;
             var activeOrder = _.find($scope.orders, function(findord) {
                    return findord.email === personId && parseInt(findord.active,10) == 1 ; 
            });
            if (activeOrder) {
                coffee = activeOrder.favcoffee;
                if (coffee.search('Regular') >-1) {
                    coffee= "Regular_Coffee";
                }   
                 if (coffee.search('Decaf') >-1) {
                    coffee= "Decaf_Coffee";
                }  
            }
            coffeeSel=favorite[coffee];
    		return coffeeSel;
        } // end function 
    
}]);