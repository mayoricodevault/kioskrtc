xively.controller('homeController', ['$scope','$interval', function($scope, $interval){
    
        
    $scope.myInterval = 4000;
    $scope.slides = [{
        image: "img/fullstack.png",
        link: "#"
    },
    {
        image: "img/Barista Next Select.png",
        link: "#"
    },
    {
        image: "img/Barista.png",
        link: "#"
    },
    {
        image: "img/Screener 1.png",
        link: "#"
    }];
}]);