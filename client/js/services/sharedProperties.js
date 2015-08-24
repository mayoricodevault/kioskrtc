xively.service('sharedProperties', function() {
    var person;
    
    return {
        setPerson: function(p) {
            person=p;
        },
        getPerson: function() {
            return person;
        }
    };
});