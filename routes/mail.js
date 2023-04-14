var express = require("express");
var router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const nodemailer = require("nodemailer");

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
const userschema = require("../models/user");
const flagcount = require("../models/flagcount");
const feedbackscheme = require("../models/feedback");

//
// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "miniproject7976@gmail.com",
    pass: "xtfxzjtgusyhxpea",
  },
});

router.post("/", async (req, res) => {
  const dati = {
    pid: req.body.pid,
    email: req.body.email,
  };
  async function getDataFromMongoDB() {
    try {
      const data = await reportprobschema.find({ pid: dati.pid });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  const data = await getDataFromMongoDB();
  console.log(data);
  const mailOptions = {
    from: "miniproject7976@gmail.com",
    to: dati.email,
    subject: "Issue Received",
    html:
      "<h4>Your complaint is successfully registered \n We will try our best to solve the problem as soon as possible Final</h4>" +
      data
        .map((item) => `<p>${item.formatdate.toString().slice(4, 15)}:</p>`)
        .join("") +
      `<img src=${data[0].imageurl} width="355rem"></img>` +
      `<P>Issue Submitted on ${data[0].formatdate
        .toString()
        .slice(4, 15)} </p>` +
      "<h4>Thanks for reporting </h4>",
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.send(error);
    } else {
      console.log(mailOptions.text);
      res.send("Email sent: " + info.response);
    }
  });
});

router.post("/high", async (req, res) => {
  async function getDataFromMongoDB() {
    try {
      const data = await reportprobschema.find({ status: false });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  const data = await getDataFromMongoDB();
  console.log(data);
  const mailOptions = {
    from: "miniproject7976@gmail.com",
    to: "gta5zx10r1@gmail.com",
    subject: "Issue Persisting for long time",
    html:
      "<h2>These are the issues persisting for long time</h2><ul> " +
      `<table style="border: 1px solid black;" >
    <thead>
      <tr>
        <th style="border: 1px solid black;">description</th>
        <th style="border: 1px solid black;">department</th>
        <th style="border: 1px solid black;">Location</th>
        <th style="border: 1px solid black;">Date</th>
      </tr>
    </thead>
    <tbody>
      ${data.map((item) => {
        return `
        <div>
        <tr>
        <td style="border: 1px solid black;">sdfsdf</td>
        <td  style="border: 1px solid black;" >sdfsdf</td>
        <td style="border: 1px solid black;" ><a href= https://www.google.com/maps/search/?api=1&query=${13.365126},${77.088169}>Location</a></a></td>
        <td  style="border: 1px solid black;">sdfsdf</td>
        </tr>
        </div>`;
      })}
    </tbody>
  </table>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.send(error);
    } else {
      console.log(mailOptions.text);
      res.send("Email sent: " + info.response);
    }
  });
});

/////////////////////////////          flag user         ////////////////
router.post("/flaguser", async (req, res) => {
  const pid = req.body.pid;

  const flagdata = await flagcount.findOne({ pid: pid });
  const dat = new flagcount({ pid: pid, flags: 1 });
  async function getflagfinal() {
    if (flagdata == null) {
      console.log("NULL");
      dat.save();
      return false;
    } else {
      await flagcount.updateOne({ pid: pid }, { $inc: { flags: 1 } });
      if (flagdata.flags >= 2) return true;
      else return false;
    }
  }
  const final = await getflagfinal();
  console.log(final);
  async function getUid() {
    try {
      console.log("sdfsdfsdfsdf");
      const data = await reportprobschema.findOne({ pid: pid });
      return data;
    } catch (error) {
      console.error();
    }
  }
  const data = await getUid();
  if (data == null) {
    console.log("user not found");
    res.send("user not found");
    return;
  }
  const uid = data.uid;
  const imgurl = data.imageurl;
  ////////////////////////////////                 flag deletion of user      //////////////////
  async function deleteaccount() {
    try {
      await feedbackscheme.deleteMany({ pid: pid });
      await flagcount.deleteMany({ pid: pid });
      await userschema.deleteMany({ uid: uid });
      await reportprobschema.deleteMany({ uid: uid });
    } catch (err) {
      console.log("Error deleting the data");
    }
  }
  //////////////////////////////////////
  async function getDataFromMongoDB() {
    try {
      const data = await userschema.findOne({ uid: uid });
      return data.email;
    } catch (error) {
      console.log(error);
    }
  }
  const email = await getDataFromMongoDB();
  console.log(email);
  if (final) {
    const ans = deleteaccount();
    console.log(ans);
  }
  const htmlbody1 =
    "<h2 style=`color:red;`  >You have been flaged for reporting a fake/wrong issue</h2>" +
    `<img src=${imgurl} width="355rem" />`;
  const htmlbody2 =
    "<h2 style=`color:red;`  >You have been flaged for reporting a fake/wrong your account has been deleted issue</h2>" +
    `<img src=${imgurl} width="355rem" />`;
  const mailOptions = {
    from: "miniproject7976@gmail.com",
    to: email,
    subject: "Caught for reporting fake/wrong issue",
    html: final ? htmlbody2 : htmlbody1,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.send(error);
    } else {
      console.log(mailOptions.html);
      res.send("Email sent: " + info.response);
    }
  });
});
module.exports = router;
