import "dotenv/config";
import express from "express";

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.listen(port, () => {
  console.log(`Server running: http://127.0.0.1:${port}`);
});
