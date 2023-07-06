var express = require("express");
var router = express.Router();
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

router.get("/", (req, res) => {
  res.send("OK From feedback");
});
module.exports = router;
