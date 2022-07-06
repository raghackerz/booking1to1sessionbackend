const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json())

app.get("/searchmentor", (req, res) => {
  res.send({ message: "Searched for mentor" });
});
app.get("/signup", (req, res) => {
  res.send({ message: "signup" });
});
app.get("/getuserdetail", (req, res) => {
  res.send({ message: "getuserdetail" });
});
app.post("/postnotification", (req, res) => {
  res.send({ message: "Post notification" });
});
app.get("/getnotification", (req, res) => {
  res.send({ message: "get notification" });
});
app.get("/booksession", (req, res) => {
  res.send({ message: "booksession" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
