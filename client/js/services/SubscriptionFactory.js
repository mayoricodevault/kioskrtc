xively.factory('SubscriptionFactory', ['$http', 'API_URL', 'AuthTokenFactory', '$q', "$rootScope", function($http, API_URL, AuthTokenFactory, $q, LSFactory){
    return {
        subscribe : subscribe,
        unsubscribe: unsubscribe,
        getSession : getSession
    };
    
    function subscribe(scio, deviceType,locationId, serverId) {
      return $http.post( API_URL + '/subscribe', {
          scio : scio,
          deviceType: deviceType,
          locationId : locationId,
          serverId : serverId
      }).then(function success(response) {
         AuthTokenFactory.setToken(response.data.sessionid);
         
         return response;
      });
    }
    function unsubscribe() {
        AuthTokenFactory.setToken();
    }
    function getSession() {
        if (AuthTokenFactory.isAuth) {
            return $http.post( API_URL + '/me');
        } else {
            return $q.reject({data : 'Client does not a valid auhtorization'});
        }
    }
}]);