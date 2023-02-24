const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const { Movies, Paymentdetails, Appdetails } = require("../models/movieSchema");
const { Animes } = require("../models/animeSchema");
const { Dramas } = require("../models/dramaSchema");
const { Series } = require("../models/seriesSchema");
const { createTransport } = require("nodemailer");
const { Liveshows } = require("../models/liveshowsScema");
const bcrypt = require("bcryptjs");

// -----------------------------User Registration-------------------------------//
router.post("/register", async (req, res) => {
  const { username, email, profile_picture, phone, pass } = req.body;
  try {
    const CheckEmail = await User.findOne({ email });

    if (CheckEmail) {
      return res.status(422).send("Email Is Already Exits");
    } else {
      const logintoken = await bcrypt.hash(pass, 10);
      const users = new User({
        username,
        email,
        profile_picture,
        phone,
        pass,
        logintoken,
      });
      await users.save();
      res.status(201).json(users);
    }
  } catch (error) {
    res.status(422).send(error);
  }
});

//-----------------------------User Login-----------------------------//
router.post("/login", async (req, res) => {
  try {
    const { email_phone, pass } = req.body;
    const logintoken = await bcrypt.hash(pass, 10);
    const FindUser = await User.findOne({ pass });
    if (FindUser.logintoken === undefined) {
      const matchemail = FindUser.email == email_phone;
      const matchphone = FindUser.phone == email_phone;
      if (matchemail == true || matchphone == true) {
        await User.updateOne({ pass }, { $set: { logintoken: logintoken } });
        res.status(201).json(FindUser);
      } else {
        res.status(422).send("Invalid credentials");
      }
    } else {
      res.status(404).send("User Already Login in Another Device");
    }
  } catch (error) {
    res.status(422).send("Invalid credentials");
  }
});

router.post("/logout", async (req, res) => {
  const { email } = req.body;
  try {
    await User.updateOne({ email }, { $unset: { logintoken: 1 } });

    res.status(201).send("User Logout Successfully");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.get("/users", async (req, res) => {
  const getusers = await User.find();
  const length = getusers.length;
  res.status(201).send(`${length}`);
});

router.post("/updateuser", async (req, res) => {
  const { name, profile_picture, phone, finduser } = req.body;
  try {
    const updateUser = await User.findOneAndUpdate(
      { email: finduser },
      { $set: { username: name, profile_picture, phone } },
      { new: true }
    );
    res.status(201).json(updateUser);
  } catch (error) {
    res.status(404).send("Internal Server Error");
  }
});

router.post("/pay", async (req, res) => {
  const { username, email, proofImage, phone } = req.body;
  try {
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: "tajshmy@gmail.com",
        pass: "lpahacqxowumnika",
      },
    });
    const mailOptions = {
      from: `${email}`,
      to: "tajshmy@gmail.com",
      subject: `${email} Has Been Send Subscription Request For Tajsmy App`,
      html: `<h1 style="color:green; font-weight:bold;">Get Payment Request From Tajsmi App. Check the details and actived User </h1></br>
        <p> User Payment Details</p>
        <p>1. ${username}</p>
        <p>2. ${email}</p> copy this and Activate the user.
        <p>3. ${proofImage}</p>
        <p>4. ${phone}</p>
        `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(404).send(error);
      } else {
        console.log("Email sent: " + info.response);
        res.status(201).json({ message: "Send Sucessfully" });
      }
    });
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});
router.post("/getpaymentdetails", async (req, res) => {
  const { paymentname } = req.body;
  const getdetails = await Paymentdetails.findOne({ paymentname });
  res.send(getdetails);
});

router.post("/changepass", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const changepass = await User.findOneAndUpdate(
      { email },
      { $set: { pass } },
      { new: true }
    );
    res.status(201).send(changepass);
    console.log(changepass);
  } catch (error) {
    res.status(404).send("Internal Error");
  }
});

