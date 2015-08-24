xively.factory('Api', ['$resource', function($resource){
    return {
        Subscribe: $resource('/api/subc/:id', {id: '@id'})
    }
}]);