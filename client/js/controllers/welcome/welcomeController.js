
xively.controller('welcomeController', ['$scope', '$rootScope', 'Socket','localStorageService','VisitorsService', 'sharedProperties' ,'LSFactory','SubscriptionFactory','$window', 'API_URL', 'SessionsService',function($scope, $rootScope, Socket,localStorageService, VisitorsService, sharedProperties, LSFactory,SubscriptionFactory, $window, API_URL, SessionsService){
   
    //$(document).ready(function(){
    var min=1,max=9;
	var arr_occupied = [0,0,0,0,0,0,0,0,0,0]; //if is occupied
	var arr_wName = ['','welcome1','welcome2','welcome3','welcome4','welcome5','welcome6','welcome7','welcome8','welcome9'] //welcome id name
	var arr_email = ['','','','','','','','','',''];
	
    $scope.person = {};
    
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
    
    
    Socket.on('welcome', function(data){
    	
    	console.log(data);
        $scope.person = data;
        //if($scope.person.zonefrom){
            showWelcome();
        /*}else{
            removeWelcome()
        }*/
    });
    
    function explode(pos){
    	console.log("EXPLODE ...",pos);
		$('#'+arr_wName[pos]).removeClass('show').addClass('hide');
		arr_occupied[pos]=0;
	}

	function display(pos,action){
		//if(action==1){
		
		    arr_occupied[pos]=1;
		    var bubleSize = '';
		    if (!$scope.person.message) {
		    	$scope.person.message = "Missing Text";
		    }
		    if($scope.person.message.length>60){
		    	bubleSize = 'hello-circle-lg';
		    }else if($scope.person.message.length>39){
		    	bubleSize = 'hello-circle-md';
		    }else{
		    	bubleSize = 'hello-circle-sm';
		    }
		    
		    $('#welcome'+pos).children().addClass(bubleSize);
		    //$('#'+arr_wName[pos]).removeClass('hide').addClass('show');
			//$('#'+arr_wName[pos]).removeClass('hide').addClass('show').fadeIn(1000).delay(5000).fadeOut(1000);
			 $('#'+arr_wName[pos])
			 	.removeClass('hide')
			 	.addClass('show')
			 	.fadeIn(600)
			 	.animate({opacity:0}
			 	,4000,'easeInExpo',
			 	function(){
			 		$('#welcome'+pos).css({'opacity':'1'});
			 	
			 		$('#welcome'+pos).removeClass('show').addClass('hide');
			 	
				 	$('#welcome'+pos).children().removeClass('hello-circle-lg');
				 	$('#welcome'+pos).children().removeClass('hello-circle-md');
				 	$('#welcome'+pos).children().removeClass('hello-circle-sm');
				 	
				 	arr_occupied[pos]=0;
			 	});  
			
            //arr_occupied[pos]=0;
            //.addClass('show');
			//arr_occupied[pos]=1;
			//arr_email[pos]=$scope.person.email;
			$('#personName'+pos).text($scope.person.name);
			$('#message'+pos).text($scope.person.message);
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

	function showWelcome(){
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
			display(pos,1);
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

	$('#addWelcome').click(function(){
		console.log("click add welcome");
		var idx = getRandom(0,9);
		var persons = [
		    {
		        name: 'Amanda Kunde',
		        message:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer',
		        email:'Rory.Hand8@yahoo.com',
		        zonefrom: '5000'
		    },
		    {
		        name: 'Norma Green',
		        message:'Lorem ipsum dolor sit amet, consectetur.',
		        email:'Lowell_Corwin44@hotmail.com',
		        zonefrom: '3000'
		    },
		    {
		        name: 'Dr. Geovanny Huel',
		        message:'Lorem ipsum dolor si',
		        email:'Lowell_Corwin44@hotmail.com',
		        zonefrom: '3000'
		    },
		    {
		        name: 'Eloise Fisher',
		        message:'Lorem ipsum dolor sit amet, consectetur.',
		        email:'Lowell_Corwin44@hotmail.com',
		        zonefrom: '3000'
		    },
		    {
		        name: 'Frida Funk',
		        message:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer',
		        email:'Lowell_Corwin44@hotmail.com',
		        zonefrom: '3000'
		    },
		    {
		        name: 'Amanda Kunde',
		        message:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer',
		        email:'Rory.Hand8@yahoo.com',
		        zonefrom: '5000'
		    },
		    {
		        name: 'Norma Green',
		        message:'Lorem ipsum dolor sit amet, consectetur.',
		        email:'Lowell_Corwin44@hotmail.com',
		        zonefrom: '3000'
		    },
		    {
		        name: 'Dr. Geovanny Huel',
		        message:'Lorem ipsum dolor si',
		        email:'Lowell_Corwin44@hotmail.com',
		        zonefrom: '3000'
		    },
		    {
		        name: 'Eloise Fisher',
		        message:'Lorem ipsum dolor sit amet, consectetur.',
		        email:'Lowell_Corwin44@hotmail.com',
		        zonefrom: '3000'
		    },
		    {
		        name: 'Frida Funk',
		        message:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer',
		        email:'Lowell_Corwin44@hotmail.com',
		        zonefrom: '3000'
		    }
		    
		];
		$scope.person = persons[idx];
		console.log("person --> ",$scope.person.name);
		showWelcome();
	});

	$('#removeWelcome').click(function(){
		removeWelcome();
	});
    //});
   
}]);