var express = require('express')
var router = express.Router()
var User = require('../lib/User')
var Article = require('../lib/Article')

router.get('/',function(req,res,next) {
    Article.find({}, function(err, Article) {
        res.render('articles_list', {
            title: 'Articles',
            Article: Article
        })
    })
})

router.get('/signup',function(req,res,next) {
    res.render('index')
})
router.get('/login',function(req,res,next) {
    res.render('login')
})

router.get('/listuser/:id',function(req,res,next) {
    res.render('create_article')
})

router.get('/writeArticle',function(req,res,next) {
    res.render('add_article', {
        title:"Add article"
    })
})


router.get('/editArticle1/:id',function(req,res,next) {
    Article.findById(req.params.id, function(err, article){
       /*if(article.author != req.user._id){
          req.flash('danger', 'Not Authorized');
          res.redirect('/');
       }*/
        if(err){
            return res.send(err)
            next()
        }
        res.render('edit_article', {
            title:'Edit Article',
            article:article
        })
    })
    /*if(err){
        return res.send(err)
        next()
    }
    res.json(article)*/
})

router.get('/editProfile1/:id',function(req,res,next) {
    User.findById(req.params.id, function(err, user){
        if(err){
            return res.send(err)
            next()
        }
        res.render('edit_profile', {
            title:'Edit Profile',
            user:user
        })
    })
})



router.post('/login', function(req,res) {
    var username = req.body.username
    var password = req.body.password
    
    User.findOne({username: username, password: password}, function(err, user) {
        if(err) {
            console.log(err)
            return res.status(500).send('Incorrect user and password')
        }
        if(!user) {
            return res.status(404).send('Not a Valid user')
        }
        req.session.user = user
        return res.status(200).render('create_article')
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
        
        return res.status(200).send('Sign UP sucess')
        
    })
})

router.get('/listUser',function(req,res) {
    User.find({}, function (err, users){
        if(err){
            res.send('something went really wrong!!')
            next()
        }
        res.json(users)
    })
})

router.post('/editProfile/:id', function(req, res){
    let user = {};
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
  
    let query = {_id:req.params.id}
  
    User.update(query, user, function(err){
      if(err){
        console.log(err);
        return;
      } else {
        //req.flash('success', 'Article Updated');
        res.status(200).send('success,User Updated')
      }
    })
  })

router.delete('/listuser/:id',function(req, res) {
    User.findByIdAndRemove(req.params.id).exec().then(doc =>{
        if(!doc) {return res.status(404).end()}
        return res.status(204).end()
    })
    .catch(err => next(err))
}) 


router.post('/writeArticle', function(req,res){
    var title = req.body.title
    var description = req.body.description
    var author = req.body.author

    var newArticle = new Article()
        newArticle.title = title
        newArticle.description = description
        newArticle.author = author
        newArticle.save(function(err, SavedArticle){
            if(err){
                return res.send(err)
            }
            return res.status(200).send('Article written succesfully' + author)
        })
})

router.get('/listArticles',function(req,res) {
    Article.find({}, function (err, articles){
        if(err){
            res.send(err);
            next();
        }
        res.json(articles);
    });
})

router.post('/editArticle/:id', function(req, res){
    let article = {};
    article.title = req.body.title;
    //Article.author = req.body.author;
    article.description = req.body.description;
  
    let query = {_id:req.params.id}
  
    Article.update(query, article, function(err){
      if(err){
        console.log(err);
        return;
      } else {
        //req.flash('success', 'Article Updated');
        res.status(200).send('success,Article Updated')
      }
    })
  })

  //onclick of hyperlink of article this should route
  router.get('/singleArticle/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
      //User.findById(article.author, function(err, user){
        res.render('particular_article', {
          article:article,
          //author: user.name
        })
      })
    })
  //})

  router.delete('/deletearticle/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        article.remove(function(err){
          if(err){
            console.log(err);
          }
          res.status(200).render('deleted_article');
        });
    });  
});

router.post('/filterbyauthor', function(req,res){
    var author = req.body.username

    Article.(function(err, SavedArticle){
            if(err){
                return res.send(err)
            }
            return res.status(200).send('Article written succesfully' + author)
        })
})
module.exports = router
