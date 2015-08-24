var Device = require('../models/device');
var Setting = require('../models/setting');
var User = require('../models/users');
var session = require('../models/users');
module.exports = function(router, socket){
    
    router.get('/devices/:id', function(req, res){
        Device.findOne({_id: req.params.id}, function(err, data){
            res.json(data);
        })
        
        
    })
    
    router.post('/devices/:id', function(req, res){
        
    });
    
}