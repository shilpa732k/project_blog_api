var express = require('express')
var router = express.Router()

router.get('/', function(req,res) {
res.send('respond with a response')
})

module.exports = router