const express = require("express");
const router = express.Router();
const { Dramas, Draamacat } = require("../models/dramaSchema");
const fetch = require("node-fetch");
//------------------------------Adding Movies To the database Start---------------------//
router.post("/postdramas", async (req, res) => {
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
      const dramas = new Dramas({
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
      await dramas.save();
      res.status(201).send(response.data);
    })
    .catch((err) => res.status(404).send("data not found"));
});
// --------------------------Fetch All the Movies From the Database------------------------//
router.get("/getdramas", async (req, res) => {
  const dramas = await Dramas.find().sort({ _id: -1 });
  res.json(dramas);
});
// ---------------------------Fetch Single Movie From the Databse------------------------//

router.get("/getdrama", async (req, res) => {
  const { id } = req.query;

  const GetDrama = await Dramas.findOne({ _id: id });
  res.json(GetDrama);
});

router.post("/finddramas", async (req, res) => {
  const { moviestags } = req.body;

  const data = await Dramas.find({ moviestags: { $all: [moviestags] } });

  if (data.length == 0) {
    res.status(404).json({ Message: "Data Not Found" });
  } else {
    res.status(200).json(data);
  }
});

router.post("/adddramascat", async (req, res) => {
  const { subcatname } = req.body;
  console.log(subcatname);
  const moviescat = new Draamacat({ subcatname: subcatname });
  await moviescat.save();
  res.send(moviescat);
});

router.get("/getdramascat", async (req, res) => {
  try {
    const movieSubcat = await Draamacat.find();
    res.send(movieSubcat);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
