var express = require("express");
var router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const axios = require("axios");
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

//

const reportprobschema = require("../models/reportproblem");
const dept = require("../models/dept");
const problem = require("../models/problem");
const feedbackschema = require("../models/feedback");
//

router.get("/", async (req, res) => {
  res.send("HI");
});

//to get the issues for a particular dept
router.get("/probs/:dept", async (req, res) => {
  problem.find({ department: req.params.dept }).then((result) => {
    let response = result;
    const arr = [];
    response.map((ele) => {
      const dat = {
        pid: ele.pid,
        uid: ele.uid,
        name: ele.name,
        description: ele.description,
        latitude: ele.latitude,
        longitude: ele.longitude,
        formatdate: ele.formatdate,
        status: ele.status,
        department: ele.department,
      };
      arr.push(dat);
    });
    // console.log(arr);
    res.send(arr);
  });
});
// to set to solve
router.get("/solve/:pid", async (req, res) => {
  console.log("sdf");
  problem
    .updateOne({ pid: req.params.pid }, { $set: { status: true } })
    .then(() => {
      problem.find({ pid: req.params.pid }).then((result) => {
        res.send(result);
      });
    });
});
// to add dept
router.post("/adddept", async (req, res) => {
  const did = req.body.did;
  const name = req.body.name;
  const password = req.body.password;
  const passwordHash = await bcrypt.hash(password, 10);
  const dat = new dept({
    did: did,
    name: name,
    password: passwordHash,
  });
  // res.send(dat);
  dat.save();
  const token = jwt.sign({ did }, "jwtsecretdept", { expiresIn: 800 });
  console.log(token);
  return res.json({ auth: true, token: token });
});

//login dept
router.post("/login", async (req, res) => {
  const depart = req.body.depart;
  const password = req.body.password;
  console.log(depart);
  console.log(password);
  const User = await dept.findOne({ name: depart });
  console.log(User);
  const Passwordcorrect =
    User === null ? false : await bcrypt.compare(password, User.password);
  if (!(User && Passwordcorrect)) {
    return res.status(401).json({
      error: "invalid phone or Password",
    });
  } else {
    const did = User.did;
    const token = jwt.sign({ did }, "jwtsecretdept", { expiresIn: 800 });
    return res.json({ auth: true, token: token, did: User.did });
  }
});
// get dept name
router.post("/getdeptname", async (req, res) => {
  dept.findOne({ did: req.body.did }).then((result) => {
    if (result) {
      res.send(result.name);
    } else {
      console.log(result);
    }
  });
  res.send;
});

//is user Auth
const verifyJwt = (req, res, next) => {
  const token = req.headers["x-access-token"];
  console.log("Came for dept verification ");
  if (!token) {
    res.send("Sorry bro no token");
  } else {
    jwt.verify(token, "jwtsecretdept", (err, decoded) => {
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
///////////////////////                   feedback         ////////////////////////
router.post("/feedback", (req, res) => {
  const pid = req.body.pid;
  const desc = req.body.description;

  const dat = new feedbackschema({
    pid: pid,
    desc: desc,
  });
  dat.save();
  res.send(dat);
});
////////////////////////////////         flag              ////////////////////////////////
router.post("/flag", (req, res) => {
  try {
    const pid = req.body.pid;
    let uid;
    problem.find({ pid: pid }).then((result) => {
      uid = result[0].uid;
      console.log(uid);
      axios.post("http://localhost:7000/api/mail/flaguser", { pid: pid });
      res.json({ uid: uid });
    });
  } catch (error) {
    console.error();
  }
});
module.exports = router;
