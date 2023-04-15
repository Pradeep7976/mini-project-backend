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
const newproblem = require("../models/problem");

//

const reportprobschema = require("../models/reportproblem");
const problem = require("../models/problem");

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
  await reportprobschema.find({ status: false }).then((result) => {
    res.send(result.length.toString());
  });
});

/////

router.get("/solvedcount", async (req, res) => {
  await reportprobschema.find({ status: true }).then((result) => {
    res.send(result.length.toString());
  });
});

//////////////////////////////////////////             to get full details of a problem

router.get("/reported/:pid", async (req, res) => {
  const pid = req.params.pid;
  reportprobschema.findOne({ pid: pid }).then((result) => {
    if (result == null) {
      res.send(null);
      return;
    }
    const targetDate = new Date(result.formatdate);
    const currentDate = new Date();
    const timeDiff = Math.abs(currentDate.getTime() - targetDate.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    console.log("Diffrence days " + daysDiff);
    let data = result;
    data = data.time = daysDiff;
    res.send({ data: result, timeelapsed: daysDiff });
  });
});

//////////////////////////////////////////////////////        problems of a department           ////////////////////////////////////////

router.get("/problems/:dept", async (req, res) => {
  reportprobschema.find({ department: req.params.dept }).then((result) => {
    if (result == null) {
      res.send(null);
      return;
    }
    res.send(result);
  });
});
///////////////////////////////////////////////////          new problem                     ////////////////////////////////////////////
router.post("/newproblem", async (req, res) => {
  // Check if the new data location is within 10 m
  // If not, store the data in the database
  // Otherwise, do not store the data and send a response with an error message
  // You can use a geospatial query to check the distance between the new data location and the existing data locations

  let id;
  await countermodel.updateOne({ id: "autoval" }, { $inc: { pid: 1 } });
  await countermodel.find({ id: "autoval" }).then((result) => {
    const data = result[0].pid;
    id = result[0].pid;
  });
  // const collection = req.app.locals.collection;
  // const { latitude, longitude, uid, description, imageurl, department } =
  //   req.body;
  // const pid = id;
  // formatdate = Date.now;
  // const query = {
  //   location: {
  //     $near: {
  //       $geometry: {
  //         type: "Point",
  //         coordinates: [longitude, latitude],
  //       },
  //       $maxDistance: 10,
  //     },
  //   },
  // };
  // newproblem.findOne({}).then((result) => {
  //   if (result != null) {
  //     res.status(400).json({ message: "Location already exists" });
  //     return;
  //   }
  //   const dat = new newproblem({
  //     pid: pid,
  //     uid: uid,
  //     description: description,
  //     latitude: latitude,
  //     longitude: longitude,
  //     formatdate: formatdate,
  //     imageurl: imageurl,
  //     department: department,
  //     location: { type: "Point", coordinates: [longitude, latitude] },
  //   });
  //   dat.save();
  // });
  console.log("IN");
  const dat = new newproblem({
    pid: id,
    uid: req.body.uid,
    description: req.body.description,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    formatdate: new Date(),
    imageurl: req.body.imageurl,
    department: req.body.department,
    location: {
      type: "Point",
      coordinates: [req.body.longitude, req.body.latitude],
    },
  });
  // dat.save();
  const results = await problem
    .find({
      location: {
        $near: {
          $geometry: {
            type: "point",
            coordinates: [req.body.longitude, req.body.latitude],
          },
          $maxDistance: 3000,
        },
      },
    })
    .then((result) => {
      if (result.length == 0) res.send("U DID IT");
      res.send(result);
    });
});
module.exports = router;
