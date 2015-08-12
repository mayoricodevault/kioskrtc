var mongoose = require('mongoose');
var deviceSchema = mongoose.Schema({
    devicename: String,
    devicelocation: String,
    icon : String,
    user_id : Number,
    location_id : Number,
    featured : Boolean
});

module.exports = mongoose.model('Device', deviceSchema);

// MIddleware
// deviceSchema.pre('save', function(next){
//     var device = this;
//     if(!device.isModified('devicename')) return next();
//     bcrypt.genSalt(10, function(err, salt){
//         if (err) return next(err);
//         bcrypt,hash(device.devicelocation, salt, null, function(err, hash){
//             if (err) return next(err);
//             device.devicelocation = hash;
//             next();
//         });
//     });
    
// })