var mongoose = require('mongoose');
var settingSchema = mongoose.Schema({
		notification:Boolean,
		usegooglemaps:Boolean,
		googlemapapikey:String,
		email:String,
		sms:String,
		urgentalerts:Boolean,
		devicesnotifications:Boolean,
		devicenotrespondig:Boolean,
		connectionlost:Boolean
});

module.exports = mongoose.model('settings', settingSchema);