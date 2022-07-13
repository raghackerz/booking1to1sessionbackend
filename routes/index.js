let express = require("express")
let router = express.Router();
const dbo = require('../db/conn');


router.get("/searchmentor", (req, res) => {
  /*
  * format of req
  * req : {
    *   searchTerm: 'string',
  * }
  */
  const dbConnect = dbo.getDb();
  const query = {
    name: req.body?.searchTerm,
  }

  dbConnect
    .collection("Mentors")
    .find(query)
    .toArray((err, result) => {
      if (err) {
        res.status(400).send("Error Fetching Mentors");
      }
      else {
        res.json(result);
      }
    })
});
router.get("/signup", (req, res) => {
  res.send({ message: "signup" });
});
router.get("/getuserdetail", (req, res) => {
  res.send({ message: "getuserdetail" });
});
router.post("/postnotification", (req, res) => {
  res.send({ message: "Post notification" });
});
router.get("/getnotification", (req, res) => {
  res.send({ message: "get notification" });
});
router.get("/booksession", (req, res) => {
  res.send({ message: "booksession" });
});

// Test ---------------------------------
// Example insertion
router.get("/insert", (req, res) => {
  const dbConnect = dbo.getDb();
  const insertData = {
    _id: 3,
    name: 'Raghvendra',
    group: 'tulips'
  }

  dbConnect
    .collection("Members")
    .insertOne(insertData, (err, result) => {
      if (err) {
        res.status(400).send("Error inserting members");
      }
      else {
        console.log(result);
        res.status(204).send();
      }
    })
})

// Example read
router.get("/read", (req, res) => {
  const dbConnect = dbo.getDb();
  dbConnect
    .collection("Members")
    .find({})
    .toArray((err, result) => {
      if (err) {
        res.status(400).send("Error fetching members");
      }
      else {
        res.json(result);
      }
    })
})
// Example read using conditions
router.get("/readcond", (req, res) => {
  const dbConnect = dbo.getDb();
  dbConnect
    .collection("Members")
    .find({
      $and: [{ name: 'Raghvendra' }]//, { orderFromSun: { $lt: 5 } }],
    })
    .toArray((err, result) => {
      if (err) {
        res.status(400).send("Error fetching members");
      }
      else {
        res.json(result);
      }
    })
})

// Example update
// https://www.mongodb.com/docs/manual/reference/operator/query/
router.get("/update", (_req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: 1 };
  const updates = {
    $set: {
      name: 'Raghvendra Kumar'
    }
  };
  dbConnect
    .collection("Members")
    .updateOne(query, updates, (err, _result) => {
      if (err) {
        res.status(400).send("error updating");
      }
      else {
        console.log("Updated")
      }
    })
})


// Example Deletion
router.get("/delete", (req, res) => {
  const dbConnect = dbo.getDb();
  const deleteQuery = { _id: 2 };
  dbConnect
    .collection("Members")
    .deleteOne(deleteQuery, (err, _result) => {
      if (err) {
        res.status(400).send('Error deleting');
      }
      else {
        console.log("document deleted");
      }
    });
});

module.exports = router;
