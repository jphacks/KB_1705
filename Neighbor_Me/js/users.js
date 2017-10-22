//Mongoose用のSchema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    name : { type: String, require: true, unique: true }, 
    x : { type: Number },
    y : { type: Number },
    tags : { type: [String] }
});

module.exports = mongoose.model('user', User);
