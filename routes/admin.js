var express = require('express');
var router = express.Router();
var userHelpers=require('../helpers/user-helpers')
var collection=require('../config/collection');
const { response } = require('express');
const { Db } = require('mongodb');

var collections=collection.USER_COLLECTION

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.admin){
    console.log('session present');
    userHelpers.getAllUsers().then((users)=>{ 
      res.render('admin-home',{users});
    })
  }else{
    res.render('admin-login',{"logErr":req.session.logErr});
    req.session.logErr=false;
  }
});

const predefined={name:"admin",password:123}

router.post('/admin-login-action',(req,res)=>{
 
  let admin=req.body
  console.log(req.body)
  if(admin.name===predefined.name){
      if(parseInt(admin.password)===predefined.password){
        req.session.admin=admin;
        res.redirect('/admin')
      }else{
        req.session.logErr=true;
        res.redirect('/admin')
      }
  }else{
    req.session.logErr=true;
    res.redirect('/admin')
  }
})

router.post('/signup',(req,res,next)=>{
  console.log(req.body)
  userHelpers.doSignup(req.body).then((response)=>{
      console.log('signupcompleted')
      res.redirect('/admin')
  })
  
})

router.get('/signup',(req,res)=>{
  console.log("Reached get method of signup")
  res.redirect('/admin');
})

router.get('/adminlogout',(req,res)=>{
  console.log('logedout')
  req.session.admin=null;
        res.redirect('/admin');
    
})

router.get('/delete-user/:id',(req,res)=>{
    let userId=req.params.id
    console.log(userId);
    userHelpers.deleteUser(userId).then((response)=>{
      res.redirect('/admin')
    })
})

router.get('/admin-edit/:id',async (req,res)=>{
  let user=await userHelpers.getUserDetails(req.params.id)
  console.log(user)
  res.render('admin-edit',{user})
})

router.post('/edit/:id',(req,res)=>{
  userHelpers.editUser(req.params.id,req.body).then(()=>{
    res.redirect('/admin');
  })
})

router.get('/admin-add-user',(req,res)=>{
  res.render('admin-add-user');
})

module.exports = router;
