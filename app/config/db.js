const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_CON_PROD, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
const conn = mongoose.connection;
conn
  .once("open", () => {
    console.log("connection establish successfully");
  })
  .catch((err) => {
    console.log("connection error", err);
  });
