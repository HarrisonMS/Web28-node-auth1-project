const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Users = require("../routes/users-model");

router.post("/register", (req, res) => {
  let user = req.body;

  const rounds = process.env.HASH_ROUNDS || 8;
  // hash the password
  const hash = bcrypt.hashSync(user.password, rounds); // the 8 is the number of rounds (2^8) (iterations)

  // override the plain text password with the hash
  user.password = hash;

  Users.add(user)
    .then(user => {
     res.status(201).json(user);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: "cant create that user" });
    });
})
router.post("/login", (req, res) => {
  let { username, password } = req.body;

  // check that the password

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.loggedIn = true;
        // in here with .compare()
        // change the users-model findBy() to return the password as well
        res.status(200).json({ message: `${user.username}, welcome to the website` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(error => {
      if (error) {
        res.status(500).json({
          message:
            "Unfortunately we can not let you leave at this time",
        });
      } else {
        res.status(200).json({ message: "Bye bye now have a good day" });
      }
    });
  } else {
    res.status(204).end();
  }
});

module.exports = router;
