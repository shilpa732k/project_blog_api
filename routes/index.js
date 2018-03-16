var express = require('express')
var router = express.Router()
var User = require('../lib/User')



router.get('/',function(req,res,next) {
    res.render('index')
})



router.post('/login', function(req,res) {
    var username = req.body.username
    var password = req.body.password
    
    User.findOne({username: username, password: password}, function(err, user) {
        if(err) {
            console.log(err)
            return res.status(500).send()
        }
        if(!user) {
            return res.status(404).send()
        }
        req.session.user = user
        return res.status(200).send()
    })
            
            })

router.get('/dashboard', function(req, res) {
    if(!req.session.user) {
       return res.status(401).send()
       }
    return res.status(200).send("welcome to session login")
})
router.post('/register',function(req,res) {
    var username = req.body.username
    var password = req.body.password
    var firstname = req.body.firstname
    var lastname = req.body.lastname
    
    var newuser = new User()
    newuser.username = username
    newuser.password = password
    newuser.firstname = firstname
    newuser.lastname = lastname
    newuser.save(function(err, savedUser) {
        if(err) {
            console.log(err)
            return res.status(500).send()
        }
        
        return res.status(200).send()
    })
})

router.get('/listUser',function(req,res) {
    User.find({}, function (err, users){
        if(err){
            res.send('something went really wrong!!');
            next();
        }
        res.json(users);
    });
})

router.delete('/listuser/:id',function(req, res) {
    User.findByIdAndRemove(req.params.id).exec().then(doc =>{
        if(!doc) {return res.status(404).end()}
        return res.status(204).end()
    })
    .catch(err => next(err))
}) 

module.exports = router