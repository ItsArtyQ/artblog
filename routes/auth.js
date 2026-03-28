import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/complete-account", requireAuth, (req, res) => {
  res.render("complete-account");
});

router.post("/complete-account", async (req, res) => {
  const { firstName, lastName } = req.body;

  const normalizedFirstName =
    firstName[0].toUpperCase() + firstName.slice(1).toLowerCase();
  const normalizedLastName =
    lastName[0].toUpperCase() + lastName.slice(1).toLowerCase();

  try {
    const token = req.cookies?.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);

    user.firstName = normalizedFirstName;
    user.lastName = normalizedLastName;

    await user.save();

    const newToken = jwt.sign(
      {
        id: user._id,
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("/");
  } catch (e) {
    console.error(e);
  }
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const normalizedUsername = username.toLowerCase();

    const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser) {
      return res.send("User already exists");
    }

    if (password.length < 8) {
      return res.send("Password must be at least 8 characters long");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: normalizedUsername,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

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

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send("Ivalid username or password");
    }

    const token = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

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
