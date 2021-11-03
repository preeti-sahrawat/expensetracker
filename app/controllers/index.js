const jwt = require('jsonwebtoken');
const expenseModel = require('../models/expence');
const feedBackModel = require('../models/feedBack')

function indexcontroller(){
    //////////////////////////////////////////////////////////////// global variable
    //    let loginuser = localStorage.getItem('loginuserEmail');
    let loginuser = null;
    
    //////////////////////////////////////////////////////////////// global end

    const filterByDate = async (from,to)=>{
        let frommilisecond = Date.parse(from);
        let tomilisecond = Date.parse(to);
        let total = 0;
        const data = await expenseModel.find({"email":loginuser});
        data.map((d)=>{
            let midate = new Date(d.createdAt);
            let ms = Date.parse(midate);
            if(ms>=frommilisecond && ms<=tomilisecond && d.cradittype == 'debit'){
                total += d.amount;
            }
        });
        return total;
    }

    const fetchdashboarddata = async () =>{
        let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        let totalCradit = 0;
        let totalDebit = 0;
        let lastmonthExpenseavg = 0;
        let todayExpense = 0;
        let yesterdatsExpense = 0;
        let last7Expense = 0;
        let last30Expense = 0;
        let yearly = 0;
        let lastyearExpenseavg = 0;
        const date = new Date();
        let todaydate = date.toLocaleDateString();
        let todaymilisecond = Date.parse(todaydate);
        // console.log(todaymilisecond,'todat');
        try {
            const data = await expenseModel.find({"email":loginuser});
            data.map((d)=>{
                let midate = new Date(d.createdAt);
                let ms = Date.parse(midate);
                let yedate = (todaymilisecond-(24*60*60*1000));
                let d7day = (todaymilisecond-(24*60*60*1000*7));
                let d30day = (todaymilisecond-(24*60*60*1000*30));
                let dyear = (todaymilisecond-(24*60*60*1000*30));

                if(d.cradittype == 'cradit'){
                    totalCradit += d.amount;
                }
                if(d.cradittype == 'debit'){
                    totalDebit += d.amount;
                }
                if(ms>=todaymilisecond && d.cradittype == 'debit'){
                    todayExpense += d.amount;
                }
                if(ms>=yedate && yedate<=todaymilisecond && d.cradittype == 'debit'){
                    yesterdatsExpense += d.amount;
                }
                if(ms>=d7day && d7day<=todaymilisecond && d.cradittype == 'debit'){
                    last7Expense += d.amount;
                }
                if(ms>=d30day && d30day<=todaymilisecond && d.cradittype == 'debit'){
                    last30Expense += d.amount;
                }
                if(ms>=dyear && dyear<=todaymilisecond && d.cradittype == 'debit'){
                    yearly += d.amount;
                }                
            })
            lastmonthExpenseavg = parseFloat(await filterByDate(`${date.getMonth() ? months[date.getMonth()-1] : months[date.getMonth()]} , 01, ${date.getFullYear()}`,`${date.getMonth() ? months[date.getMonth()-1] : months[date.getMonth()]} , 31, ${date.getFullYear()}`)/30).toFixed(2);;
            lastyearExpenseavg = parseFloat(await filterByDate(`jan , 01, ${date.getFullYear()-1}`,`dec ,31, ${date.getFullYear()-1}`)/12).toFixed(2);
            const epdata = {
                totalCradit,
                totalDebit,
                lastmonthExpenseavg,
                todayExpense,
                yesterdatsExpense,
                last7Expense,
                last30Expense,
                yearly,
                lastyearExpenseavg
            }
            return epdata;
        } catch (error) {
            return error;
        }
    }
    return {
        pagenotfound:function(req,res){
            return res.redirect('/');
        },
        index:function(req,res){
            loginuser = req.userdata[0].email;
                expenseModel.find({"email":loginuser},async(err,data)=>{
                    if(err){
                        return res.render('home/index',{loginuser:loginuser});
                    }else{
                        const Exdata = await fetchdashboarddata();
                        return res.render('home/index',{loginuser:loginuser,expencedata:data,Exdata,title:"Dashboard"});
                    }
                }).sort({"createdAt":-1}).limit(5);
        },
        feedback:function(req,res){
            loginuser = req.userdata[0].email;
            return res.render('home/feedback',{loginuser,title:"Feedback"});
        },
        feedbackprocess:async function(req,res){
            console.log(req.body);
            try {
                const newform = new feedBackModel(req.body)
                const resp = await newform.save();
                if(resp){
                    res.status(200).json({status:true,resp:resp,message:"Thankyou for improving us!!"});
                }else{
                    res.status(400).json({status:false,message:"someting went wrong"});
                }
            } catch (error) {
                res.status(400).json({status:false,err:error,message:"someting went wrong try again"});   
            }
        }
    }
}

module.exports = indexcontroller;