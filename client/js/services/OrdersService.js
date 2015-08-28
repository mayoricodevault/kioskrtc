//xively.factory('OrdersService', ['$firebaseObject', 'FIREBASE_URI_ORDERS', function ($firebaseObject, FIREBASE_URI_ORDERS) {
xively.factory('OrdersService', ['$firebaseObject','$firebaseArray', 'FIREBASE_URI_ORDERS', function ($firebaseObject,$firebaseArray, FIREBASE_URI_ORDERS) {
    var ref = new Firebase(FIREBASE_URI_ORDERS);
/*
var activeOrders = {};
var query = ref.orderByChild("timeStamp");
query.on("child_added", function(messageSnapshot) {
  // This will only be called for the last 100 messages
   activeOrders=messageSnapshot.val();
//  var messageData = messageSnapshot.val();
  
});
*/
//ref = ref.orderByChild("timeStamp");
    
    
    
    
    
    
    var activeOrders = $firebaseArray(ref);
    
    
    
    
    //var sync = $firebaseObject(ref);
    //var activeOrders = sync.$asObject();
    
    var getOrders = function () {
        return activeOrders;
    };
    var addOrder = function (neworder) {
        // desarrollar
        
        // FIREBASE_URI_ORDERS/email
        
    };
    return {
        getOrders: getOrders,
        addOrder: addOrder
    };
}]);