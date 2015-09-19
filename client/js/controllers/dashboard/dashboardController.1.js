xively.controller('dashboardController', ['$scope', 'Socket', '$timeout','$compile','$window', 'LSFactory', 'SessionsService' ,'SubscriptionFactory', 'API_URL','Messages', 'FIREBASE_URI_MSGS', '$queue', function($scope, Socket, $timeout, $compile, $window, LSFactory, SessionsService, SubscriptionFactory, API_URL,  Messages, FIREBASE_URI_MSGS, $queue){
    // Doughnut chart
    $scope.colorsdoghnut = [{
            fillColor: 'rgba(255, 72, 51, 0.8)',
            strokeColor: 'rgba(255, 72, 51, 0.8)',
            highlightFill: 'rgba(47, 132, 71, 0.8)',
            highlightStroke: 'rgba(47, 132, 71, 0.8)',
            tooltipFillColor:'rgba(255, 72, 51, 0.8)'
    },{
            fillColor: 'rgba(194, 194, 194, 0.8)',
            strokeColor: 'rgba(194, 194, 194, 0.8)',
            highlightFill: 'rgba(194, 194, 194, 0.8)',
            highlightStroke: 'rgba(194, 194, 194, 0.8)',
            tooltipFillColor:'rgba(194, 194, 194, 0.9)'
    }];
    // Doughnut initial data
    $scope.doughnutData = [0, 100];
    $scope.doughnutPercent = 0;
    //
    $scope.msgs = [];
    var visited=[false,false,false,false,false,false,false,false];
    var nWidgets=6;
    var totalWidgets = 8;
    
    Messages(FIREBASE_URI_MSGS).$bindTo($scope, "fbMBind");
    $scope.$watch('fbMBind', function() {
        refreshFbM();
    });    
  
    
    //$scope.sumDrinks=$scope.drinksServed.esp+$scope.drinksServed.amer+$scope.drinksServed.reg+
    //$scope.drinksServed.dcaf+$scope.drinksServed.cap+$scope.drinksServed.tea;
    
    // Queue structure
    var queueCallBack = function(item) {
                //$scope.person = item;
                showValues(item);
            },
            options = {
                delay: 1000, //delay 2 seconds between processing items
                paused: true, //start out paused
                complete: function() { console.log('complete!'); }
            };
    
    var bodyQueueCallBack = function(msg) {
        if (msg.text.length<=140)
            $scope.msgOtherText = msg.text;
        else
            $scope.msgOtherText = msg.text.substr(0,140)+"...";
    }, bodyMsgsOptions = {
        delay: 4000,
        paused: true,
        complete: function() {
            $scope.msgOtherText = "";
            addMsgsToQueue();
        }
    };
    
    var footerQueueCallBack = function(msg) {
        $scope.msgStart = msg.start;
        $scope.msgEnd = msg.end;
        if (msg.text.length>=240)
            $scope.msgText = msg.text;
        else
            $scope.msgText = msg.text.substr(0,240)+"...";
        $scope.msgExpositor = msg.expositor;
    }, footerMsgsOptions = {
        delay: 4000,
        paused: true,
        complete: function() {
            $scope.msgExpositor = "";
            addMsgsToQueue();
        }
    };
    
	var dbQueue = $queue.queue(queueCallBack, options);
	dbQueue.start();
	
	var dbQueueBodyMsg = $queue.queue(bodyQueueCallBack, bodyMsgsOptions);
	dbQueueBodyMsg.start();
	
	var dbQueueFooterMsg = $queue.queue(footerQueueCallBack, footerMsgsOptions);
	dbQueueFooterMsg.start();
    
   
    
    function makeArrayOf(value, length) {
        var arr = [], i = length;
        while (i--) {
            arr[i] = value;
        }
        return arr;
    }
    function printArray(arrayToPrint, length) {
        var aux="";
        for(var j=0;j<length;j++)
            aux+=(arrayToPrint[j]+"\t");
        console.log(aux);    
    }
    
    var orderToChange=[];
    orderToChange = makeArrayOf(-1, nWidgets);
    
    // Generating orderToChange array
    var numberRandom = 0;
    for(var i=0; i<nWidgets; i++){
        do {
            numberRandom=Math.floor(Math.random() * nWidgets)+1;
         } while(visited[numberRandom]);
        orderToChange[i]=numberRandom;
        visited[numberRandom]=true;
    }
    // print order Array
    //printArray(orderToChange, nWidgets);
    
    
    visited = makeArrayOf(false, totalWidgets+1);
    var displaywidget=makeArrayOf(0, nWidgets);
    displaywidget=[1,2,3,4,5,6];
    // Initial widgets random
    //for(i=0; i<nWidgets; i++) {
    //     do {
    //         numberRandom=Math.floor(Math.random() * totalWidgets)+1;
    //     } while(visited[numberRandom]);
    //     displaywidget[i]=numberRandom;
    //     visited[numberRandom]=true;
    // }
    
    //printArray(displaywidget, nWidgets)
    
    var position=0;
    
    // UI controler
    var widgetsFront=[false, false, false, false, false, false];
    var intervalSecs = 15;
    
    $scope.pushContent = function(element, numberPage) {
        var namePage = "wi"+(numberPage)+".html";
        
        switch (element) {
            case 1:
                if (!widgetsFront[element-1]) {
                    document.getElementById('el1back').innerHTML = "<div ng-include=\"'partials/dashboard/widgets/"+namePage+"'\"></div>";
                    $compile( document.getElementById('el1back') )($scope);
                } else {
                    document.getElementById('el1front').innerHTML = "<div ng-include=\"'partials/dashboard/widgets/"+namePage+"'\"></div>";
                    $compile( document.getElementById('el1front') )($scope);
                }
                break;
            case 2:
                if (!widgetsFront[element-1]) {
                    document.getElementById('el2back').innerHTML = "<div ng-include=\"'partials/dashboard/widgets/"+namePage+"'\"></div>";
                    $compile( document.getElementById('el2back') )($scope);
                } else {
                    document.getElementById('el2front').innerHTML = "<div ng-include=\"'partials/dashboard/widgets/"+namePage+"'\"></div>";
                    $compile( document.getElementById('el2front') )($scope);
                }
                break;
            case 3:
               if (!widgetsFront[element-1]) {
                    document.getElementById('el3back').innerHTML = "<div ng-include=\"'partials/dashboard/widgets/"+namePage+"'\"></div>";
                    $compile( document.getElementById('el3back') )($scope);
                } else {
                    document.getElementById('el3front').innerHTML = "<div ng-include=\"'partials/dashboard/widgets/"+namePage+"'\"></div>";
                    $compile( document.getElementById('el3front') )($scope);
                }
                break;
            case 4:
                if (!widgetsFront[element-1]) {
                    document.getElementById('el4back').innerHTML = "<div ng-include=\"'partials/dashboard/widgets/"+namePage+"'\"></div>";
                    $compile( document.getElementById('el4back') )($scope);
                } else {
                    document.getElementById('el4front').innerHTML = "<div ng-include=\"'partials/dashboard/widgets/"+namePage+"'\"></div>";
                    $compile( document.getElementById('el4front') )($scope);
                }
                break;
            case 5:
                if (!widgetsFront[element-1]) {
                    document.getElementById('el5back').innerHTML = "<div ng-include=\"'partials/dashboard/widgets/"+namePage+"'\"></div>";
                    $compile( document.getElementById('el5back') )($scope);
                } else {
                    document.getElementById('el5front').innerHTML = "<div ng-include=\"'partials/dashboard/widgets/"+namePage+"'\"></div>";
                    $compile( document.getElementById('el5front') )($scope);
                }
                break;
            case 6:
                if (!widgetsFront[element-1]) {
                    document.getElementById('el6back').innerHTML = "<div ng-include=\"'partials/dashboard/widgets/"+namePage+"'\"></div>";
                    $compile( document.getElementById('el6back') )($scope);
                } else {
                    document.getElementById('el6front').innerHTML = "<div ng-include=\"'partials/dashboard/widgets/"+namePage+"'\"></div>";
                    $compile( document.getElementById('el6front') )($scope);
                }
                break;
            
            default:
                // code
        }
        widgetsFront[element-1] = !widgetsFront[element-1];
        flipcard(element);
    };
    
    $scope.forever = function(){
        $timeout(function() {
            var numRan=Math.floor(Math.random() * 3)+1;
            for(var k=0; k < numRan; k++){
                do {
                    numberRandom=Math.floor(Math.random() * totalWidgets)+1;
                } while(visited[numberRandom]);
                var ant=displaywidget[orderToChange[position]-1];
                displaywidget[orderToChange[position]-1]=numberRandom;
                visited[numberRandom]=true;
                visited[ant]=false;
                $scope.pushContent(orderToChange[position], numberRandom);
                position=(position+1)%6;
                printArray(displaywidget, 6);
            } 
            $scope.forever();
        }, intervalSecs*1000);
    };
    
    //$scope.forever();
    // Initial Widgets
    // for (var k = 0; k < nWidgets; k++) {
       // $scope.pushContent(k+1, displaywidget[k]);
    // }
    
    function flipcard(value) {
        switch (value) {
            case 1: document.querySelector('#el1').classList.toggle('flip'); break;
            case 2: document.querySelector('#el2').classList.toggle('flip'); break;
            case 3: document.querySelector('#el3').classList.toggle('flip'); break;
            case 4: document.querySelector('#el4').classList.toggle('flip'); break;
            case 5: document.querySelector('#el5').classList.toggle('flip'); break;
            case 6: document.querySelector('#el6').classList.toggle('flip'); break;
        }
    }
    /*console.log("value searched created: "+getValueOf("created"));
    console.log("value searched lang: "+getValueOf("lang"));
    console.log("value searched speed: "+getValueOf("speed"));
    function getValueOf(element) {
        console.log("search function");
        var content = "{\"query\":{\"count\":1,\"created\":\"2015-08-26T18:48:25Z\",\"lang\":\"en-US\",\"diagnostics\":{\"publiclyCallable\":\"true\",\"url\":{\"execution-start-time\":\"2\",\"execution-stop-time\":\"112\",\"execution-time\":\"110\",\"content\":\"http://weather.yahooapis.com/forecastrss?p=90210\"},\"javascript\":{\"execution-start-time\":\"0\",\"execution-stop-time\":\"113\",\"execution-time\":\"112\",\"instructions-used\":\"0\",\"table-name\":\"weather.forecast\"},\"user-time\":\"115\",\"service-time\":\"110\",\"build-version\":\"0.2.154\"},\"results\":{\"channel\":{\"title\":\"Yahoo! Weather - Beverly Hills, CA\",\"link\":\"http://us.rd.yahoo.com/dailynews/rss/weather/Beverly_Hills__CA/*http://weather.yahoo.com/forecast/USCA0090_f.html\",\"description\":\"Yahoo! Weather for Beverly Hills, CA\",\"language\":\"en-us\",\"lastBuildDate\":\"Wed, 26 Aug 2015 10:51 am PDT\",\"ttl\":\"60\",\"location\":{\"city\":\"Beverly Hills\",\"country\":\"US\",\"region\":\"CA\"},\"units\":{\"distance\":\"mi\",\"pressure\":\"in\",\"speed\":\"mph\",\"temperature\":\"F\"},\"wind\":{\"chill\":\"80\",\"direction\":\"240\",\"speed\":\"6\"},\"atmosphere\":{\"humidity\":\"69\",\"pressure\":\"29.99\",\"rising\":\"1\",\"visibility\":\"9\"},\"astronomy\":{\"sunrise\":\"6:22 am\",\"sunset\":\"7:25 pm\"},\"image\":{\"title\":\"Yahoo! Weather\",\"width\":\"142\",\"height\":\"18\",\"link\":\"http://weather.yahoo.com\",\"url\":\"http://l.yimg.com/a/i/brand/purplelogo//uh/us/news-wea.gif\"},\"item\":{\"title\":\"Conditions for Beverly Hills, CA at 10:51 am PDT\",\"lat\":\"34.08\",\"long\":\"-118.4\",\"link\":\"http://us.rd.yahoo.com/dailynews/rss/weather/Beverly_Hills__CA/*http://weather.yahoo.com/forecast/USCA0090_f.html\",\"pubDate\":\"Wed, 26 Aug 2015 10:51 am PDT\",\"condition\":{\"code\":\"34\",\"date\":\"Wed, 26 Aug 2015 10:51 am PDT\",\"temp\":\"80\",\"text\":\"Fair\"},\"description\":\"\n<img src=\"http://l.yimg.com/a/i/us/we/52/34.gif\"/><br />\n<b>Current Conditions:</b><br />\nFair, 80 F<BR />\n<BR /><b>Forecast:</b><BR />\nWed - Sunny. High: 89 Low: 71<br />\nThu - Sunny. High: 92 Low: 72<br />\nFri - Mostly Sunny. High: 93 Low: 71<br />\nSat - Mostly Sunny. High: 90 Low: 69<br />\nSun - Mostly Sunny. High: 84 Low: 65<br />\n<br />\n<a href=\"http://us.rd.yahoo.com/dailynews/rss/weather/Beverly_Hills__CA/*http://weather.yahoo.com/forecast/USCA0090_f.html\">Full Forecast at Yahoo! Weather</a><BR/><BR/>\n(provided by <a href=\"http://www.weather.com\" >The Weather Channel</a>)<br/>\n\",\"forecast\":[{\"code\":\"32\",\"date\":\"26 Aug 2015\",\"day\":\"Wed\",\"high\":\"89\",\"low\":\"71\",\"text\":\"Sunny\"},{\"code\":\"32\",\"date\":\"27 Aug 2015\",\"day\":\"Thu\",\"high\":\"92\",\"low\":\"72\",\"text\":\"Sunny\"},{\"code\":\"34\",\"date\":\"28 Aug 2015\",\"day\":\"Fri\",\"high\":\"93\",\"low\":\"71\",\"text\":\"Mostly Sunny\"},{\"code\":\"34\",\"date\":\"29 Aug 2015\",\"day\":\"Sat\",\"high\":\"90\",\"low\":\"69\",\"text\":\"Mostly Sunny\"},{\"code\":\"34\",\"date\":\"30 Aug 2015\",\"day\":\"Sun\",\"high\":\"84\",\"low\":\"65\",\"text\":\"Mostly Sunny\"}],\"guid\":{\"isPermaLink\":\"false\",\"content\":\"USCA0090_2015_08_30_7_00_PDT\"}}}}}}";
        var lengthContent = content.length;
        var lengthElement = element.length;
        var index = content.search(element);
        if (index == -1) return "Not found!";
        var ans = "";
        for (var i = index+lengthElement+3; i < lengthContent; i++) {
            if (content[i]=='\"') break;
            ans = ans + (content[i]+"");
        }
        return ans;
    }*/
    
    // DASHBOARD MESSAGES
    $scope.drinksServed = {
        esp:0,
        amer:0,
        reg:0,
        dcaf:0,
        cap:0,
        tea:0
    };
    $scope.regions = {
        reg1:0,
        reg2:0,
        reg3:0,
        reg4:0,
        reg5:0,
        reg6:0
    };
    $scope.station1 = 0;
    $scope.station2 = 0;
    $scope.station3 = 0;
    $scope.onzas = 0;
    $scope.totalDrinksServed = 0;
    
    function numberWithCommas(x) {
        x = x.toString();
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(x))
            x = x.replace(pattern, "$1,$2");
        return x;
    }

    function showValues(data) {
        $scope.drinksServed.amer = data.drinksServed.amer;
        $scope.drinksServed.cap = data.drinksServed.cap;
        $scope.drinksServed.dcaf = data.drinksServed.dcaf;
        $scope.drinksServed.esp = data.drinksServed.esp;
        $scope.drinksServed.reg = data.drinksServed.reg;
        $scope.drinksServed.tea = data.drinksServed.tea;
        
        $scope.regions.reg1 = data.regions.west;
        $scope.regions.reg2 = data.regions.midwest;
        $scope.regions.reg3 = data.regions.neMidAtlantic;
        $scope.regions.reg4 = data.regions.neNewEngland;
        $scope.regions.reg5 = data.regions.sWestSouthCentral;
        $scope.regions.reg6 = data.regions.sSouthAtlanticESCentral;
        
        $scope.state1 = $scope.regions.reg1;
        $scope.state2 = $scope.regions.reg2;
        $scope.state3 = $scope.regions.reg3;
        $scope.state4 = $scope.regions.reg4;
        $scope.state5 = $scope.regions.reg5;
        $scope.state6 = $scope.regions.reg6
        
        // Stations
        $scope.station1 = data.stations.station1;
        $scope.station2 = data.stations.station2;
        $scope.station3 = data.stations.station3;
        
        $scope.onzas = numberWithCommas(data.onzas);
        $scope.totVisitors = data.totVisitors;
        $scope.totalDrinksServed = numberWithCommas($scope.regions.reg1+
                                    $scope.regions.reg2+
                                    $scope.regions.reg3+
                                    $scope.regions.reg4+
                                    $scope.regions.reg5+
                                    $scope.regions.reg6);
        $scope.totalCoffeeServed = $scope.drinksServed.amer+
                                $scope.drinksServed.cap +
                                $scope.drinksServed.dcaf +
                                $scope.drinksServed.esp +
                                $scope.drinksServed.reg;
        
        // Bar chart
        $scope.barData = [$scope.drinksServed];
        $scope.barData = [[
            $scope.drinksServed.tea,
            $scope.drinksServed.cap,
            $scope.drinksServed.dcaf,
            $scope.drinksServed.reg,
            $scope.drinksServed.amer,
            $scope.drinksServed.esp,
        ]];
        
        $scope.colorsxively = [{
            fillColor: 'rgba(255, 72, 51, 0.8)',
            strokeColor: 'rgba(255, 72, 51, 0.8)',
            highlightFill: 'rgba(47, 132, 71, 0.8)',
            highlightStroke: 'rgba(47, 132, 71, 0.8)',
            tooltipFillColor:'rgba(255, 72, 51, 0.8)'
        }];
        
        // Doughnut chart
        $scope.doughnutData = [$scope.totalCoffeeServed,$scope.totVisitors-$scope.totalCoffeeServed];
        $scope.doughnutPercent = Math.floor($scope.totalCoffeeServed*100/($scope.totVisitors));
        // Sum Drinks
        $scope.sumDrinks=$scope.drinksServed.esp+$scope.drinksServed.amer+$scope.drinksServed.reg+
                         $scope.drinksServed.dcaf+$scope.drinksServed.cap+$scope.drinksServed.tea;
    }
    Socket.on('dashboard', function(data) {
      //  var Json = {"onzas":24616, "drinksServed":{"esp":34,"amer":20,"reg":44,"dcaf":6,"cap":24,"tea":18},
      // "regions":{"west":21,"midwest":5,"neMidAtlantic":6,"neNewEngland":60,"sWestSouthCentral":6,"sSouthAtlanticESCentral":2}};
      //console.log(data);
        dbQueue.add(data);
    });
    
    Socket.on('ping', function(data){
        var socketid = LSFactory.getSocketId();
        if (LSFactory.getSessionId() === data.sessionid) {
            console.log(data);
            SessionsService.updateSessionStatus(socketid, data.ts, data.isdeleted);
        } else {
            if (data.sessionid=="All") {
                SessionsService.updateSessionStatus(socketid, 0 , false);
            }
        }
    });
    
    Socket.on('sync', function(data){
        if (LSFactory.getSessionId() === data.sessionid) {
            if (data.action === 'reset') {
                SubscriptionFactory.unsubscribe(data.socketid).
            		then(function success(response){
                        Socket.disconnect(true);
            			$window.location.href = API_URL+"/settings";
            		}, subsError);
            }
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
    
    function addMsgsToQueue() {
        for (var i = 0; i<$scope.msgs.length; i++) {
            var dateNow = new Date().getTime();
            var dateMsg = new Date($scope.msgs[i].end).getTime();
            var dNow = new Date().getDay();
            var dMsg = new Date($scope.msgs[i].end).getDay();
            if ((dNow == dMsg) && (dateNow < dateMsg)) {
                if ($scope.msgs[i].expositor.toLowerCase() == "xively")
                    dbQueueBodyMsg.add($scope.msgs[i]);
                else
                    dbQueueFooterMsg.add($scope.msgs[i]);
            }
        }
   }
    
    // Messages
  function refreshFbM(){
	    $scope.totalMsgsActive=0;
		$scope.msgs = [];
		angular.forEach($scope.fbMBind, function(msg){
			if (!msg || !msg.text) {
				return;
			}
            $scope.msgs.push(msg);
            $scope.totalMsgsActive++;
		}); 
		$scope.msgs.sort(compare);
		addMsgsToQueue();
		console.log("Msgs Added...");
	}
  
   function compare(a,b) {
        if (a.end < b.end)
            return -1;
        if (a.end > b.end)
            return 1;
    return 0;
    }
    
    // Showing messages
    var msgIndexActual = 0;
    var msgIndexInitial = 0;
    function thereAreMsgs() {
        for (var i = 0; i < $scope.msgs.length; i++) {
            var dateNow = new Date().getTime();
            var dateMsg = new Date($scope.msgs[i].end).getTime();
            var dNow = new Date().getDay();
            var dMsg = new Date($scope.msgs[i].end).getDay();
            if (($scope.msgs[i].expositor.toLowerCase() != "Xively".toLowerCase()) &&(dNow == dMsg) && (dateNow < dateMsg)) {
                return true;
            }
        }
        return false;
    }
    $scope.showMsgs = function(){
        $timeout(function() {
            console.log("Messages: "+$scope.msgs);
            if (($scope.msgs.length > 0) && thereAreMsgs()) {
                var dateNow = new Date().getTime();
                var dateMsg = new Date($scope.msgs[msgIndexActual].end).getTime();
                var dNow = new Date().getDay();
                var dMsg = new Date($scope.msgs[msgIndexActual].end).getDay();
                if (($scope.msgs[msgIndexActual].expositor.toLowerCase() != "xively") && 
                    (dNow == dMsg) && (dateNow < dateMsg)) {
                    $scope.msgStart = $scope.msgs[msgIndexActual].start;
                    $scope.msgEnd = $scope.msgs[msgIndexActual].end;
                    if ($scope.msgs[msgIndexActual].text.length>=240)
                        $scope.msgText = $scope.msgs[msgIndexActual].text;
                    else
                        $scope.msgText = $scope.msgs[msgIndexActual].text.substr(0,240)+"...";
                    $scope.msgExpositor = $scope.msgs[msgIndexActual].expositor;
                }
                msgIndexActual++;
                if (msgIndexActual>=$scope.msgs.length) {
                    msgIndexActual = msgIndexInitial;
                }
            } else $scope.msgExpositor = "";
            $scope.showMsgs();
        }, 1000);
    };
    //$scope.showMsgs();
    
    // Showing Other messages
    var msgOtherIndexActual = 0;
    var msgOtherIndexInitial = 0;
    function thereAreOtherMsgs() {
        for (var i = 0; i < $scope.msgs.length; i++) {
            var dateNow = new Date().getTime();
            var dateMsg = new Date($scope.msgs[i].end).getTime();
            var dNow = new Date().getDay();
            var dMsg = new Date($scope.msgs[i].end).getDay();
            if (($scope.msgs[i].expositor.toLowerCase() == "Xively".toLowerCase()) &&(dNow == dMsg) && (dateNow < dateMsg)) {
                //msgOtherIndexInitial = i;
                return true;
            }
        }
        return false;
    }
    function showOtherMsgs(){
        var soMsgs = function() {
            if (($scope.msgs.length > 0) && thereAreOtherMsgs()) {
                var dateNow = new Date().getTime();
                var dateMsg = new Date($scope.msgs[msgOtherIndexActual].end).getTime();
                var dNow = new Date().getDay();
                var dMsg = new Date($scope.msgs[msgOtherIndexActual].end).getDay();
                if (($scope.msgs[msgOtherIndexActual].expositor.toLowerCase() == "xively") && 
                    (dNow == dMsg) && (dateNow < dateMsg)) {
                    if ($scope.msgs[msgOtherIndexActual].text.length<=140)
                        $scope.msgOtherText = $scope.msgs[msgOtherIndexActual].text;
                    else
                        $scope.msgOtherText = $scope.msgs[msgOtherIndexActual].text.substr(0,115)+"...";
                }
                msgOtherIndexActual++;
                if (msgOtherIndexActual>=$scope.msgs.length) {
                    msgOtherIndexActual = msgOtherIndexInitial;
                }
            } else $scope.msgOtherText = "";
            $timeout(soMsgs, 3000);
        };
        $timeout(soMsgs, 3000);
    };
    //showOtherMsgs();
    
    function subsError(response) {
        console.log("Error");
    }
    
}]);