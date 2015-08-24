xively.factory('AuthTokenFactory', function AuthTokenFactory($window) {
    'use strict';
    var store = $window.localStorage;
    var key = 'auth-token';
    var cachedToken;
    var isAuthenticated = false;
    
    return {
      getToken: getToken,
      setToken: setToken,
      isAuth : isAuth
    };

    function getToken() {
        if (!cachedToken)
                cachedToken = store.getItem(key);
        return cachedToken;
    }
    function setToken(token) {
      if (token) {
        store.setItem(key, token);
        cachedToken = token;
        isAuthenticated = true;
      } else {
        store.removeItem(key);
        cachedToken = null;
        isAuthenticated = false;
      }
    }
    
    function isAuth() {
      return !!getToken();
    }

  });