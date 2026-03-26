import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import routes from "./routes/router.js";
import cookieParser from "cookie-parser";
import { checkUser } from "./middleware/auth.js";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

const port = process.env.PORT || 3000;

app.use(checkUser);
app.use("/", routes);

async function run() {
  try {
    console.log("Trying to connect to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("MongoDB running!");
    });
    app.listen(port, () => {
      console.log(`Server running: http://127.0.0.1:${port}`);
    });
  } catch (e) {
    console.log(e);
  }
}

run();
