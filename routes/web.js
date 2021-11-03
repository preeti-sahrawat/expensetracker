const authcontroller = require('../app/controllers/auth');
const indexcontroller = require('../app/controllers/index')
const getuserdatamiddleware = require('../app/middleware/getuserdata')
const {isuserlogin,whenuserlogin} = require('../app/middleware/isuserlogin')
const expencecon = require('../app/controllers/expencecon')
const companyCon = require('../app/controllers/companyCon')
const getuserdata = require('../app/middleware/getuserdata');
const profilecon = require('../app/controllers/profilecon');


const initroute = (app) =>{
    app.get('/',whenuserlogin,authcontroller().loginget);
    app.get('/register',whenuserlogin,authcontroller().registerget);
    app.get('/forgotpass',authcontroller().forgotpass);
    app.post('/register',authcontroller().register)
    app.post('/login',authcontroller().login);
    app.get('/activeacc/:token',whenuserlogin,authcontroller().activeacc);
    app.post('/forgotpass',authcontroller().forgotpassprocess);
    app.get('/genratrenewpass/:token',whenuserlogin,authcontroller().genratrenewpass);
    app.post('/genratrenewpass',whenuserlogin,authcontroller().genratrenewpassprocess);
    

    app.get('/logout',isuserlogin,getuserdata,authcontroller().logout);

    app.get('/home',isuserlogin,getuserdata,indexcontroller().index);

    // expenses
    app.get('/addexpence',isuserlogin,getuserdata,expencecon().addexpence);
    app.get('/viewexpence',isuserlogin,getuserdata,expencecon().viewexpence);
    app.get('/viewexpence/:page',isuserlogin,getuserdata,expencecon().viewexpencebypage);
    app.get('/deleteexpense/:id',isuserlogin,getuserdata,expencecon().deleteexpense);

    // Company
    app.get('/addcompany',isuserlogin,getuserdata,companyCon().addcompany);
    app.get('/viewcompany',isuserlogin,getuserdata,companyCon().viewcompany);
    app.get('/deletecompany/:id',isuserlogin,getuserdata,companyCon().deleteCompany);

    /// profile
    app.get('/viewprofile',isuserlogin,getuserdata,profilecon().viewprofile);
    app.get('/changepass',isuserlogin,getuserdata,profilecon().changepass);

    app.put('/updatepass',isuserlogin,getuserdata,profilecon().updatepass);
    app.put('/changepass',isuserlogin,getuserdata,profilecon().changepasspost);

    ////// view report
    app.get('/viewreport',isuserlogin,getuserdata,expencecon().viewreport);
    app.post('/getreport',isuserlogin,getuserdata,expencecon().getreport);

    //// feedback
    app.get('/feedback',isuserlogin,getuserdata,indexcontroller().feedback);
    app.post('/feedback',isuserlogin,getuserdata,indexcontroller().feedbackprocess);
    

    app.get('*',indexcontroller().pagenotfound);
}

module.exports = initroute;