const router = require('express').Router();
const expencemodel = require('../app/models/expence');
const companyModel = require('../app/models/company');
const multer = require('multer')
const { body, validationResult } = require('express-validator');
const { isuserlogin, whenuserlogin } = require('../app/middleware/isuserlogin')
const getuserdata = require('../app/middleware/getuserdata')
var parse = require('date-fns/parse')
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/docs');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname);
  }
});

const convertToIso = (mydate, time) => {
  const dd = parse(`${mydate} ${time}`, 'yyyy-MM-dd HH:mm:ss', new Date());
  return dd;
};


const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname);
    if (ext !== ".img" && ext !== ".jpg" && ext !== ".png" && ext !== ".docx" && ext !== ".doc" && ext !== ".pdf") {
      return callback(('Only img jpg and png doc docx pdf file are allowed'));
    }
    callback(null, true);
  },
}).single('doc');

router.get('/', (req, res) => {
  return res.json("uhu");
})

// add expense
router.post('/addexpense', [
  body('amount').not().isEmpty().isNumeric(),
  body('cradittype').not().isEmpty().trim().escape(),
  body('title').not().isEmpty().trim().escape(),
  body('desc').not().isEmpty().trim().escape(),
], isuserlogin, getuserdata, async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.status(400).json({ status: false, err: error, message: "validation error" });
  } else {
    try {
      let newExpence = new expencemodel({
        userid: req.userdata[0]._id,
        email: req.userdata[0].email,
        title: req.body.title,
        amount: req.body.amount,
        cradittype: req.body.cradittype,
        desc: req.body.desc
      });
      const response = await newExpence.save();
      if (response) {
        res.status(200).json({ status: true, resp: response, message: "expense inserted successfully!!" });
      } else {
        res.status(400).json({ status: false, err: error, message: "someting went wrong" });
      }
    } catch (error) {
      res.status(400).json({ status: false, err: error, message: "someting went wrong try letter" });
    }
  }
})

// add company
router.post('/addcompany', isuserlogin, getuserdata, (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ status: false, err: err, message: "someting went wrong while uploading image" });
      }

      let letter = undefined;

      const userid = req.userdata[0]._id;

      if (req.file) {
        letter = req.file.filename;
      }

      let { companyname, joindate, salery, remark, degination } = req.body;

      if (!companyname || !joindate || !salery) {
        return res.status(400).json({ status: false, message: "Company name joindate or salery required" });
      }

      let newdate = convertToIso(joindate, "01:00:00");

      const companyData = new companyModel({ userid, companyname, joindate: newdate, salery, letter, remark, degination });
      const resp = await companyData.save();
      return res.status(200).json({ status: true, message: "Company added", resp });
    })
  } catch (error) {
    return res.status(400).json({ status: false, err: error, message: "someting went wrong try letter" });
  }
})

// get company
router.get("/getcompanybiyd/:id", isuserlogin, getuserdata, async (req, res) => {
  try {
    let data = await companyModel.findById(req.params.id);
    return res.status(200).json({ status: true, message: "Company data", data });
  } catch (error) {
    return res.status(400).json({ status: false, err: error, message: "someting went wrong try letter" });
  }
})

// get company for salery
router.get("/getsalerybyid/:id",isuserlogin, getuserdata,async (req, res) => {
  try {
    let data = await companyModel.findById(req.params.id);
    return res.status(200).json({ status: true, message: "salery data", data });
  } catch (error) {
    return res.status(400).json({ status: false, err: error, message: "someting went wrong try letter" });
  }
})

// update form
router.put('/addcompany', isuserlogin, getuserdata, (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ status: false, err: err, message: "someting went wrong while uploading image" });
      }

      let letter = undefined;

      if (req.file) {
        letter = req.file.filename;
        req.body.letter = letter;
      }

      let { companyname, joindate, salery, remark, degination } = req.body;

      let id = req.body.id;

      if (!id || !companyname || !joindate || !salery) {
        return res.status(400).json({ status: false, message: "id Companyname joindate or salery required" });
      }

      let newdate = convertToIso(joindate, "01:00:00");
      req.body.joindate = newdate;

      const companyData = await companyModel.findByIdAndUpdate(id, { ...req.body, remark, degination });

      return res.status(200).json({ status: true, message: "Company updated", resp: companyData });
    })
  } catch (error) {
    return res.status(400).json({ status: false, err: error, message: "someting went wrong try letter" });
  }
})

router.post('/addsalery', isuserlogin, getuserdata, (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ status: false, err: err, message: "someting went wrong while uploading image" });
      }

      let slip = undefined;

      if (req.file) {
        slip = req.file.filename;
      }

      let { currentsalery, recivedamount, remark, deduction } = req.body;

      if (!recivedamount || !currentsalery) {
        return res.status(400).json({ status: false, message: "recivedamount and currentsalery are required" });
      }

      let newDate = {
        currentsalery,
        recivedamount,
        remark,
        slip,
        deduction
      };

      const companyData = await companyModel.findByIdAndUpdate(req.body.id, { '$push': { 'saleryData': newDate } }, { new: true });
      return res.status(200).json({ status: true, message: "Salery added", resp: companyData });
    })
  } catch (error) {
    return res.status(400).json({ status: false, err: error, message: "someting went wrong try letter" });

  }
})


router.delete('/addsalery', isuserlogin, getuserdata, async (req, res) => {
  try {
    const { id, sid } = req.body;
    const companyData = await companyModel.findByIdAndUpdate(id, {
      $pull: {
        saleryData: { _id: sid }
      }
    }, { new: true });
    return res.status(200).json({ status: true, message: "Salery remove", resp: companyData });
  } catch (error) {
    return res.status(400).json({ status: false, err: error, message: "someting went wrong try letter" });
  }
})


module.exports = router;