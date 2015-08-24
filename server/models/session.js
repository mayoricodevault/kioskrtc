var mongoose = require('mongoose');
var sessionSchema = mongoose.Schema({
    socketid : String,
    sessionid : String,
    token : String,
    userId : String,
    username : String,
    deviceId : String,
    dt : Date,
    role : String,
    status : String
});

module.exports = mongoose.model('sessions', sessionSchema);