var express = require("express");
var router = express.Router();
//
const ImageKit = require("imagekit");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//
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

const imagekit = new ImageKit({
  publicKey: "public_54egNKOJriAp5xKY7+e6SMh+mGo=",
  privateKey: "private_E4UmIvFXD/XV2EIlSIrTwjIgRCA=",
  urlEndpoint: "https://imagekit.io/dashboard/media-library/L01pbmlfcHJvamVjdA",
});
//

const reportprobschema = require("../models/reportproblem");
const problem = require("../models/problem");
const solved = require("../models/solved");

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
  await problem.find().then((result) => {
    res.json({ ans: result.length });
  });
});

/////

router.get("/solvedcount", async (req, res) => {
  await problem.find({ status: true }).then((result) => {
    res.json({ ans: result.length });
  });
});

//////////////////////////////////////////             to get date elapsed of a problem

router.get("/reported/:pid", async (req, res) => {
  const pid = req.params.pid;
  console.log(pid);
  problem.findOne({ pid: pid }).then((result) => {
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
///////////////////////////////////////////////      count problems
router.get("/probcount/:uid", async (req, res) => {
  const uid = req.params.uid;
  console.log(uid);
  problem.find({ uid: uid }).then((result) => {
    res.json({ count: result.length });
  });
});
////////////////////////////////////////////////            to get full details of a problem
router.get("/details/:pid", async (req, res) => {
  problem.findOne({ pid: req.params.pid }).then((result) => {
    let response = result;
    const arr = [];

    const dat = {
      pid: response.pid,
      uid: response.uid,
      name: response.name,
      description: response.description,
      latitude: response.latitude,
      longitude: response.longitude,
      formatdate: response.formatdate,
      status: response.status,
      imageurl: response.imageurl,
      department: response.department,
    };
    console.log(response);
    res.send(dat);
  });
});
//////////////////////////////////////////////////////        problems of a department           ////////////////////////////////////////

router.get("/problems/:dept", async (req, res) => {
  console.log(req.params.dept + "sdfsf");
  problem
    .find({ department: req.params.dept, status: false })
    .then((result) => {
      if (result == null) {
        res.send(null);
        return;
      }
      const arr = [];
      result.map((response) => {
        const dat = {
          pid: response.pid,
          uid: response.uid,
          name: response.name,
          description: response.description,
          latitude: response.latitude,
          longitude: response.longitude,
          formatdate: response.formatdate,
          status: response.status,
          imageurl: response.imageurl,
          department: response.department,
        };
        arr.push(dat);
      });
      // console.log(arr);
      res.send(arr);
    });
});
///////////////////////////////////////////////////          new problem                     ////////////////////////////////////////////
router.post("/newproblem", async (req, res) => {
  let id;
  await countermodel.updateOne({ id: "autoval" }, { $inc: { pid: 1 } });
  await countermodel.find({ id: "autoval" }).then((result) => {
    const data = result[0].pid;
    id = result[0].pid;
  });
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

///////////////////////////             temp UPLOADER             //////////////////////////////
router.post("/temp", upload.single("file"), async (req, res) => {
  try {
    console.log("received");
    const file = req.file;
    const data = JSON.parse(req.body.data);
    console.log(data.name);
    console.log(data.department);
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });
    console.log(response.url);
    const imageurl = response.url;
    let id;
    await countermodel.updateOne({ id: "autoval" }, { $inc: { pid: 1 } });
    await countermodel.find({ id: "autoval" }).then((result) => {
      const data = result[0].pid;
      id = result[0].pid;
    });
    const dat = new newproblem({
      pid: id,
      uid: data.uid,
      name: data.name,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      formatdate: new Date(),
      imageurl: imageurl,
      status: false,
      department: data.department,
      location: {
        type: "Point",
        coordinates: [data.longitude, data.latitude],
      },
    });
    // dat.save();
    // axios.post("http://localhost:7000/api/mail/", {
    //   pid: id,
    //   uid: data.uid,
    // });
    console.log(dat);
    // res.json({ done: true });
    const results = await problem
      .find({
        location: {
          $near: {
            $geometry: {
              type: "point",
              coordinates: [data.longitude, data.latitude],
            },
            $maxDistance: 100,
          },
        },
      })
      .then((resu) => {
        if (resu.length == 0) {
          dat.save();
          axios.post("https://expensive-hem-elk.cyclic.app/api/mail/", {
            pid: id,
            uid: data.uid,
          });
          res.json({ done: true });
        } else {
          res.json({ done: false });
        }
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading file" });
  }
});
router.post("/map", async (req, res) => {
  const results = await problem
    .find({
      location: {
        $near: {
          $geometry: {
            type: "point",
            coordinates: [req.body.longitude, req.body.latitude],
          },
          $maxDistance: 100,
        },
      },
    })
    .then((resu) => {
      if (resu.length == 0) {
        res.json({ report: true });
      } else {
        res.json({ report: false });
      }
    });
});

//////////////////////////////////////////                        solver                         /////////////////////////////
router.post("/solvername", async (req, res) => {
  const dat = new solved({
    pid: req.body.pid,
    name: req.body.name,
  });
  await dat.save();
  res.send(req.body);
});
module.exports = router;
