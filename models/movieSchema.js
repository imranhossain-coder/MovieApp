const mongoose = require("mongoose");

const MoviesSchema = new mongoose.Schema({
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
  moviestags: {
    type: Array,
  },
  countries: {
    type: Array,
  },
  languages: {
    type: Array,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
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
  genres: {
    type: Array,
  },
  videolink: {
    type: String,
  },
});
const MovieCategorySchema = new mongoose.Schema({
  subcatname: {
    type: String,
    require: true,
  },
});
const PaymentdetailsSchema = new mongoose.Schema({
  paymentname: {
    type: String,
  },
  accountholdername: {
    type: String,
  },
  accountnumber: {
    type: String,
  },

  paymentammount: {
    type: String,
  },
});

MoviesSchema.methods.addcomments = async function (
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

const AppdetaisSchema = new mongoose.Schema({}, { strict: false });

// Hasing THe Password

const Movies = mongoose.model("MOVIES", MoviesSchema);
const Moviessubcat = mongoose.model("MOVIESCAT", MovieCategorySchema);
const Paymentdetails = mongoose.model("PAYMENTDETAILS", PaymentdetailsSchema);
const Appdetails = mongoose.model("APPDETAILS", AppdetaisSchema);

module.exports = { Movies, Moviessubcat, Paymentdetails, Appdetails };
