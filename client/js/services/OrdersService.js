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
    
    return {
        getOrders: getOrders,
        getOrdersArray: getOrdersArray,
        getOrder:getOrder
    };
    
    
    function replaceAll( text){
      while (text.toString().indexOf(".") != -1)
          text = text.toString().replace(".",",");
      return text;
    }    
    
}]);