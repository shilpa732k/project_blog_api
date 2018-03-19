var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/blog_api_project')

var userSchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    username: {type: String, unique: true},
    password: {type: String},
    firstname: String,
    lastname: String,
})

var User = mongoose.model('myuser', userSchema)
module.exports = User