const express = require("express");
const cors = require("cors");
var router = require("express").Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const app = express();
const dbConfig = require("./config/db.config.js");
const Password = require("./models/password.model");


app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(router)

let dev_db_url = 'mongodb://127.0.0.1:27017/ippopay';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(mongoDB, options);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function callback() {
  console.log("MongoDB connection success");
});


router.post("/storepasswords", async (req, res) => {
  try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const storePassword = new Password({password:hashedPassword});
      const user = await storePassword.save();
      res.status(200).json({ message: 'Password stored successful!' });
  }
  catch(e){
    res.status(500).json({ message: 'Failed to store password!' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});