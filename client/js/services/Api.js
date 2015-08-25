xively.factory('Api', ['$resource', function($resource){
    return {
        Subscribe: $resource('/api/subc/:id', {id: '@id'}),
        Server: $resource('/api/servers/:id', {id: '@id'}),
        Device: $resource('/api/devices/:id', {id: '@id'})
    }
}]);