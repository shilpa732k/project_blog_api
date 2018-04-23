var express = require('express')
var router = express.Router()
var User = require('../lib/User')
var Article = require('../lib/Article')
var Comments = require('../lib/Comments')

router.get('/signup',function(req,res,next) {
    res.render('index')
})
router.get('/login',function(req,res,next) {
    res.render('login')
})

router.get('/listuser/:id',function(req,res,next) {
    res.render('create_article')
})

router.get('/writeArticle/:id',function(req,res,next) {
    User.findById(req.params.id, function(err,user){
    res.render('add_article', {
        title:"Add article",
        username:user.username
    })
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
   
})

router.get('/editComment/:id/:id1',function(req,res,next) {
    Comments.findById(req.params.id, function(err, comment){
    Article.findById(req.params.id1, function(err, article){
        if(err){
            return res.send(err)
            next()
        }
        res.render('edit_comment', {
            title:article.title,
            comment:comment
        })
    })
}) 
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
        return res.status(200).render('create_article', {
            title: 'WELCOME',
            user: user
        })
    })
            
})

router.get('/dashboard', function(req, res) {
    if(!req.session.user) {
       return res.status(401).send("pls login by /login url")
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

/*router.get('/listUser',function(req,res) {
    User.find({}, function (err, users){
        if(err){
            res.send('something went really wrong!!')
            next()
        }
        res.json(users)
    })
})*/

router.get('/listUsers/:id',function(req,res,next) {
    User.findById(req.params.id, function(err,loggedInUsed){
    User.find({}, function(err, User) {
        res.render('user_list', {
            title: 'Users',
            User:User,
            loggedInUsed:loggedInUsed
        })
        })
    })
})

router.post('/editProfile/:id', function(req, res){
    let user = {}
    user.firstname = req.body.firstname
    user.lastname = req.body.lastname
  
    let query = {_id:req.params.id}
  
    User.update(query, user, function(err){
      if(err){
        console.log(err)
        return;
      } else {
        //req.flash('success', 'Article Updated');
        res.status(200).send('success,User Updated')
      }
    })
  })

router.get('/DeleteProfile/:id',function(req, res) {
    User.findByIdAndRemove(req.params.id).exec().then(doc =>{
        if(!doc) {return res.status(404).end()}
        return res.status(200).send('deleted your account')
    })
    .catch(err => next(err))
}) 


router.post('/writeArticle/:username', function(req,res){
    var title = req.body.title
    var description = req.body.description
    var author = req.params.username

    var newArticle = new Article()
        newArticle.title = title
        newArticle.description = description
        newArticle.author = author
        newArticle.save(function(err, SavedArticle){
            if(err){
                return res.send(err)
            }
            return res.status(200).send('Article written succesfully by ' + author)
        })
})

/*router.get('/listArticles',function(req,res) {
    Article.find({}, function (err, articles){
        if(err){
            res.send(err)
            next()
        }
        res.json(articles)
    });
})*/


router.get('/listArticles1/:id',function(req,res,next) {
    User.findById(req.params.id, function(err,loggedInUser){
    Article.find({}, function(err, Article) {
        res.render('articles_list', {
            title: 'Articles',
            Article: Article,
            loggedInUser:loggedInUser
        })
    })
})
})

router.get('/ListComments/:id/:id1',function(req,res,next) {
    Article.findById(req.params.id, function(err,article){
        User.findById(req.params.id1, function(err,user){
    Comments.find({}, function(err, comment) {
        if (err){ return res.send(err)}
        res.render('comment_list', {
            title: 'Comments',
            article: article,
            comment:comment,
            user:user
           //article_id:JSON.stringify(comment.article[0])
        })
    })
})
})
})


router.post('/commentArticle/:id/:id1', function(req,res){
    User.findById(req.params.id1, function(err,users){
        Article.findById(req.params.id, function(err, articles){
    var comment = req.body.comment
    var user = req.params.id1
    var article = req.params.id
    
    var newComment = new Comments()
    newComment.comment = comment
    newComment.user = user
    newComment.article = article

    console.log(article)
    //var comment = JSON.stringify(newComment)
    newComment.save(function(err, SavedComment){
            if(err){
                return res.send(err)
            }
            res.render('commented_article',{
                title:'Comments',
                SavedComment:SavedComment,
                users:users,
                articles:articles                
            })
    })
})
})
})

router.post('/editComment/:id', function(req, res){
    let comment = {}
    comment.comment = req.body.comment
  
    let query = {_id:req.params.id}
  
    Article.update(query, comment, function(err){
      if(err){
        console.log(err)
        return
      } else {
        res.status(200).send('success,Comment Updated')
      }
    })
  })

router.post('/editArticle/:id', function(req, res){
    let article = {}
    article.title = req.body.title
    //Article.author = req.body.author;
    article.description = req.body.description
  
    let query = {_id:req.params.id}
  
    Article.update(query, article, function(err){
      if(err){
        console.log(err)
        return
      } else {
        //req.flash('success', 'Article Updated');
        res.status(200).send('success,Article Updated')
      }
    })
  })

  //onclick of hyperlink of article this should route
  router.get('/singleArticle/:id1/:id', function(req, res){
    User.findById(req.params.id1, function(err,loggedInUser){
    Article.findById(req.params.id, function(err, article){
    Comments.find({}, function(err, comment) {
        if(err){
            return res.send(err)
        }
        if(article.author!=loggedInUser.username){
            res.render('particular_article', {
                article:article,
                loggedInUser:loggedInUser,
                comment:comment
              })
            }
        else{
        res.render('my_article_action', {
          article:article,
          loggedInUser:loggedInUser,
          comment:comment         
        })
        }
      })
    })
    })
  })
 
  router.get('/myArticles/:id1', function(req, res){
     User.findById(req.params.id1, function(err,loggedInUsed){
        Article.find({}, function(err, article) {
        if(err){
            return res.send(err)
        }
        res.render('my_article', {
          title:'Articles',
          article:article,
          loggedInUsed:loggedInUsed
        })
        })
      })
    })

  router.get('/user_profile/:id/:id1', function(req, res){
    User.findById(req.params.id, function(err,user){
     User.findById(req.params.id1, function(err,loggedInUsed){
        Article.find({}, function(err, article) {
        if(err){
            return res.send(err)
        }
        res.render('users_profile', {
          title:'Articles',
          article:article,
          user:user,
          loggedInUsed:loggedInUsed
        })
        })
      })
    })
    })

  router.get('/deletearticle/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        //console.log(req.params.id)
        //res.send(article)
        article.remove(function(err){
          if(err){
            console.log(err)
          }
          res.status(200).send('deleted_article')
        })
    }) 
})

router.get('/deleteComment/:id/:id1/:id2', function(req, res){
    Comments.findById(req.params.id, function(err, comment){
        Article.findById(req.params.id1, function(err, article){
            User.findById(req.params.id2, function(err,user){
                comment.remove(function(err){
          if(err){
            console.log(err)
          }
          res.status(200).send('deleted_comment')
        })
    }) 
})
    })
})

router.get('/filteredbyauthor1/:username/:id',function(req,res,next) {
    var author = req.params.username
    User.findById(req.params.id, function(err,loggedInUsed){
    User.find({}, function(err, users){
        /*for( var i=0;i<users.length;i++){
            if(users.username==author){
                var userID = users._id
            }
        }*/
    Article.find({}, function(err, article){  
        if(err){
            return res.send(err)
        }
        res.render('filtered_user_list', {
            title:'Articles',
            article:article,
            users:users,
            author:author,
            loggedInUsed:loggedInUsed
          })
    })
})
})
})

router.post('/filterbyauthor/:id', function(req,res){
    User.findById(req.params.id, function(err,loggedInUsed){
          res.redirect('/filteredbyauthor1/'+req.body.username+'/'+loggedInUsed._id)
    })
  })

  router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are logged out')
    res.redirect('/login')
  })
module.exports = router
