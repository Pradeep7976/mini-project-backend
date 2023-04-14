var express = require("express");
var router = express.Router();

const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
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

//
router.post("/", async (req, res) => {
  let url;
  // axios
  //   .post("http://localhost:7000/api/uploadimg/", { file: req.file })
  //   .then((result) => {
  //     url = result.data.url;
  //     console.log(url);
  //     res.send("result");
  //   });
  let id;
  await countermodel.updateOne({ id: "autoval" }, { $inc: { pid: 1 } });
  await countermodel.find({ id: "autoval" }).then((result) => {
    const data = result[0].pid;
    id = result[0].pid;
  });
  const dat = new reportprobschema({
    uid: req.body.uid,
    locx: req.body.locx,
    description: req.body.description,
    locy: req.body.locy,
    imageurl: req.body.imageurl,
    department: req.body.department,
    pid: id,
    date: Date.now(),
    formatdate: new Date().toISOString().slice(0, 10),
    status: false,
  });
  dat.save();
  res.send(dat);
});
/////
router.get("/totalcount", async (req, res) => {
  await reportprobschema.find({}).then((result) => {
    res.send(result.length.toString());
  });
});

/////

router.get("/solvedcount", async (req, res) => {
  await reportprobschema.find({ status: true }).then((result) => {
    res.send(result.length.toString());
  });
});

//////
//to get full details of a problem
router.get("/reported/:uid", async (req, res) => {
  const pid = req.params.pid;
  reportprobschema.find({ pid: pid }).then((result) => {
    res.send(result);
  });
});

///////

router.get("/problems/:dept", async (req, res) => {
  reportprobschema.find({ department: req.params.dept }).then((result) => {
    res.send(result);
  });
});

module.exports = router;
