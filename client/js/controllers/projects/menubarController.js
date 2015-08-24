xively.controller('menubarController', ['$scope', 'Socket','localStorageService','sharedProperties' ,function($scope, Socket,localStorageService,sharedProperties){

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
    

    
}]);