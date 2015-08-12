xively.factory('Api', ['$resource', function($resource){
    return {
        Customer: $resource('/api/devices/:id', {id: '@id'})
    }
}]);