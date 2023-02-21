const express = require("express");
const { Liveshows, LiveshowsCat } = require("../models/liveshowsScema");
const router = express.Router();

router.post("/uploadshows", async (req, res) => {
  const { showstitle, showslink } = req.body;
  const liveshows = new Liveshows({
    title: showstitle,
    videolink: showslink,
    image: "https://cdn.moble.com/w/2374/575269/file/Live%20Shows.png",
  });
  await liveshows.save();
  res.send(showstitle);
});

router.get("/getliveshows", async (req, res) => {
  const liveshows = await Liveshows.find().sort({ _id: -1 });
  res.json(liveshows);
});

router.get("/getliveshow", async (req, res) => {
  const { id } = req.query;
  const liveshow = await Liveshows.findOne({ _id: id });
  res.json(liveshow);
});
router.post("/getgenresdata", async (req, res) => {
  const { genres } = req.body;
  const data = await Liveshows.find({ genres: { $all: [genres] } });

  if (data.length == 0) {
    res.status(404).json({ Message: "Data Not Found" });
  } else {
    res.status(200).send(data);
  }
});
router.get("/getliveshowscat", async (req, res) => {
  try {
    const movieSubcat = await LiveshowsCat.find();
    res.send(movieSubcat);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
