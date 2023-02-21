const mongoose = require("mongoose");

const AnimesSchema = new mongoose.Schema({
  comment: {
    type: String,
    require: true,
  },
});

const AnimecatSchema = new mongoose.Schema({
  subcatname: {
    type: String,
    require: true,
  },
});

// Hasing THe Password

const Animes = mongoose.model("", AnimesSchema);

module.exports = { Animes, Animecat };
