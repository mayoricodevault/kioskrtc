xively.controller('splashController', ['$scope', 'Socket','localStorageService','$location','sharedProperties','storeService' ,function($scope, Socket,localStorageService, $location,sharedProperties,storeService){
    
    storeService.jsonWrite('paneSelected',{id:'2'});
    Socket.connect();

    Socket.on('register', function(data){
        sharedProperties.setPerson(data);
        storeService.jsonWrite('paneSelected',{id:'1'});
       $location.path('/kiosk/select'); 

    });
    
    Socket.on('unknown', function(data){
       $location.path('/kiosk/register'); 
    });
    
    Socket.on('sync', function(data){
    
        if (data.action == 'restart') {
            // si esta en disable enable button 
        }
        
          if (data.action == 'disable') {
            // disable button order
        }
         
   });

   // socket.emit
    
}])