const mongoose = require("mongoose");

const LiveshowsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  videolink: {
    type: String,
  },
  moviestags: {
    type: Array,
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
});
const liveshowCategory = new mongoose.Schema({
  subcatname: {
    type: String,
    require: true,
  },
});

LiveshowsSchema.methods.addcomments = async function (
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
// Hasing THe Password

const Liveshows = mongoose.model("LIVESHOWS", LiveshowsSchema);
const LiveshowsCat = mongoose.model("LIVESHOWSCAT", liveshowCategory);

module.exports = { Liveshows, LiveshowsCat };
