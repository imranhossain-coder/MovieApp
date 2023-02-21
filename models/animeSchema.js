const mongoose = require("mongoose");

const AnimesSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
  },
  rating: {
    type: String,
  },
  release_year: {
    type: String,
  },
  imdb_type: {
    type: String,
  },
  runtime: {
    type: String,
  },
  countries: {
    type: Array,
  },
  languages: {
    type: Array,
  },
  comments: [
    {
      username: {
        type: String,
      },
      profile_picture: {
        type: String,
      },
      comment: {
        type: String,
      },
    },
  ],
  episodes: [
    {
      episodetitle: {
        type: String,
      },
      episodelink: {
        type: String,
      },
    },
  ],
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  genres: {
    type: Array,
  },
  videolink: {
    type: String,
  },
  moviestags: {
    type: Array,
  },
});

const AnimecatSchema = new mongoose.Schema({
  subcatname: {
    type: String,
    require: true,
  },
});

AnimesSchema.methods.addcomments = async function (
  username,
  profile_picture,
  comment
) {
  try {
    this.comments = this.comments.concat({
      username,
      profile_picture,
      comment,
    });
    await this.save();
    return this.comments;
  } catch (error) {
    console.log(error);
  }
};
AnimesSchema.methods.addepisodes = async function (episodetitle, episodelink) {
  try {
    this.episodes = this.episodes.concat({
      episodetitle,
      episodelink,
    });
    await this.save();
    return this.episodes;
  } catch (error) {
    console.log(error);
  }
};

// Hasing THe Password

const Animes = mongoose.model("ANIMES", AnimesSchema);
const Animecat = mongoose.model("ANIMESCAT", AnimecatSchema);

module.exports = { Animes, Animecat };
