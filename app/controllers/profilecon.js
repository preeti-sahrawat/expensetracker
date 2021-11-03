const Usermodel = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')

function indexcontroller(){
    //////////////////////////////////////////////////////////////// global variable
    //    var loginuser = localStorage.getItem('loginuserEmail')
       let loginuser = null;
    //////////////////////////////////////////////////////////////// global end

    return {
        viewprofile:function(req,res){
            loginuser = req.userdata[0].email;
            const userdata = req.userdata[0];
            return res.render('home/viewprofile',{loginuser,userdata,title:"View-Profile"});
        },
        changepass:function(req,res){
            loginuser = req.userdata[0].email;
            return res.render('home/changepass',{loginuser,title:"Change Password"});
        },
        updatepass:async function(req,res){
            loginuser = req.userdata[0].email;
            const userid = req.userdata[0].id;
            try {
                const data = await Usermodel.findByIdAndUpdate(userid,req.body);
                if(data){
                    res.status(200).json({status:true,data:data,message:"Profile updated successfully!"});
                }else{
                    res.status(400).json({status:false,err:"",message:"someting went wrong"});
                }
            } catch (error) {
                res.status(400).json({status:false,err:error,message:"someting went wrong"});   
            }
        },
        changepasspost:async function(req,res){
            loginuser = req.userdata[0].email;
            const {oldpass,newpass,cpass} = req.body;
            if(!oldpass || !newpass || !cpass){
                return  res.status(400).send({status:false,message:"All field required"});   
            }
            if(newpass != cpass){
                return res.status(400).send({status:false,message:"New password or confirm passwod not match"});   
            }
            try {
                const userdata = await Usermodel.findOne({"email":loginuser});
                if(!userdata){
                    res.status(400).send({status:false,message:"someting went wrong"});   
                }
                bcrypt.compare(oldpass,userdata.password,async(err,valid) =>{
                    console.log(valid);
                    if(err){     
                        return res.status(400).send({status:false,message:"your old password is not match"});   
                    }
                    if(valid){
                        const newhashpass = await bcrypt.hash(newpass,10);
                        console.log(newhashpass);
                        await Usermodel.findByIdAndUpdate(userdata._id,{"password":newhashpass});
                        return res.status(200).send({status:true,message:"password changed successfully||"}); 
                    }else{
                        console.log('old is wronf');
                    }
                })
            } catch (error) {
                return res.status(400).send({status:false,err:error,message:"someting went wrong"});   
            }   
        }
    }
}

module.exports = indexcontroller;