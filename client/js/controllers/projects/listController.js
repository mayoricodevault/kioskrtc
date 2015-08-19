xively.controller('listController', ['$scope', 'Socket', function($scope, Socket){
    Socket.connect();
    
    //add person
    var j=1;
    
    // init values
    $scope.people = [];
    
    console.log("listController");
    Socket.on('xternal', function(data){
        console.log("message recived");
        if (data.action == "addPerson") {
            console.log("addPerson");
        $scope.addPerson(data.value);
           // this.addPerson(data.value);
        }
    });
    
    $scope.addPerson = function(value) {
        $scope.people.push({
            id:j,
            name:value,
            coffee:$scope.coffe
        });
    }
    
    
    $scope.$on('$locationChangeStart', function(event){
        Socket.disconnect(true);
    })
    
}])
xively.directive('scrollToLast', ['$location', '$anchorScroll', function($location, $anchorScroll){
  
  function linkFn(scope, element, attrs){
     $location.hash(attrs.scrollToLast);
      $anchorScroll();
  }
  
  return {
    restrict: 'AE',
    scope: {
      
    },
    link: linkFn
  };
  
}]);