router.post("/emailverify", async (req, res) => {
  const { verifycode, email } = req.body;
  try {
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: "tajshmy@gmail.com",
        pass: "lpahacqxowumnika",
      },
    });
    const mailOptions = {
      from: "tajshmy@gmail.com",
      to: `${email}`,
      subject: `Verification Code For Tajshmy app`,
      html: `<h1 style="color:green; font-weight:bold;">Verificaton Code For tajshmy app Below</h1></br>
      <p>Your Verification Codei is</p>
      <p>${verifycode}</p>
      `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(404).send(error);
      } else {
        console.log("Email sent: " + info.response);
        res.status(201).json({ message: "Send Sucessfully" });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/getuserdata", async (req, res) => {
  const { email } = req.body;
  const getdata = await User.findOne({ email });
  if (getdata == null) {
    res.status(404).send("User Not Found!");
  } else {
    res.status(201).send(getdata);
  }
});
router.post("/addcomments", async (req, res) => {
  try {
    const { id, username, profile_picture, comment } = req.body;
    if (!id || !username || !profile_picture || !comment) {
      console.log("error in form data");
      return res.json({ error: "plz filled the data" });
    }
    const userMovies = await Movies.findOne({ _id: id });
    const userAnime = await Animes.findOne({ _id: id });
    const userSeries = await Series.findOne({ _id: id });
    const userDrama = await Dramas.findOne({ _id: id });
    const userLiveshow = await Liveshows.findOne({ _id: id });
    if (userMovies) {
      const usercomment = await userMovies.addcomments(
        username,
        profile_picture,
        comment
      );
      await usercomment.save();
      res.status(201).json({ message: "Comment Added Successfully" });
    } else if (userAnime) {
      const usercomment = await userAnime.addcomments(
        username,
        profile_picture,
        comment
      );
      await usercomment.save();
      res.status(201).json({ message: "Comment Added Successfully" });
    } else if (userSeries) {
      const usercomment = await userSeries.addcomments(
        username,
        profile_picture,
        comment
      );
      await usercomment.save();
      res.status(201).json({ message: "Comment Added Successfully" });
    } else if (userDrama) {
      const usercomment = await userDrama.addcomments(
        username,
        profile_picture,
        comment
      );
      await usercomment.save();
      res.status(201).json({ message: "Comment Added Successfully" });
    } else if (userLiveshow) {
      const usercomment = await userLiveshow.addcomments(
        username,
        profile_picture,
        comment
      );
      await usercomment.save();
      res.status(201).json({ message: "Comment Added Successfully" });
    } else {
      res.status(400).send("Comment Not Added");
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.post("/addepisodes", async (req, res) => {
  const { title, episodetitle, episodelink } = req.body;

  if (!title || !episodetitle || !episodelink) {
    console.log("error in form data");
    return res.json({ error: "plz filled the data" });
  }
  const userAnime = await Animes.findOne({
    moviestags: { $all: [title] },
  });

  const userSeries = await Series.findOne({
    moviestags: { $all: [title] },
  });
  const userDrama = await Dramas.findOne({
    moviestags: { $all: [title] },
  });

  if (userAnime) {
    await userAnime.addepisodes(episodetitle, episodelink);

    res.status(201).json({ message: "Episode Added Successfully" });
  } else if (userSeries) {
    await userSeries.addepisodes(episodetitle, episodelink);

    res.status(201).json({ message: "Episode Added Successfully" });
  } else if (userDrama) {
    await userDrama.addepisodes(episodetitle, episodelink);

    res.status(201).json({ message: "Episode Added Successfully" });
  } else {
    res.status(400).send("Episode Not Added");
  }
});

router.post("/activesubscription", async (req, res) => {
  const { email } = req.body;
  const updateSubscription = await User.updateOne(
    { email },
    { $set: { subscription: new Date().getDate() - 1 } }
  );

  if (updateSubscription == null) {
    res.status(404).send("User Not find");
  } else {
    res.status(201).send({ message: "user Activated Successfully" });
  }
});
router.post("/removesubscription", async (req, res) => {
  const { email } = req.body;
  await User.updateOne({ email }, { $unset: { subscription: 1 } });
  res.status(201).send("remove");
});

router.post("/movierequest", async (req, res) => {
  const { movierequest, useremail } = req.body;
  if (!movierequest) {
    return res.status(404).json({ error: "plzz filled the contact from" });
  } else {
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: "tajshmy@gmail.com",
        pass: "lpahacqxowumnika",
      },
    });
    const mailOptions = {
      from: `${useremail}`,
      to: "tajshmy@gmail.com",
      subject: `${useremail} User Request Movie From Tajshmy App`,
      html: `<h1 style="color:green; font-weight:bold;">Movie Request From Tajsmi App </h1></br>
        <p> User Request For this Movie ${movierequest}</p>
        `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(404).send(error);
      } else {
        console.log("Email sent: " + info.response);
        res.status(201).json({ message: "Send Sucessfully" });
      }
    });
  }
});

router.get("/testimran", async (req, res) => {
  res.send("New Backend ");
});

router.get("/appdetails", async (req, res) => {
  const appData = await Appdetails.findOne();
  res.send(appData);
});

module.exports = router;
