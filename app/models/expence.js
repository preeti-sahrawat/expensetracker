const mongoose = require('mongoose')

const expenceschema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    email:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    cradittype:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    isactive:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

const expencemodel = mongoose.model('expence',expenceschema);
module.exports = expencemodel;