const mongoose = require('mongoose')

const salschema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    companyid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'company',
        required:true
    },
    currentsalery:{
        type:Number,
        required:true
    },
    recivedamount:{
        type:Number,
        required:true
    },
    slip:{
        type:String,
        required:true
    },
    remark:{
        type:String,
    },
    isactive:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

const salschema = mongoose.model('salery',salschema);
module.exports = salschema;