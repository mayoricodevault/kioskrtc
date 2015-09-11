xively.factory('SubscriptionFactory', ['$http', 'API_URL', 'AuthTokenFactory', '$q', "LSFactory", function($http, API_URL, AuthTokenFactory, $q, LSFactory){
    
    
    return {
        subscribe : subscribe,
        unsubscribe: unsubscribe,
        getSession : getSession,
        isStation:isStation
    };
    function subscribe(socketid, deviceName,tagid, serverUrl, deviceType, deviceDetected, masterid) {
      return $http.post( API_URL + '/subscribe', {
          socketid : socketid,
          deviceName: deviceName,
          tagId : tagid,
          serverUrl : serverUrl,
          deviceType : deviceType,
          deviceDetected :deviceDetected,
          masterid:masterid
      }).then(function success(response) {
            AuthTokenFactory.setToken(response.data.sessionid);
            LSFactory.setData("sessionid", response.data.sessionid);
            LSFactory.setData("socketid", socketid);
            LSFactory.setData("deviceName", deviceName);
            LSFactory.setData("serverUrl", serverUrl);
            LSFactory.setData("tagid", tagid);
            LSFactory.setData("deviceType", deviceType);   
            LSFactory.setData('deviceDetected', deviceDetected);
            LSFactory.setData('masterid', masterid);
            return response;
      }, function(response){
          return response;
      });
    }
    function unsubscribe(socketid) {
          return $http.post( API_URL + '/unsubscribe', {
              socketid : socketid
          }).then(function success(response) {
             AuthTokenFactory.setToken();
            LSFactory.setData("sessionid");
            LSFactory.setData("socketid");
            LSFactory.setData("deviceName");
            LSFactory.setData("serverUrl");
            LSFactory.setData("tagid");
            LSFactory.setData("deviceType");    
            LSFactory.setData("deviceDetected");   
            LSFactory.setData("masterid");  
            return response;
          });
    }
    
    function isStation(socketid) {
         if (LSFactory.getSocketId() == socketid) {
             return true;
         }
         return false;
    }
    function getSession() {
        if (AuthTokenFactory.isAuth) {
            return $http.post( API_URL + '/me');
        } else {
            return $q.reject({data : 'Client does not a valid auhtorization'});
        }
    }
}]);