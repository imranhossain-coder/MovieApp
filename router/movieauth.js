const express = require("express");
const router = express.Router();
const { Movies, Moviessubcat } = require("../models/movieSchema");
const fetch = require("node-fetch");
//------------------------------Adding Movies To the database Start---------------------//
router.post("/postmovies", async (req, res) => {
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
      const movies = new Movies({
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
      await movies.save();
      res.status(201).send(response.data);
      res;
    })
    .catch((err) => {
      res.status(404).send("data not found");
      console.log(err);
    });
});
// --------------------------Fetch All the Movies From the Database------------------------//
router.get("/getmovies", async (req, res) => {
  const movies = await Movies.find().sort({ _id: -1 });
  res.json(movies);
});
router.get("/getannouce", async (req, res) => {
  const movies = await Movies.find().limit(5);
  res.json(movies);
});
// ---------------------------Fetch Single Movie From the Databse------------------------//

router.get("/getmovie", async (req, res) => {
  const { id } = req.query;

  const Getmovie = await Movies.findOne({ _id: id });
  res.json(Getmovie);
});

////////////// Find Movies =========================
router.post("/findmovies", async (req, res) => {
  const { moviestags } = req.body;

  const data = await Movies.find({ moviestags: { $all: [moviestags] } });

  if (data.length == 0) {
    res.status(404).json({ Message: "Data Not Found" });
  } else {
    res.status(200).json(data);
  }
});

router.post("/addmoviescat", async (req, res) => {
  const { subcatname } = req.body;
  const moviescat = new Moviessubcat({ subcatname: subcatname });
  await moviescat.save();
  res.send(moviescat);
});

router.get("/getmoviescat", async (req, res) => {
  try {
    const movieSubcat = await Moviessubcat.find();
    res.send(movieSubcat);
  } catch (error) {
    res.send(error);
  }
});

router.post("/getgenresdata", async (req, res) => {
  const { genres } = req.body;
  const data = await Movies.find({ genres: { $all: [genres] } });

  if (data.length == 0) {
    res.status(404).json({ Message: "Data Not Found" });
  } else {
    res.status(200).send(data);
  }
});

module.exports = router;
