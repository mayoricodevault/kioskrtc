xively.controller('dashboard2Controller', ['$scope', 'Socket', function($scope, Socket){
    Socket.connect();
    
    // Chart
    $scope.labels = ["Colorado", "New York", "15%","5%","3%","2%","10%","10%","15%","5%"];
    $scope.data = [3, 35, 15,5,3,2,10,10,15,5];
    // end Chart
    
    // init values
    $scope.coffee = {
        black: 0,
        mocha: 0,
        iced: 0,
        latte: 0,
        cappuccino: 0,
        other: 0,
        
        station1: 0,
        station2: 0,
        station3: 0,
        expressLine: 3,
        oMenuLine : 0
    }
    
    // black:       Black coffee served
    // mocha:       Mocha coffee served
    // iced:        Iced coffee coffee served
    // latte:       Latte coffee served
    // cappuccino:  Cappuccino coffee served
    // other:       Other coffee served
    // station1: People served at Station 1
    // station2: People served at Station 2
    // station3: People served at Station 3
    // expressLine: People in line Express
    // oMenuLine: People in line Open Menu

    Socket.on('xternal', function(data){
        if (data.action=="black") { $scope.coffee.black = data.value; }
        if (data.action=="mocha") { $scope.coffee.mocha = data.value; }
        if (data.action=="iced") { $scope.coffee.iced = data.value; }
        if (data.action=="latte") { $scope.coffee.latte = data.value; }
        if (data.action=="cappuccino") { $scope.coffee.cappuccino = data.value; }
        if (data.action=="other") { $scope.coffee.other = data.value; }
        
        if (data.action=="drinks") { $scope.coffee.drinks = data.value; }
        
        if (data.action=="station1") { $scope.station1 = data.value; }
        if (data.action=="station2") { $scope.station2 = data.value; }
        if (data.action=="station3") { $scope.station3 = data.value; }
        if (data.action=="expressLine") { $scope.expressLine = data.value; }
        if (data.action=="oMenuLine") { $scope.oMenuLine = data.value; }
        
        if (data.action=="reset") {
            $scope.coffee.black = data.value;
            $scope.coffee.mocha = data.value;
            $scope.coffee.iced = data.value;
            $scope.coffee.latte = data.value;
            $scope.coffee.cappuccino = data.value;
            $scope.coffee.other = data.value;
            
            $scope.coffee.drinks = data.value;
            
            $scope.coffee.station1 = data.value;
            $scope.coffee.station2 = data.value;
            $scope.coffee.station3 = data.value;
            $scope.coffee.expressLine = data.value;
            $scope.coffee.oMenuLine = data.value;
        }
    });
    
    $scope.$on('$locationChangeStart', function(event){
        Socket.disconnect(true);
    })
}])