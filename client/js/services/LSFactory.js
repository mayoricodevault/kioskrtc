xively.factory('LSFactory', function LSFactory($window) {
    'use strict';
    var store = $window.localStorage;
    return {
      getUser: getUser,
      setData: setData,
      getSessionId:getSessionId,
      getSocketId : getSocketId
    };

    function getUser() {
      return store.getItem("userId");
    }
    
    function getSessionId() {
      return store.getItem("sessionid");
    }
    
    function getSocketId() {
      return store.getItem("socketid");
    }
    
    function getData(dataKey) {
        return store.getItem(dataKey);
    }
    
    function setData(dataKey, dataValue) {
      if (dataValue) {
        store.setItem(dataKey, dataValue);
      } else {
        store.removeItem(dataKey);
      }
    }

  });