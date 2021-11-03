const Usermodel = require('../models/user')
const jwt = require('jsonwebtoken');

const getdata = async (req,res,next)=>{
    let userToken = req.cookies.jwt;
    try {
        const decodetoken = jwt.verify(userToken,process.env.SECRET);
        const userid = decodetoken.user_id.id;
        const userdata = await Usermodel.find({"_id":userid}).select("-password");
        if(userdata){
            req.userdata = userdata;
        }
        next();
    } catch (error) {
        return res.redirect('/home');
    }
}


module.exports = getdata;