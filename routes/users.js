var express = require('express');
const { response } = require('../app');
var router = express.Router();
var userHelpers=require('../helpers/user-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  let user=req.session.user
  if(user){
    res.redirect('/login-action')
  }else{
  res.render('user-login',{"loginErr":req.session.loginErr});
  req.session.loginErr=false;
  }
});

router.post('/login-action',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      console.log(response);
      req.session.user=response.user
      req.session.user.loggedIn=true
      res.redirect('/')
    }else{
      req.session.loginErr=true;
      res.redirect('/');
    }
  })
})

router.get('/login-action',(req,res)=>{
  if(req.session.user){
    res.render('user-home');
  }else{
    res.redirect('/')
  }
})

router.get('/user-signup',(req,res)=>{
  res.render('user-signup',{'error':req.session.userExist});
  req.session.userExist=false
})


router.post('/signup',async (req,res,next)=>{
  let status=await userHelpers.userCheck(req.body)
  if(status){
    console.log("StATUS"+status)
    req.session.userExist=true
    res.redirect('/user-signup')
  }else{
    req.session.userExist=false
    userHelpers.doSignup(req.body).then((response)=>{
      console.log('signupcompleted');
  }).then(()=>{
    res.redirect('/signup')
  })
  
  }
})

router.get('/signup',(req,res)=>{
  console.log('get method of signup')
  res.redirect('/');
})

router.get('/logout',(req,res)=>{
  req.session.user=null
  res.redirect('/')
})

module.exports = router;
