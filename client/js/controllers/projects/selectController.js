
xively.controller('selectController', ['$scope','Socket','localStorageService','sharedProperties','VisitorsService','storeService','$http','$location',function($scope,Socket,localStorageService,sharedProperties,VisitorsService,storeService,$http,$location){
    
    $scope.paneSelected = storeService.jsonRead('paneSelected');
    $scope.currentPerson=storeService.jsonRead('dataActual');
    
    
    $scope.selected = undefined;
    
    /*------  WELCOME CONTROLLER -------*/
    $scope.menuBar=function(){
        console.log("asdasda12312312312");
       $scope.paneSelected = {id:'3'};
       storeService.jsonWrite('paneSelected',$scope.paneSelected);
    };
    
    $scope.black = false;
    $scope.mocha = false;
    $scope.iced = false;
    $scope.latte = false;
    $scope.cappuccino = false;
    $scope.other = false;
    
    $scope.numberofusers=0;
    $scope.individualBoard=0;

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
                $scope.black = true;  $scope.people[0].coffee="black";
                break;
            case 2: $scope.mocha = true; $scope.people[0].coffee="mocha";
                 break;
            case 3: $scope.iced = true; $scope.people[0].coffee="iced coffee";
                 break;
            case 4: $scope.latte = true; $scope.people[0].coffee="latte";
                break;
            case 5: $scope.cappuccino = true; $scope.people[0].coffee="cappuccino";
                 break;
            case 6: $scope.other = true; $scope.people[0].coffee="other";
                 break;
            default:
                // code
                break;
        }
        
    };
    
    /////////////// Welcome HI Name


    //get current Person of Local Storage 
    $scope.currentPerson=sharedProperties.getPerson();
    if($scope.currentPerson===undefined)
    {
         var oldPerson=localStorageService.get('currentPerson');
         $scope.currentPerson=oldPerson || [];
         
    }
    
    //Save current Person in Local Storage
    $scope.$watch('currentPerson',function(){
            localStorageService.set('currentPerson',$scope.currentPerson);
    },true);
    
    //////////////End Welcome HI Name
    
    /*--------- END WELCOME CONTROLLER ---------*/
    
    
    /*-------------------- REGISTER CONTROLLER -----------------------*/
    
    $scope.cleanVisitors = VisitorsService.getVisitors();
    $scope.visitors = [];
    
    $scope.$watch('cleanVisitors', function () {
        visitorsToArray($scope.cleanVisitors);
		
	}, true);
    
    Socket.on('sync', function(data){
        if (data.action == 'restart') {
            // goto to splacj
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
        //sharedProperties.setPerson($scope.selected);
        //$scope.actual = $scope.selected;
        $scope.paneSelected = {id:'3'};
        if($scope.selected==="")
        return false;
        storeService.jsonWrite('dataActual',$scope.selected);
        $scope.currentPerson = storeService.jsonRead('dataActual');
        storeService.jsonWrite('paneSelected',$scope.paneSelected);
        console.log("pane ---> ",$scope.currentPerson);
        //Save current Person in Local Storage
        $scope.$watch('currentPerson',function(){
                localStorageService.set('currentPerson',$scope.currentPerson);
        },true);
    return true;
        //$scope.actual=$scope.selected;
    };
    
    /*-------------------- END REGISTER CONTROLLER -----------------------*/
    
    
    /*-------------------- MENU BAR CONTROLLER ----------------------------*/
    
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
    
    //get current Person of Local Storage 
    $scope.currentPerson=sharedProperties.getPerson();
    if($scope.currentPerson===undefined)
    {
         var oldPerson=localStorageService.get('currentPerson');
         $scope.currentPerson=oldPerson || [];
         
    }
    
    //Save current Person in Local Storage
    $scope.$watch('currentPerson',function(){
            localStorageService.set('currentPerson',$scope.currentPerson);
    },true);
    
    
    
    /*-------------------- END MENU BAR CONTROLLER ----------------------------*/
    /*---------------------Weather controller---------------------------------*/

	
	$scope.zip =$scope.currentPerson.zipcode;
	$http.get('https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20weather.forecast%20WHERE%20location%3D%22' + $scope.zip + '%22&format=json&diagnostics=true&callback=')
		.success(function(data){
			$scope.weather = data.query.results.channel
			$scope.forecast = data.query.results.channel.item.forecast
			$scope.tempIndex = (parseInt($scope.weather.item.condition.temp) - parseInt($scope.forecast[0].low)) / (parseInt($scope.forecast[0].high) - parseInt($scope.forecast[0].low)) * 100
			
	})
	/*-----------------End Weather ********************************************/
}]);