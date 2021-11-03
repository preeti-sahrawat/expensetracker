require('dotenv').config();
const jwt = require('jsonwebtoken');
const Usermodel = require('../models/user')

const isuserlogin = async (req,res,next)=>{
    let userToken = req.cookies.jwt;
    try {
        var decodetoken = jwt.verify(userToken,process.env.SECRET);
        const userid = decodetoken.user_id.id;
        const userdata = await Usermodel.find({"_id":userid}).select("-password");
        if(!userdata){
            return res.redirect('/logout');
        }
    } catch (error) {
       return res.redirect('/');
    }
    next();
}

const whenuserlogin = (req,res,next)=>{
    let userToken = req.cookies.jwt;
    if(userToken){
        return res.redirect('/home');
    }
    next();
}


module.exports = {isuserlogin,whenuserlogin};

