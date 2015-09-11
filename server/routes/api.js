var requestify = require('requestify');
var configDB = require('../config/config.js');
module.exports = function(router, socket){
    router.get('/servers/', function(req, res){
         requestify.request(configDB.url_controller + '/serverlist', {
                method: 'GET',
                body: req.body,
                headers : {
                        'Content-Type': 'application/json'
                },
                dataType: 'json'        
                }).then(function(response) {
                    var result = JSON.parse(response.body);
                    res.status(200).json(result.servers );
            });
    });
    router.get('/devices/', function(req, res){
         requestify.request(configDB.url_controller + '/deviceslist', {
                method: 'GET',
                body: req.body,
                headers : {
                        'Content-Type': 'application/json'
                },
                dataType: 'json'        
                }).then(function(response) {
                    var result = JSON.parse(response.body);
                    res.status(200).json(result.devices);
            });
        
   
    });
    router.get('/products/', function(req, res){
         requestify.request(configDB.url_controller + '/productslist', {
                method: 'GET',
                body: req.body,
                headers : {
                        'Content-Type': 'application/json'
                },
                dataType: 'json'        
                }).then(function(response) {
                    var result = JSON.parse(response.body);
                    res.status(200).json(result.products );
            });
        
   
    }); 
};