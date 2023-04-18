var express = require("express");
var router = express.Router();
const multer = require("multer");
const ImageKit = require("imagekit");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();

const imagekit = new ImageKit({
  publicKey: "public_54egNKOJriAp5xKY7+e6SMh+mGo=",
  privateKey: "private_E4UmIvFXD/XV2EIlSIrTwjIgRCA=",
  urlEndpoint: "https://imagekit.io/dashboard/media-library/L01pbmlfcHJvamVjdA",
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    console.log("received upload");
    const file = req.file;
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });
    console.log(response.url);
    res.json({ url: response.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading file" });
  }
});
router.get("/tes", (req, res) => {
  res.json({ url: "OK PROCEED TO IMAGE " });
});
module.exports = router;
