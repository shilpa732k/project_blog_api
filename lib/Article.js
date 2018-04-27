var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

mongoose.connect('mongodb://localhost/blog_api_project')

var articleSchema = mongoose.Schema({
   // _id: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    author:String
})
articleSchema.plugin(mongoosePaginate)
var Article = mongoose.model('myarticle', articleSchema)
module.exports = Article
