const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// register

router.post("/", async (req, res) => {
  try {
    const { name, email, password, passwordVerify } = req.body;

    // validation

    if (!email || !password || !passwordVerify)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    if (password.length < 6)
      return res.status(400).json({
        errorMessage: "Please enter a password of at least 6 characters.",
      });

    if (password !== passwordVerify)
      return res.status(400).json({
        errorMessage: "Please enter the same password twice.",
      });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        errorMessage: "An account with this email already exists.",
      });

    // hash the password

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // save a new user account to the db

    const newUser = new User({
      name,
      email,
      passwordHash,
    });

    const savedUser = await newUser.save();

    // sign the token 

    const token = jwt.sign(
      {
        user: savedUser._id,
      },
      process.env.JWT_SECRET
    );

    // send the token in a HTTP-only cookie

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});


// log in

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate

    if (!email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(401).json({ errorMessage: "Wrong email or password." });

    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );
    if (!passwordCorrect)
      return res.status(401).json({ errorMessage: "Wrong email or password." });

    // sign the token

    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWT_SECRET
    );

    // send the token in a HTTP-only cookie

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "none",
    })
    .json({loggedIn: false});
});

router.get("/loggedIn", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json({ loggedIn: false });

    const decodedToken = jwt.decode(token, {complete: true});
    const existingUser = await User.findOne({ _id: decodedToken.payload.user });

    jwt.verify(token, process.env.JWT_SECRET);

    // res.send(true);
    res.json({ loggedIn: true, name: existingUser.name, _id: existingUser._id })
  } catch (err) {
    res.json({ loggedIn: false });
  }
});

// Update user details

router.put("/user/:id", auth, async (req, res) => {
  try {
    const { name, email, _id } = req.body;

    // Get user
    const existingUser = await User.findOne({ _id });

    // Change user details
    existingUser.name = name;
    existingUser.email = email;

    // update
    await existingUser.save();

    // send response
    res.json({name, email});

  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// view user 

router.get("/user/:id", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });

    const decodedToken = jwt.decode(token, {complete: true});
    
    if(req.params.id === decodedToken.payload.user){
      const existingUser = await User.findOne({ _id: decodedToken.payload.user });
      res.json({ _id: existingUser._id, name: existingUser.name, email: existingUser.email });
    } else {
      res.status(401).json({ errorMessage: "Unauthorized" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
})

module.exports = router;
