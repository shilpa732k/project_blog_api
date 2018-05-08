var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var path = require('path')
var logger = require('morgan')
var bodyParser = require('body-parser')

var routes = require('./routes/index')
var users = require('./routes/users')

var app = express()

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes)
app.use('/users', users)

app.use(function(req,res,next) {
    /*res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Expires', '-1')
    res.header('Pragma', 'no-cache')
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')*/
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})
app.listen(3000)
module.exports = app