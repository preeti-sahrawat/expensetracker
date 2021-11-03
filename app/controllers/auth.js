const user = require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const mailgun = require("mailgun-js");
const DOMAIN = 'sandboxfab81e602c2e4400a4d0b23694359da2.mailgun.org';
const mg = mailgun({ apiKey: process.env.MAIL_GUN_APIKEY, domain: DOMAIN });

const authcontroller = () => {

    return {
        loginget: function (req, res) {
            res.render('user/login', { status: null, message: null, loginuser: null, title: "Login" });
        },
        registerget: function (req, res) {
            res.render('user/register', { loginuser: null, title: "Register Here" });
        },
        forgotpass: function (req, res) {
            res.render('user/forgot', { loginuser: null, status: null, message: null, title: "Forgot Password" });
        },
        genratrenewpass: function (req, res) {
            res.render('user/genratenewpass', { loginuser: null, title: "Genrate Password" });
        },
        register: function (req, res, next) {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ status: false, message: "all field required" });
            }
            user.exists({ email }).then(async (d) => {
                if (d) {
                    return res.status(401).json({ status: false, message: "email allready exists" });
                } else {
                    User = new user(req.body);
                    const hashpass = await bcrypt.hash(password, 10);
                    User.password = hashpass;
                    const accactivetoken = jwt.sign({ name, email, password }, process.env.ACCOUNT_ACTIVE_KEY, { expiresIn: '20m' })
                    await User.save().then((udata) => {
                        const data = {
                            from: 'noreplay@here.com',
                            to: udata.email,
                            subject: 'Account verification link',
                            html: `<h3>Please click on link for active account</h3>
                                <p/>Your Account activation link is ${process.env.CLIENT_URL}$/activeacc/${accactivetoken}</p>`
                        };
                        //  mg.messages().send(data, function (error, body) {
                        //      if(error){
                        //         return res.status(400).json({status:false,message:"Something went wrong while sending email",error});
                        //      }
                        // });
                        // console.log(accactivetoken);
                        return res.status(200).json({ status: true, message: "Registration successfully!! email has been send kindly activate your account", error: null, data: udata });
                    }).catch((err) => {
                        return res.status(400).json({ status: false, message: "Something went wrong", error: err });
                    })
                }
            })
        },
        activeacc: function (req, res) {
            const token = req.params.token;
            try {
                jwt.verify(token, process.env.ACCOUNT_ACTIVE_KEY, async (err, data) => {
                    if (err) {
                        res.render('home/thnks', { status: false, message: "invalid token or expire", loginuser: null, title: "Great!!" });
                    }
                    const { name, email } = data;
                    const udata = await user.findOne({ email, name });
                    if (udata) {
                        if (udata.isaccount_active) {
                            res.render('home/thnks', { message: "Opps!! account allready activated", loginuser: null, title: "Great!!" });
                        } else {
                            const updateddata = await user.findByIdAndUpdate(udata._id, { isaccount_active: true });
                            if (updateddata) {
                                res.render('home/thnks', { message: "your account is activated enjoy!!", loginuser: null, title: "Great!!" });
                            } else {
                                res.render('home/thnks', { message: "something went wrong while activating", loginuser: null, title: "Great!!" });
                            }
                        }
                    } else {
                        res.render('home/thnks', { message: "no user found try with diffrent", loginuser: null, title: "Great!!" });
                    }
                })
            } catch (error) {
                res.render('home/thnks', { message: "something went wrong", loginuser: null, title: "Great!!" });
            }
        },
        login: async function (req, res) {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.redirect('/')
            }
            let data = await user.findOne({ email });
            if (data) {
                if (data.isaccount_active) {
                    bcrypt.compare(password, data.password, (err, valid) => {
                        if (err) {
                            res.render('user/login', { status: false, message: "something went wrong", loginuser: null, title: "Login" });
                        }
                        if (valid) {
                            ////// login code
                            const payload = {
                                user_id: {
                                    id: data._id
                                }
                            }
                            jwt.sign(payload, process.env.SECRET, (err, token) => {
                                if (err) {
                                    res.render('user/login', { status: false, message: "something went wrong try again", loginuser: null, title: "Login" });
                                }
                                else {
                                    if (token) {
                                        // localStorage.setItem('userToken',token);
                                        // localStorage.setItem('loginuserEmail',data.email);
                                        res.cookie("jwt", token);
                                        return res.redirect('/home');
                                    }
                                }
                            });

                        } else {
                            res.render('user/login', { status: false, message: "incorrect password", loginuser: null, title: "Login" });
                        }
                    })
                } else {
                    res.render('user/login', { status: false, message: "Account is not active yet", loginuser: null, title: "Login" });
                }
            } else {
                res.render('user/login', { status: false, message: "incorrect user", loginuser: null, title: "Login" });
            }
        },
        forgotpassprocess: async function (req, res) {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ status: false, message: "all field required" });
            } else {
                try {
                    const userdata = await user.findOne({ email }).select("-password");;
                    if (userdata) {
                        const { _id, email } = userdata;
                        jwt.sign({ _id, email }, process.env.SECRET_FORGOT_PASS, async (err, token) => {
                            if (err) {
                                return res.status(400).json({ status: false, message: "Something went wrong while token genration" });
                            }
                            if (token) {
                                const emaildata = {
                                    from: 'noreplay@here.com',
                                    to: email,
                                    subject: 'Forgot password lionk',
                                    html: `<h3>Please click on link for change account password</h3>
                                        <p/>Your genratepassword link is ${process.env.CLIENT_URL}$/genratrenewpass/${token}</p>`
                                };
                                const updatetokendata = await user.updateOne({ resetLink: token });
                                if (updatetokendata) {
                                    return res.status(200).json({ status: true, message: "Check email for further instruction", token });
                                } else {
                                    return res.status(400).json({ status: false, message: "something went wrong while token updating..." });
                                }
                            }
                        });
                    } else {
                        return res.status(400).json({ status: false, message: "incorrect email" });
                    }
                } catch (error) {
                    return res.status(400).json({ status: false, message: "Something went wrong", error: err });
                }
            }
        },
        genratrenewpassprocess: function (req, res) {
            const { resetLink, newpass, confpass } = req.body;
            if (!newpass || !confpass) {
                return res.status(400).json({ status: false, message: "all field required" });
            }
            if (newpass != confpass) {
                return res.status(400).json({ status: false, message: "both passowrd not match" });
            }
            jwt.verify(resetLink, process.env.SECRET_FORGOT_PASS, async (err, data) => {
                if (err) {
                    return res.status(400).json({ status: false, message: "invalid token or expire please don't use this token" });
                } else {
                    const userdata = await user.findOne({ resetLink });
                    if (!userdata) {
                        return res.status(200).json({ status: false, message: "User with this link is not exists" });
                    } else {
                        const hashnewpass = await bcrypt.hash(newpass, 10);
                        userdata.updateOne({ password: hashnewpass, resetLink: '' }, (err, result) => {
                            if (err) {
                                return res.status(400).json({ status: false, message: "something went wrong while updating password..." });
                            } else {
                                return res.status(200).json({ status: true, message: "Yupss!! password changed successfully!! :)" });
                            }
                        })
                    }
                }
            })
        },
        logout: function (req, res) {
            try {
                res.clearCookie("jwt");
                res.redirect('/');
            } catch (error) {
                res.redirect('/');
            }
        }
    }
}
module.exports = authcontroller;
