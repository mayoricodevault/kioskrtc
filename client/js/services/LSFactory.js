xively.factory('LSFactory', function LSFactory($window) {
    'use strict';
    var store = $window.localStorage;
    return {
      getUser: getUser,
      setData: setData,
      getSessionId:getSessionId,
      getSocketId : getSocketId,
      getTagId : getTagId,
      getMasterId:getMasterId,
      getFavCoffee:getFavCoffee,
      getDeviceName:getDeviceName,
      getDeviceType:getDeviceType,
      getServerUrl:getServerUrl,
      getDeviceDetected:getDeviceDetected
    };

    function getUser() {
      return store.getItem("userId");
    }
    
    function getServerUrl() {
      return store.getItem("serverUrl");
    }
    
    function getDeviceName() {
      return store.getItem("deviceName");
    }
    
    function getDeviceDetected() {
      return store.getItem("deviceDetected");
    }
    
    function getDeviceType() {
      return store.getItem("deviceType");
    }
    
    
    function getSessionId() {
      return store.getItem("sessionid");
    }
    
    function getSocketId() {
      return store.getItem("socketid");
    }
    
    function getTagId() {
        return store.getItem("tagid");
    }    
    
    function getMasterId() {
        return store.getItem("masterid");
    }        

    function getFavCoffee() {
        return store.getItem("favcoffee");
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