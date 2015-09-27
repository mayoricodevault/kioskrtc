xively.factory('OrdersService', ['$firebaseObject','$firebaseArray', 'FIREBASE_URI_ORDERS', function ($firebaseObject,$firebaseArray, FIREBASE_URI_ORDERS) {
    var refOrder = new Firebase(FIREBASE_URI_ORDERS);
    var activeOrders = $firebaseObject(refOrder);
    var activeOrdersArray = $firebaseArray(refOrder);

    var getOrders = function () {
        return activeOrders;
    };
    var getOrdersArray = function () {
           
        return activeOrdersArray;
    };
    
    var getRef = function (personId) {
        var orderInstance = refOrder.child(personId);       
        return $firebaseObject(orderInstance);
    };
    
    var getOrder = function(email){
        refOrder.child(replaceAll(email)).once('value',function(snap){
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
        var syncObject = $firebaseObject(refOrder.child(order.id));
        syncObject.$loaded().then(function() {
            if (syncObject.active) {
                syncObject.timeStamp = new Date().getTime();
                syncObject.active =active;
                syncObject.$save();
            } else{
                syncObject.email = order.email;
                syncObject.favcoffee = order.favcoffee;
                syncObject.masterId = order.masterId;
                syncObject.name = order.name;
                syncObject.timeStamp = new Date().getTime();
                syncObject.tagId = order.tagId;
                syncObject.zonefrom = order.zonefrom;
                syncObject.zoneto = order.zoneto;
                syncObject.state = order.state;
                syncObject.city = order.city;
                syncObject.region = order.region;
                syncObject.thingid = order.thingid;
                syncObject.id = order.id;
                syncObject.active = active;
                syncObject.$save();
            }
        });
    };
    
    
    return {
        getOrders: getOrders,
        getOrdersArray: getOrdersArray,
        getOrder:getOrder,
        getRef: getRef,
        updateOrderStatus :updateOrderStatus
    };
    
    
    function replaceAll( text){
      while (text.toString().indexOf(".") != -1)
          text = text.toString().replace(".",",");
      return text;
    }    
    
}]);