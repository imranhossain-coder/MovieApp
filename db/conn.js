const mongoose = require("mongoose");
const DB =
  "mongodb+srv://tayyab:tayyab@cluster0.ymqw1ub.mongodb.net/movieapp?retryWrites=true&w=majority";

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to the database");
  })
  .catch((e) => {
    console.log("Not connect to the database");
  });
