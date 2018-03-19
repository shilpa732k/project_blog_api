var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/blog_api_project')

var articleSchema = mongoose.Schema({
   // _id: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    author: {
        type: mongoose.Schema.Types.String,
        ref: 'User'
    }
})

var Article = mongoose.model('myarticle', articleSchema)
module.exports = Article