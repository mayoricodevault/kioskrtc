xively.controller('genericController', ['$scope', 'Socket', function($scope, Socket){
    Socket.connect();
    $scope.messages = [];
    $scope.devices =[];
    $scope.numberofusers=0;
    $scope.individualBoard=0;
    var promptDevicename = function(message){
        bootbox.prompt(message, function(name){
            if(name != null){
                Socket.emit('add-device', {devicename: name})
            }
            else {
                promptDevicename('You must enter a device name!');
            }
        })
    }
    
    $scope.sendMessage = function(msg){
             
        if(msg != null && msg != '') {
            Socket.emit('message', {message: msg})
        }
        $scope.msg = '';
    }
    
    promptDevicename("What is the device name?");
    
    Socket.emit('request-devices', {});
    
    Socket.on('devices', function(data){
        $scope.devices = data.devices;
    });
    
    Socket.on('xternal', function(data){
    
        if (data.action=="iu") {
            $scope.numberofusers = data.value;
        }
        if (data.action=="ib") {
            $scope.individualBoard = data.value;
        }
        if (data.action=="reset") {
            $scope.individualBoard = data.value;
            $scope.numberofusers = data.value;
        }
        
         
    });
    
    Socket.on('message', function(data){
        $scope.messages.push(data);
    });
    
    Socket.on('add-device', function(data){
        $scope.devices.push(data.devicename);
        $scope.messages.push({devicename: data.devicename, message: 'has entered the channel'});
    });
    
    Socket.on('remove-device', function(data){
        $scope.devices.splice($scope.devices.indexOf(data.devicename), 1);
        $scope.messages.push({devicename: data.devicename, message: 'has left the channel'});
    });
    
    Socket.on('prompt-device', function(data){

        promptDevicename(data.message);
    })
    
    $scope.$on('$locationChangeStart', function(event){
        Socket.disconnect(true);
    })
}])