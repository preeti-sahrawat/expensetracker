const expencemodel = require('../models/expence');

function indexcontroller(){
    //////////////////////////////////////////////////////////////// global variable
       let loginuser = null;
    //////////////////////////////////////////////////////////////// global end

    return {
        addexpence:function(req,res){
            loginuser = req.userdata[0].email;
            return res.render('home/addexpence',{loginuser,title:"Add-Expense"});
        },
        viewexpence:async function(req,res){
            loginuser = req.userdata[0].email;
            let perpage = 7;
            let page = 1;

            const expencedata = await expencemodel.find({"email":loginuser}).skip((perpage * page) - perpage).limit(perpage).sort({"createdAt":-1});
            const count = await expencemodel.countDocuments({"email":loginuser});
            return res.render('home/viewexpence',{loginuser,expencedata,title:"View-Expense",userdata:req.userdata[0],current:page,totalpages:Math.ceil(count / perpage)});
        },
        viewexpencebypage:async function(req,res){
            loginuser = req.userdata[0].email;
            var perpage = 7;
            var page = req.params.page || 1;

            const expencedata = await expencemodel.find({"email":loginuser}).skip((perpage * page) - perpage).limit(perpage).sort({"createdAt":-1});
            const count = await expencemodel.countDocuments({"email":loginuser});

            return res.render('home/viewexpence',{loginuser,expencedata,title:"View-Expense",userdata:req.userdata[0],current:page,totalpages:Math.ceil(count / perpage)});
        },
        deleteexpense:async function(req,res){
            loginuser = req.userdata[0].email;
            const id = req.params.id;
            try {
                await expencemodel.findByIdAndDelete(id);
                return res.redirect('/viewexpence');
            } catch (error) {
                return res.redirect('/viewexpence');
            }
        },
        viewreport:function(req,res){
            loginuser = req.userdata[0].email;
            return res.render('home/viewreport',{loginuser,title:"View-Report"});
        },
        getreport:async function(req,res){
            loginuser = req.userdata[0].email;
            const {from,to} = req.body;
            // console.log(from,to);
            try {
                const expencedata = await expencemodel.find({"email":loginuser,"createdAt":{"$gte": new Date(from), "$lte": new Date(to)}});
                return res.status(200).json({status:true,message:"data found",expencedata});   
            } catch (error) {
                return res.status(400).json({status:false,message:"Something went wrong",error});   
            }            
        }
    }
}


module.exports = indexcontroller;