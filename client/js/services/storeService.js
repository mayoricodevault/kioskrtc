xively.factory('storeService', function($rootScope) {
    return {
        
        jsonWrite: function (key,data) {
            var dataToStore = JSON.stringify(data);
            window.sessionStorage.setItem(key,dataToStore);
		},
		
		jsonRead: function(key){
		    var data = window.sessionStorage.getItem(key);
		    return JSON.parse(data);
		}
	};
});