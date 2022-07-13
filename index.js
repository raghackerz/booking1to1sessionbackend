require('dotenv').config({ path: './config.env' });

const express = require("express");
const dbo = require('./db/conn');


const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json())
app.use(require('./routes/index'));

dbo.connectToServer(function(err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
});
