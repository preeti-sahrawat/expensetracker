require('dotenv').config();
const express = require('express');
const expresslayout = require('express-ejs-layouts');
const db = require('./app/config/db')
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser')
const api = require('./routes/api');
const app = express();

app.use(cookieParser());
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(expresslayout);
app.set('views',path.join(__dirname,'/resourses/views'));
app.use(express.static('public'))
app.set('view engine','ejs');

app.use("/api",api);
require('./routes/web')(app);

PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`server listening at ${PORT}`);
})



