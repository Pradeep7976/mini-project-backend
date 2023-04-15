var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.use(bodyParser.json());
const regester = require("../models/user");
const user = require("../models/user");
const countermodel = require("../models/counter");
const reportproblem = require("../models/reportproblem");

router.post("/signup", async (req, res) => {
  try {
    console.log("received");
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const address = req.body.address;
    const password = req.body.password;
    const imageurl = req.body.imageurl;
    const passwordHash = await bcrypt.hash(password, 10);

    const User = await user.findOne({ phone });
    // res.send(User === null);
    if (User === null) {
      let uid;
      await countermodel.updateOne({ id: "autoval" }, { $inc: { seq: 1 } });
      await countermodel.find({ id: "autoval" }).then((result) => {
        const data = result[0].seq;
        uid = result[0].seq;
      });
      const dat = new user({
        name: name,
        uid: uid,
        phone: phone,
        email: email,
        address: address,
        password: passwordHash,
        imageurl: imageurl,
      });
      // res.send(dat);
      dat.save();
      const token = jwt.sign({ email }, "jwtsecret", { expiresIn: 800 });
      console.log(token);
      return res.json({ auth: true, token: token });
    } else {
      console.log("already present bro");
      res.send({ auth: false });
    }
  } catch (error) {
    console.log(error);
    res.send("err");
  }
});
router.get("/count", async (req, res) => {
  await countermodel.updateOne({ id: "autoval" }, { $set: { pid: 1 } });
  res.send("OK");
});
//////////////////////////////////////////////////       LOGIN          //////////////////////////////////////////////////////
router.post("/login", async (req, res) => {
  const phone1 = req.body.phone;
  const password = req.body.password;
  console.log(phone1);
  console.log(password);
  let uid = 1;
  const User = await user.findOne({ phone: phone1 });
  console.log(User);
  const Passwordcorrect =
    User === null ? false : await bcrypt.compare(password, User.password);
  if (!(User && Passwordcorrect)) {
    return res.status(401).json({
      error: "invalid phone or Password",
    });
  } else {
    const phone = User.phone;
    const token = jwt.sign({ phone }, "jwtsecret", { expiresIn: 800 });
    return res.json({ auth: true, token: token, uid: User.uid });
  }
});
//////////////////////////////////////////////           to check if authenticated        ////////////////////////////////////////////////
const verifyJwt = (req, res, next) => {
  const token = req.headers["x-access-token"];
  console.log("Came for verification");
  if (!token) {
    res.send("Sorry bro no token");
  } else {
    jwt.verify(token, Secret, (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "U fail to auth bro " });
        console.log("notauthorised");
      } else {
        console.log("authorsed");
        req.userId = decoded.id;
        next();
      }
    });
  }
};
router.get("/isUserAuth", verifyJwt, (req, res) => {
  res.json({ auth: true });
});
/////////////////////////         full Details          ////////////////////
router.post("/details", async (req, res) => {
  const uid = req.body.uid;
  const response = await user.findOne({ uid: uid });
  // res.json({ auth: uid });
  res.send(response);
});
router.post("/reported/count", async (req, res) => {
  const uid = req.body.uid;
  const response = await reportproblem.findOne({ uid: uid });
  // res.json({ auth: uid });
  if (response == null) res.send("0");
  else res.send(response.length);
});
module.exports = router;
