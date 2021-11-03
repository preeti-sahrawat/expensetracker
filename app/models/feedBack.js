const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    ratting:{
        type:Number,
        required:true
    },
    feedback:{
        type:String,
        required:true
    }
},{timestamps:true})
const feedback = mongoose.model('feedback',feedbackSchema);
module.exports = feedback;