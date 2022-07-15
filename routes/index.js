const express = require("express")
let router = express.Router();
const jwt = require('jsonwebtoken')
const dbo = require('../db/conn');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  const token = authHeader && authHeader.split(' ')[1]
  console.log(token);
  if (token == null) return res.status(400).send({ message: "Token is empty" })

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, email) => {
    if (err) return res.status(400).send({ message: "Invalid Token" })
    req.email = email
    next()
  })
}

router.post("/searchmentor", authenticateToken, (req, res) => {
  /*
  * format of req
  * req : {
    *   searchTerm: 'string',
  * }
  */
  console.log(req);
  const dbConnect = dbo.getDb();
  const query = {
    name: { $in: [new RegExp(`.*${req.body.searchTerm}.*`),] }
  }

  console.log(query);

  dbConnect
    //.collection("Members")
    .collection("Mentors")
    .find(query)
    .toArray((err, result) => {
      if (err) {
        res.status(400).send({ message: "Error Fetching Mentors" });
      }
      else {
        res.json(result);
      }
    })
});

router.post("/signin", (req, res) => {
  //If email or password is not present in the call
  if (!req.body.email || !req.body.password) return res.status(400).send({ message: "Email or Password is empty" })

  //Searching for email and verify that password is correct
  const dbConnect = dbo.getDb();
  const query = {
    email: req.body?.email
  }

  dbConnect
    .collection("Authentication")
    .find(query)
    .toArray((err, result) => {
      if (err) {
        return res.status(400).send({ message: "Email is not registered" })
      }
      else {
        if (result.length === 0) {
          return res.status(400).send({ message: "Email is not registered" })
        }
        else if (result[0].password !== req.body.password)
          return res.status(400).send({ message: "Password is Incorrect" })
        else {
          //User Authentication succesful
          const accessToken = jwt.sign(query, process.env.ACCESS_TOKEN_SECRET)
          return res.json({ accessToken: accessToken });
        }
      }
    })


});

//sign up
router.post("/signup", (req, res) => {
  console.log(req)
  if (!req.body.email || !req.body.password) return res.status(400).send({ message: "Email or Password is not Provided" })

  const dbConnect = dbo.getDb();
  const insertData = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
  }

  dbConnect
    .collection("Authentication")
    .insertOne(insertData, (err, _result) => {
      if (err) {
        return res.status(400).send({ message: "Some Error Occured" });
      }
      else {
        const accessToken = jwt.sign({
          email: req.body.email
        }, process.env.ACCESS_TOKEN_SECRET)
        return res.status(204).send({ message: "User Successfully registered", accessToken: accessToken })
      }
    })
})

//check if email exists 
router.post("/emailcheck", (req, res) => {
  if (!req.body.email) return res.status(400).send({ message: "Email or Password is not Provided" })


  const dbConnect = dbo.getDb();
  const query = {
    email: req.body?.email
  }

  dbConnect
    .collection("Authentication")
    .find(query)
    .toArray((err, result) => {
      if (err) {
        return res.status(400).send({ message: "Some Error Occured" })
      }
      else {
        if (result.length > 0) return res.json({ exists: true });
        else return res.json({ exists: false });
      }
    })
});

router.post("/googlelogin", (req, res) => {
  if (!req.body.email) return res.status(400).send({ message: "Email or Password is not Provided" })

  const dbConnect = dbo.getDb();
  const query = {
    email: req.body.email,
  }

  dbConnect
    .collection("Authentication")
    .find(query)
    .toArray((err, result) => {
      if (err) {
        return res.status(400).send({ message: "Some Error Occured" })
      }
      else {
        if (result.length > 0) {
          const accessToken = jwt.sign(query, process.env.ACCESS_TOKEN_SECRET)
          return res.json({ accessToken: accessToken });
        }
        else return res.status(400).send({ message: "Email doesn't exist" });
      }
    })

})
router.get("/getuserdetail", authenticateToken, (req, res) => {
  res.send({ message: "getuserdetail" });
});
router.post("/postnotification", authenticateToken, (req, res) => {
  res.send({ message: "Post notification" });
});
router.get("/getnotification", authenticateToken, (req, res) => {
  res.send({ message: "get notification" });
});
router.get("/booksession", authenticateToken, (req, res) => {
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
