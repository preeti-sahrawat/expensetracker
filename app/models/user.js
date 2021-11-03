const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
     name:{
         type:String,
         required:true,
         trim:true
     },
     email:{
         type:String,
         required:true
     },
     password:{
         type:String,
         required:true
     },
     isaccount_active:{
         type:Boolean,
         default:true
     },
     resetLink:{
        type:String,
        default:''
     }
},{timestamps:true});

const user = mongoose.model('user',userschema);
module.exports = user;
