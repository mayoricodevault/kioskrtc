
xively.controller('kioskfavoriteController', ['$scope', 'Socket','localStorageService' ,function($scope, Socket,localStorageService){
    Socket.connect();
    
    $scope.black = false;
    $scope.mocha = false;
    $scope.iced = false;
    $scope.latte = false;
    $scope.cappuccino = false;
    $scope.other = false;
    
    $scope.numberofusers=0;
    $scope.individualBoard=0;

    Socket.on('xternal', function(data){
    
        if (data.action=="iu") {
            $scope.numberofusers = data.value;
        }
        if (data.action=="ib") {
            $scope.individualBoard = data.value;
        }
        if (data.action=="reset") {
            $scope.individualBoard = data.value;
            $scope.numberofusers = data.value;
        }
        
         
    });
    
    $scope.$on('$locationChangeStart', function(event){
        Socket.disconnect(true);
    });
    
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
    
    // Start SideMenu
     
    // Start SideMenu
    
     var firstNames = ['Adam', 'Steve', 'Jessie', 'Frank', 'Kathy', 'Amy', 'Julie', 'Cindy', 'Bob', 'Jeff', 'Sandra'];


    $scope.people = [];
    $scope.personActual=[];
    
    //watch change local Storage;
    var oldPeople=localStorageService.get('people');
    $scope.people=oldPeople || [];
    $scope.$watch('people',function(){
        localStorageService.set('people',$scope.people);
    },true);
    
    //view person actual
    if($scope.people.length>0)
    {
        $scope.actual=$scope.people[0];
    }
    
    //add person
    var j=1;
    $scope.addPerson = function() {
        $scope.people.push({
            id:j,
            name:firstNames[Math.floor(Math.random() * firstNames.length)],
            coffee:$scope.coffe
        });
    };
    
    //order 
    $scope.order = function() {
         $scope.people.push({
            id:j,
            name:firstNames[Math.floor(Math.random() * firstNames.length)],
            coffee:$scope.coffee
        });
        $scope.black = false;
        $scope.mocha = false;
        $scope.iced = false;
        $scope.latte = false;
        $scope.cappuccino = false;
        $scope.other = false;
        $scope.coffee="other";
    };
    
    //personUp
    
    $scope.personUp = function(index) {
        var i=1;
        for ( i =index-1 ;i>=0; i--) {
                var temp = $scope.people[i];
                $scope.people[i] = $scope.people[i+1];
                $scope.people[i+1] = temp;
        }
       $scope.actual=$scope.people[i+1];
    };

    
    
}])