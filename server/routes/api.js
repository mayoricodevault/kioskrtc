var Device = require('../models/device');
module.exports = function(router, socket){

    router.post('/devices', function(req, res){
     
        var device = new Device();
        device.devicename = req.body.devicename;
        device.devicelocation = req.body.devicelocation;
        console.log(req);
        device.save(function(err, data){
            if(err)
                throw err;
            res.json(data);
        });
    });
    
    router.get('/devices', function(req, res){
        Device.find({}, function(err, data){
            res.json(data);
        });
    });
    
    router.delete('/devices', function(req, res){
        Device.remove({}, function(err){
            res.json({result: err ? 'error' : 'ok'});
        });
    });
    
    router.get('/devices/:id', function(req, res){
        Device.findOne({_id: req.params.id}, function(err, data){
            res.json(data);
        })
    })
    
    router.delete('/devices/:id', function(req, res){
        Device.remove({_id: req.params.id}, function(err){
            res.json({result: err ? 'error' : 'ok'});
        })
    })
    
    router.post('/devices/:id', function(req, res){
        Device.findOne({_id: req.params.id}, function(err, data){
            var device = data;
            device.devicename = req.body.devicename;
            device.devicelocation = req.body.devicelocation;
               console.log(data);
            device.save(function(err, data){
                if(err)
                    throw err;
                res.json(data);
            });
            
        });
    });
    
    
}