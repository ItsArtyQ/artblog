import express from "express";
import authRouters from "./auth.js";

const router = express.Router();

router.use("/", authRouters);

router.get("/", (req, res) => {
  res.render("index");
});

export default router;
