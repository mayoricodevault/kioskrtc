'use strict';

xively.controller('expressmenuController', function ($scope, $location, $anchorScroll) {
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
    var firstNames = ['Adam', 'Steve', 'Jessie', 'Frank', 'Kathy', 'Amy', 'Julie', 'Cindy', 'Bob', 'Jeff', 'Sandra'];
    var lastNames = ['Jones', 'Smith', 'Reynolds', 'Quincy', 'Drake', 'Stone', 'Doe', 'Skywalker'];
    $scope.people=[{
            id:1,
        name:"Paul Landaeta ",
            coffe:"Ice Coffee2"}];
    /*    for (var i =0 ;; i++) {
            if($scope.miembros[i].sta==0)
            {
                $scope.actual=$scope.miembros[i];
                break;
            }
        }
    */  
    var activeItem = 15;
    var xItems = 11;
    var j=2;
    $scope.addPerson = function() {
        $scope.people.push({
            id:j,
            name:"Paul Landaeta "+(j++),
            coffe:"Ice Coffee2"
        });
        $location.hash('person' + (activeItem-xItems));
        $anchorScroll();
    };
    $scope.personUp = function(index) {
        if (index <= 0 || index >= $scope.miembros.length || $scope.miembros[index].sta==1)
            return;
        var i=1;
        for ( i =index-1 ;$scope.miembros[i].sta!=1; i--) {
                var temp = $scope.miembros[i];
                $scope.miembros[i] = $scope.miembros[i+1];
                $scope.miembros[i+1] = temp;
        }
       $scope.actual=$scope.miembros[i+1];
    };
    $scope.personDown = function(index) {
        if (index < 0 || index >= ($scope.people.length - 1))
            return;
        var temp = $scope.people[index];
        $scope.people[index] = $scope.people[index + 1];
        $scope.people[index    + 1] = temp;
    };

    $scope.personRemove = function(index) {
        $scope.people.splice(index, 1);
    };
    
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
      $scope.served=function(){
        for (var i =0 ;; i++) {
            if($scope.miembros[i].sta==0)
            {
                $scope.miembros[i].sta=1;
                $scope.actual=$scope.miembros[i+1];
                break;
            }
        }
    };
     $scope.asd=function(index){
        if($scope.miembros[index].sta==1)
            return true;
        return false;
    };
    
    $scope.loadMore = function() {
    var last = $scope.miembros[$scope.miembros.length - 1];
    for(var i = 1; i <= 18; i++) {
        $scope.miembros.push(last + i);
        }
    };
       
       
       
     var i = 1; 
    $scope.items = [{
        id: 1,
        name: 'Item 1'
    }];
  
  
    
 
    $scope.serve = function() {
        activeItem++;
        $location.hash('item' + (activeItem-xItems));
    }   
});
