const express = require("express");
const { check, body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../models/user");
const router = express.Router();

// ROUTE        => /api/user
// ACCESS TYPE  => public
// Description  => user registeration route
router.post(
  "/",
  [
    check("firstName", "First Name is Required")
      .not()
      .isEmpty(),
    check("lastName", "Last Name is Required")
      .not()
      .isEmpty(),
    check("email", "Enter a valid email address").isEmail(),
    check("password", "Password must be between 6 to 12 Characteres").isLength({
      min: 6,
      max: 12
    }),
    check(
      "confirmPassword",
      "Password must be between 6 to 12 Characteres"
    ).isLength({ min: 6, max: 12 })
  ],
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) throw new Error("Passwords do not Match");
    return true;
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //No Errors Found Register the User
    try {
      //Check whether user already exsists or not
      const userExsists = await User.findOne({ email: req.body.email });
      if (userExsists) {
        return res.status(422).json({
          errors: [
            { msg: "User already exsists. Please use a new email address." }
          ]
        });
      }

      //Register the user
      const user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      });

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

module.exports = router;
