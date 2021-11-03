const mongoose = require('mongoose')

const compschema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    companyname: {
        type: String,
        required: true
    },
    joindate: {
        type: Date
    },
    leavedate: {
        type: Date
    },
    salery: {
        type: Number,
        required: true
    },
    letter: {
        type: String,
    },
    degination: {
        type: String,
    },
    remark: {
        type: String,
    },
    saleryData: [
        {
            currentsalery: {
                type: Number,
            },
            recivedamount: {
                type: Number,
            },
            slip: {
                type: String,
            },
            remark: {
                type: String,
            },
            deduction:{
                type: Number,
            },
            isactive: {
                type: Boolean,
                default: true
            },
            datetime:{
                type:Date,
                default:Date.now()
            }
        }
    ],
    isactive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const compmodel = mongoose.model('company', compschema);
module.exports = compmodel;