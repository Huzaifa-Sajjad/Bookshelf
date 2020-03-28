const express = require("express");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../models/user");
const authenticate = require("../middleware/auth");
const router = express.Router();

// ROUTE        => /api/auth
// ACCESS TYPE  => public
// Description  => user login route
router.post(
  "/",
  [
    check("email", "Enter a valid email address").isEmail(),
    check("password", "Enter a valid password")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(406).json({ errors: errors.array() });
    }

    //No errors
    try {
      const user = await User.findOne({ email: req.body.email });

      //Email not found
      if (!user) {
        return res
          .status(422)
          .json({ errors: [{ msg: "Email address not found" }] });
      }

      //Match the password with users password
      if (user.password !== req.body.password) {
        return res.status(406).json({ errors: [{ msg: "Invalid Password" }] });
      }

      //Create a payload
      const payload = {
        user: {
          id: user._id
        }
      };

      //Sign the token
      const token = jwt.sign(payload, config.get("jwtSecret"), {
        expiresIn: 360000
      });
      return res.status(200).json({ token });

      //TODO Save the token the localstorage rather than sending it back
    } catch (err) {
      return res.status(500).json({ errors: [{ msg: err.msg }] });
    }
  }
);

// ROUTE        => /api/auth
// ACCESS TYPE  => Protected
// Description  => returns logged in users information except password
router.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .exec();
    if (!user) {
      return res.status(401).json({ errors: [{ msg: "Invalid Token" }] });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ errors: [{ msg: err.msg }] });
  }
});

module.exports = router;
