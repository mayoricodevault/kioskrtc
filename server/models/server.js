var mongoose = require('mongoose');
var serverSchema = mongoose.Schema({
    name : {type:String,required:true,index:{unique:true}},
    ipaddress : String,
    url : String
});

module.exports = mongoose.model('Server', serverSchema);