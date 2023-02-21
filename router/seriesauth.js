const express = require("express");
const router = express.Router();
const { Series, Seriescat } = require("../models/seriesSchema");
const { createTransport } = require("nodemailer");
const fetch = require("node-fetch");

// ----------------------Adding One Anime to The database start----------------------------//
router.post("/postseries", async (req, res) => {
  const { id } = req.query;
  const { videolink, moviestags } = req.body;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "947107707fmshb36e64e6a214b35p1ac137jsncfdb675b120e",
      "X-RapidAPI-Host": "imdb8.p.rapidapi.com",
    },
  };

  fetch(`https://imdb8.p.rapidapi.com/auto-complete?q=${id}`, options)
    .then(async (res1) => {
      const response = await res1.json();
      const series = new Series({
        title: response.d[0].l,
        rating: response.d[0].rating,
        release_year: response.d[0].y,
        imdb_type: response.d[0].qid,
        runtime: response.d[0].runtime,
        genres: response.d[0].genres,
        countries: response.d[0].countries,
        languages: response.d[0].languages,
        image: response.d[0].i.imageUrl,
        videolink: videolink,
        moviestags,
      });
      await series.save();
      res.status(201).json(response);
    })
    .catch((err) => res.status(404).send("data not found"));
});

// --------------------------Fetch All the Animes From the Database------------------------//
router.get("/getseries", async (req, res) => {
  const series = await Series.find().sort({ _id: -1 });
  res.json(series);
});

// ---------------------------Fetch Single Anime From the Databse------------------------//

router.get("/getserie", async (req, res) => {
  const { id } = req.query;

  const getSerie = await Series.findOne({ _id: id });
  res.json(getSerie);
});

router.post("/findseries", async (req, res) => {
  const { moviestags } = req.body;

  const data = await Series.find({ moviestags: { $all: [moviestags] } });

  if (data.length == 0) {
    res.status(404).json({ Message: "Data Not Found" });
  } else {
    res.status(200).json(data);
  }
});

router.post("/addseriescat", async (req, res) => {
  const { subcatname } = req.body;
  console.log(subcatname);
  const moviescat = new Seriescat({ subcatname: subcatname });
  await moviescat.save();
  res.send(moviescat);
});

router.get("/getseriescat", async (req, res) => {
  try {
    const movieSubcat = await Seriescat.find();
    res.send(movieSubcat);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
