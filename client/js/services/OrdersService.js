xively.factory('OrdersService', ['$firebaseObject','$firebaseArray','$firebase', 'FIREBASE_URI_ORDERS', function ($firebaseObject,$firebaseArray,$firebase, FIREBASE_URI_ORDERS) {
    var ref = new Firebase(FIREBASE_URI_ORDERS);
    var activeOrders = $firebaseObject(ref);
    var activeOrdersArray = $firebaseArray(ref);
    
    var getOrders = function () {
        return activeOrders;
    };
     var getOrdersArray = function () {
           
        return activeOrdersArray;
    };
    
    var getOrder = function(email){
        ref.child(replaceAll(email)).once('value',function(snap){
            if(!snap.val()) {
              // not exist  
              return null;
            }else{
                //Exist
                return snap.val();
            }
        });    
    };
    
     var updateOrderStatus = function (order, active) {
        var cleanEmail = replaceAll(order.email);
        var syncObject =  $firebaseObject(ref.child(cleanEmail));
        if (syncObject.email) {
            syncObject.$loaded().then(function() {
                syncObject.active =active;
                syncObject.$save();
            });
        } else {
            syncObject.$loaded().then(function() {
                syncObject.companyname = order.companyname;
                syncObject.email = order.email;
                syncObject.favcoffee = order.favcoffee;
                syncObject.masterId = order.masterId;
                syncObject.name = order.name;
                syncObject.timeStamp = order.timeStamp;
                syncObject.tagId = order.tagId;
                //syncObject.zipcode=order.zipcode;
                syncObject.zonefrom = order.zonefrom;
                syncObject.zoneto = order.zoneto;
                syncObject.active = active;
                syncObject.$save();
            });
            
        }
    };
    
    
    return {
        getOrders: getOrders,
        getOrdersArray: getOrdersArray,
        getOrder:getOrder,
        updateOrderStatus :updateOrderStatus
    };
    
    
    function replaceAll( text){
      while (text.toString().indexOf(".") != -1)
          text = text.toString().replace(".",",");
      return text;
    }    
    
}]);