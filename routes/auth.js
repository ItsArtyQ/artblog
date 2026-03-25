import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const normalizedUsername = username.toLowerCase();

    const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser) {
      return res.send("User exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: normalizedUsername,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.send("Server error");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const normalizedUsername = username.toLowerCase();

  try {
    const user = await User.findOne({ username: normalizedUsername });

    if (!user) {
      return res.send("Ivalid username or password");
    }

    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send("Ivalid username or password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.send("Server error");
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

export default router;
