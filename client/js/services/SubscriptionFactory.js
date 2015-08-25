xively.factory('SubscriptionFactory', ['$http', 'API_URL', 'AuthTokenFactory', '$q', "$rootScope", function($http, API_URL, AuthTokenFactory, $q, LSFactory){
    return {
        subscribe : subscribe,
        unsubscribe: unsubscribe,
        getSession : getSession
    };
    
    function subscribe(socketid, deviceName,tagId, serverUrl) {
      return $http.post( API_URL + '/subscribe', {
          socketid : socketid,
          deviceName: deviceName,
          tagId : tagId,
          serverUrl : serverUrl
      }).then(function success(response) {
         AuthTokenFactory.setToken(response.data.sessionid);
         return response;
      });
    }
    function unsubscribe(socketid) {
          return $http.post( API_URL + '/unsubscribe', {
              socketid : socketid
          }).then(function success(response) {
             AuthTokenFactory.setToken();
             return response;
          });
    }
    function getSession() {
        if (AuthTokenFactory.isAuth) {
            return $http.post( API_URL + '/me');
        } else {
            return $q.reject({data : 'Client does not a valid auhtorization'});
        }
    }
}]);