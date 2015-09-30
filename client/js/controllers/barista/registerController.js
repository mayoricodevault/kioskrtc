xively.controller('registerController', ['$scope',
    '$location',
    'localStorageService',
    'Socket',
    '$http',
    'API_URL',
    'ngToast',
    'VisitorsService',
    'LSFactory',
    '$window', function ($scope, $location,localStorageService,Socket,$http,API_URL,ngToast,VisitorsService,LSFactory,$window) {
    $scope.currentPerson;
    $scope.serveOrders=[];
    $scope.orders=[];
    $scope.totalOrders=0;
    $scope.currentIndex;
    $scope.visitors = [];
    $scope.cleanVisitorsT = VisitorsService.getVisitors();
    $scope.isFavorite=localStorageService.get('isFavorite');
    $scope.$watch('isFavorite',function(){
        localStorageService.set('isFavorite',$scope.isFavorite);
    },true);
    var currentPersonOld=localStorageService.get('currentPerson');
    $scope.currentPerson=currentPersonOld || [];
    $scope.$watch('currentPerson',function(){
        localStorageService.set('currentPerson',$scope.currentPerson);
    },true);
    var currentIndexOld=localStorageService.get('currentIndex');
    $scope.currentIndex=currentIndexOld || 0;
    $scope.$watch('currentIndex',function(){
        localStorageService.set('currentIndex',$scope.currentIndex);
    },true);
     $scope.$watch('cleanVisitorsT', function () {
        visitorsToArray($scope.cleanVisitorsT);
    }, true);
    
    function visitorsToArray(oVisitors) {
    	$scope.visitors = oVisitors;
    }
    
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
        var SelPerson = Object();
        SelPerson.favcoffee = selVisitor.favcoffee;
        SelPerson.city = selVisitor.city;
        SelPerson.name = selVisitor.name;
        SelPerson.email = selVisitor.email;
        SelPerson.state = selVisitor.state;
        SelPerson.zoneto = LSFactory.getTagId();
        SelPerson.zonefrom = "Barista";
        SelPerson.region = selVisitor.region;
        SelPerson.thingid = selVisitor.thingid;
        SelPerson.id = selVisitor.id;
        $scope.currentPerson = SelPerson;
        $scope.isFavorite=false;
        $location.path("/barista/menu");
        return true;
    }; 
    $scope.cancel = function(){
        $scope.currentPerson=undefined;
        $location.path("/barista");
    };
}]);