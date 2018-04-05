var mongoose = require('mongoose')
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/blog_api_project')

var commentSchema = new mongoose.Schema({
    user: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    article: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    comment: String   
})

var Comment = mongoose.model('mycomment',commentSchema)
module.exports = Comment