xively.controller('welcomeController', ['$scope', '$rootScope', 'Socket','localStorageService','VisitorsService', 'sharedProperties' ,'LSFactory','SubscriptionFactory','$window', 'API_URL', 'SessionsService','$queue','$timeout',function($scope, $rootScope, Socket,localStorageService, VisitorsService, sharedProperties, LSFactory,SubscriptionFactory, $window, API_URL, SessionsService,$queue,$timeout){
   
    //$(document).ready(function(){
    var min=1,max=9;
	var arr_occupied = [0,0,0,0,0,0,0,0,0,0]; //if is occupied
	var arr_wName = ['','welcome1','welcome2','welcome3','welcome4','welcome5','welcome6','welcome7','welcome8','welcome9'] //welcome id name
	var arr_email = ['','','','','','','','','',''];
	var ArrayItems = [];
	var sizeArray=0;
	
	
	var queueCallBack = function(item) {
                //$scope.person = item;
                showWelcome(item);
            },
            options = {
                delay: 1000, //delay 1 seconds between processing items
                paused: true, //start out paused
                complete: function() { console.log('complete!'); }
            };
	var myQueue = $queue.queue(queueCallBack, options);
	myQueue.start();
	
	/*var fakeData = [
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "2",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Pedro"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "3",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Juan"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"},
		{id: "1",msg1: "tarola",msg2: "como estas muy buenas noches",greeting: "hola",fname: "Carlos"}
	];
	
	//for(var i=0;i<fakeData.length;i++){
	f(1);
	function f(idx){
		if(idx==192)return true;
		$timeout(function(){
			populateQueue(fakeData[idx]);
			f(++idx);
		},300);
		return true;
	}*/
		
	//}
	
	
	
	
	function populateQueue(person){
		
		console.log(typeof ArrayItems[person.id],"==","undefined",ArrayItems[person.id],"==",0);
		if(typeof ArrayItems[person.id]=="undefined" || ArrayItems[person.id]==0){
			ArrayItems[person.id]=1;
			//console.log("in",ArrayItems[person.id]);
			myQueue.add(person);
		}
		//console.log("myQueue --> ",myQueue.Queue);
		/*for(var i=1;i<=idxArray;i++){
			ArrayItems[i]={
				id:person.id,
				active:1
			}
		}*/
		
	}
	//populateQueue();
	 
    $scope.person = {};
    
     Socket.on('ping', function(data){
        var socketid = LSFactory.getSocketId();
        if (LSFactory.getSessionId() === data.sessionid) {
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
    
    
    Socket.on('welcome', function(data){
        //$scope.person = data;
        //if($scope.person.zonefrom){
        populateQueue(data);
            //showWelcome();
        /*}else{
            removeWelcome()
        }*/
    });
    
    function explode(pos){
		$('#'+arr_wName[pos]).removeClass('show').addClass('hide');
		arr_occupied[pos]=0;
	}

	function display(pos,action,item){
		//if(action==1){
		
		    arr_occupied[pos]=1;
		    $scope.person = item;
			
		    if (!$scope.person.msg1) {
		    	$scope.person.msg1 = "Missing Text";
		    }
		    if (!$scope.person.msg2) {
		    	$scope.person.msg2 = "Missing Text";
		    }
		    
		    var ms=getRandom(1,2);
			var message=['',$scope.person.msg1,$scope.person.msg2];
		    
		    var bubleSize='hello-circle-',
		    	circleText='hello-circleText-',
		    	rowCircle='row-circle-',
		    	messagebox='messagebox-';
		    
		    if(message[ms].length>53){size = 'lg';}
		    else if(message[ms].length>39){size = 'md';}
		    else{size = 'sm';}
		    
		    bubleSize+=size;
		    circleText+=size;
		    rowCircle+=size;
		    messagebox+=size;
		    
		    $('#welcome'+pos).children().addClass(circleText);
		    $('#welcome'+pos).children().addClass(bubleSize);
		    $('#welcome'+pos).children().children().addClass(rowCircle);
		    $('#message'+pos).addClass(messagebox);
		    
		    //$('#'+arr_wName[pos]).removeClass('hide').addClass('show');
			//$('#'+arr_wName[pos]).removeClass('hide').addClass('show').fadeIn(1000).delay(5000).fadeOut(1000);
			 $('#'+arr_wName[pos])
			 	.removeClass('hide')
			 	.addClass('show')
			 	.fadeIn(600)
			 	.animate({opacity:0}
			 	,10000,'easeInExpo',
			 	function(){
			 		$('#welcome'+pos).css({'opacity':'1'});
			 	
			 		$('#welcome'+pos).removeClass('show').addClass('hide');
			 	
				 	$('#welcome'+pos).children().removeClass(bubleSize);
				 	$('#welcome'+pos).children().removeClass(circleText);
				 	$('#welcome'+pos).children().children().removeClass(rowCircle);
				 	$('#message'+pos).removeClass(messagebox);
				 	
				 	arr_occupied[pos]=0;
			 	});  
			
            //arr_occupied[pos]=0;
            //.addClass('show');
			//arr_occupied[pos]=1;
			//arr_email[pos]=$scope.person.email;
			$('#personName'+pos).text($scope.person.greeting+" "+$scope.person.fname);
			$('#message'+pos).text(message[ms]);
		/*}else{
			$('#'+arr_wName[pos]).removeClass('show').addClass('hide');
			arr_occupied[pos]=0;
			arr_email[pos]='';
		}*/
		
	}

	function isOccupied(pos){
		if(arr_occupied[pos]==1)return true;
		return false;
	}

	function getRandomInt(){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	function getRandom(min,max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function isAllOccupied(){
		for(var i=min;i<=max;i++)
			if(arr_occupied[i]==0)return false;
		
		return true;
	}

	function anythingIsOccupied(){
		for(var i=min;i<=max;i++)
			if(arr_occupied[i]==1)return true;
		
		return false;
	}

	function showWelcome(item){
		$timeout(function(){
			ArrayItems[item.id]=0;
			//console.log("end ",ArrayItems[item.id]);
		},10000);
		var pos=-1,n;
		//var allOccupied = isAllOccupied();
		//for(var i=0;!allOccupied&&i<=100;i++){
		for(var i=0;i<=100;i++){
			n = getRandomInt();
			if(!isOccupied(n)){
				pos = n;
				break;
			}
		}

		if(pos==-1){
		    console.log("all are occupied");
		}
		else{
			display(pos,1,item);
		}
	}

	function removeWelcome(){
		var pos=-1;
		
		for(var i=1;i<=5;i++){
			if(arr_email[i].toLowerCase()==$scope.person.email.toLowerCase())
				pos = i;
		}

		if(pos==-1){
		    alert("The email doesn't exist");
		    console.log("email --> ",$scope.person.email);
		}
		else{
			display(pos,0);
		}
	}
	
	function subsError(response) {
        console.log("Error");
    }

    //});
   
}]);