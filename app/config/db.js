const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_KEY,{useNewUrlParser:true,useCreateIndex:true,useFindAndModify:false,useUnifiedTopology:true})
const conn = mongoose.connection;
conn.once('open',()=>{
    console.log("connection establish successfully")
}).catch((err)=>{
    console.log("connection error",err)
})
