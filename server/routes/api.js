var requestify = require('requestify');
var stringify = require('json-stringify');
module.exports = function(router, socket){
    router.get('/servers/', function(req, res){
         requestify.request('http://iottemplate-mmayorivera.c9.io/serverlist', {
                method: 'GET',
                body: req.body,
                headers : {
                        'Content-Type': 'application/json'
                },
                dataType: 'json'        
                }).then(function(response) {
                    var result = JSON.parse(response.body);
                    res.status(200).json(result.servers )
            });
        
   
    });
    router.get('/devices/', function(req, res){
         requestify.request('http://iottemplate-mmayorivera.c9.io/deviceslist', {
                method: 'GET',
                body: req.body,
                headers : {
                        'Content-Type': 'application/json'
                },
                dataType: 'json'        
                }).then(function(response) {
                    var result = JSON.parse(response.body);
                    console.log(result);
                    res.status(200).json(result.devices )
            });
        
   
    });
    
}