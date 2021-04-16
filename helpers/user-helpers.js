var db=require('../config/connection')
var collection=require('../config/collection')
const bcrypt=require('bcrypt')
var objectId=require('mongodb').ObjectID
const { ObjectID } = require('mongodb')
const { response } = require('express')

module.exports={

    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                    resolve(data.ops[0])
            })
        })
        

    },
    doLogin:(userData)=>{
        return new Promise(async (resolve,reject)=>{
            let loginStatus=false
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({user_name:userData.user_name})
            if(user){
                    bcrypt.compare(userData.Password,user.Password).then((status)=>{
                        if(status){
                            console.log("login sucess")
                            response.user=user;
                            response.status=true
                            resolve(response)
                        }else {
                            console.log("login failed")}
                            resolve({status:false})
                        })
            }else{
                console.log("login fail")
                resolve({status:false})

            }
        })
    },
    getAllUsers:()=>{
        return new Promise(async (resolve,reject)=>{
            let users=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    deleteUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).removeOne({_id:objectId(userId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getUserDetails:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(userId)}).then((user)=>{
                resolve(user)
            })
        })
    },
    editUser:(userId,userDetails)=>{
        return new Promise(async(resolve,reject)=>{
            userDetails.Password=await bcrypt.hash(userDetails.Password,10)
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},{$set:{user_name:userDetails.user_name, email:userDetails.email, Password:userDetails.Password}})
            .then((response)=>{
                resolve()
            })
        })
    },
    userCheck:(userData)=>{
        return new Promise (async(resolve,reject)=>{
            let user_nameExist= await db.get().collection(collection.USER_COLLECTION).
            find({user_name:userData.user_name}).count();
            let emailExist= await db.get().collection(collection.USER_COLLECTION).
            find({email:userData.email}).count();
            console.log(user_nameExist)
            if(user_nameExist || emailExist){
                status=true;
                resolve(status);
            }else{
                status=false;
                resolve(status);
            }
        })
    }

}