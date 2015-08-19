'use strict';

xively.controller('baristaController', function ($scope, $location, $anchorScroll,localStorageService) {
    
    var firstNames = ['Adam', 'Steve', 'Jessie', 'Frank', 'Kathy', 'Amy', 'Julie', 'Cindy', 'Bob', 'Jeff', 'Sandra'];
    var lastNames = ['Jones', 'Smith', 'Reynolds', 'Quincy', 'Drake', 'Stone', 'Doe', 'Skywalker'];
  
    
    
    
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
            coffee:"Ice Coffee2"
        });
    };
    
    //served 
    $scope.served = function() {
        var oldList = $scope.people;
        $scope.people = [];
        for(var i=1; i<oldList.length ;i++){
          $scope.people.push(oldList[i]);
          $scope.actual=$scope.people[0];
        }
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
 
      
      $scope.option = 0;
      $scope.miembros=[
        {"no":1,"Nombre":"JOHN","coffe":"LATLE","tam":"L","company":"IBM","from":"DENVER","sta":"1"},
        {"no":2,"Nombre":"EMMA","coffe":"CAPPUCCINO","tam":"L","company":"IBM","from":"DENVER","sta":"1"},
        {"no":3,"Nombre":"JESSICA","coffe":"ICE COFFEE","tam":"L","company":"IBM","from":"DENVER","sta":"1"},
        {"no":4,"Nombre":"SEBASTIAN","coffe":"ESPRESSO","tam":"L","company":"IBM","from":"DENVER","sta":"1"},
        {"no":5,"Nombre":"EMILY","coffe":"AMERICANO","tam":"L","company":"IBM","from":"DENVER","sta":"1"},
        {"no":6,"Nombre":"TOM","coffe":"CAPPUCCCINO","tam":"L","company":"IBM","from":"DENVER","sta":"1"},
        {"no":7,"Nombre":"LOU","coffe":"LATTLE","tam":"L","company":"IBM","from":"DENVER","sta":"1"},
        {"no":8,"Nombre":"ERICK","coffe":"Frapuccino","tam":"L","company":"IBM","from":"DENVER","sta":"1"},
        {"no":9,"Nombre":"SAM","coffe":"Lattle","tam":"L","company":"IBM","from":"DENVER","sta":"1"},
        {"no":10,"Nombre":"DAN","coffe":"Macchiato","tam":"L","company":"IBM","from":"DENVER","sta":"0"},
        {"no":11,"Nombre":"LOUIS","coffe":"Espresso","tam":"L","company":"IBM","from":"DENVER","sta":"0"},
        {"no":12,"Nombre":"JEMMA","coffe":"Americano","tam":"L","company":"IBM","from":"DENVER","sta":"0"},
        {"no":13,"Nombre":"NINA","coffe":"Lattle","tam":"L","company":"IBM","from":"DENVER","sta":"0"},
        {"no":14,"Nombre":"JACKIE","coffe":"Cappucino","tam":"L","company":"IBM","from":"DENVER","sta":"0"},
        {"no":15,"Nombre":"WILL","coffe":"Cappuccino","tam":"L","company":"IBM","from":"DENVER","sta":"0"},
        {"no":16,"Nombre":"JACK","coffe":"Machiatto","tam":"L","company":"IBM","from":"DENVER","sta":"0"},
        {"no":17,"Nombre":"THELMA","coffe":"Espresso","tam":"L","company":"IBM","from":"DENVER","sta":"0"},
        {"no":18,"Nombre":"EDWARD","coffe":"Ice Coffee","tam":"L","company":"IBM","from":"DENVER","sta":"0"}
     ];
    $scope.whatClassIsIt=function(someValue){
        if(someValue==0)
                return "icon-drink ";
        else
             return "glyphicon glyphicon-ok";
    };
        $scope.whatClassIsIt2=function(someValue){
         if(someValue<9)
             return "disabled";
    };
     
       
});