const expencemodel = require('../models/expence');
const companyModel = require('../models/company');

function indexcontroller() {
    //////////////////////////////////////////////////////////////// global variable
    let loginuser = null;
    //////////////////////////////////////////////////////////////// global end
    return {
        addcompany: function (req, res) {
            loginuser = req.userdata[0].email;
            return res.render('home/addcompany', { loginuser, title: "Add-Expense" });
        },
        viewcompany: async function (req, res) {
            loginuser = req.userdata[0].email;
            const companyData = await companyModel.find({ "userid": req.userdata[0]._id }).sort({ "createdAt": -1 });
            return res.render('home/viewCompany', { loginuser, title: "View-Company", companyData });
        },
        deleteCompany: async function (req,res) {
            loginuser = req.userdata[0].email;
            const id = req.params.id;
            try {
                await companyModel.findByIdAndDelete(id);
                return res.redirect('/viewcompany');
            } catch (error) {
                return res.redirect('/viewcompany');
            }
        }
    }
}


module.exports = indexcontroller;