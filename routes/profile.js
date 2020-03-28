const express = require("express");
const { check, validationResult } = require("express-validator");

const authenticate = require("../middleware/auth");
const Profile = require("../models/profile");

const router = express.Router();

// ROUTE        => POST /api/profile
// ACCESS TYPE  => Protected
// Description  => Create a profile
router.post(
  "/",
  authenticate,
  [
    check("bio")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(406).json({ errors: errors.array() });
    }

    //Profile data
    const profileData = {
      user: req.user.id,
      bio: req.body.bio,
      avatar: "https://www.gravatar.com/avatar/HASH"
    };

    try {
      //Check if the profile exsists or not if it exsists update it else create it
      const profile = await Profile.findOne({ user: req.user.id });

      //Update the profile
      if (profile) {
        const updatedProfile = await Profile.findOneAndUpdate(
          { _id: profile._id },
          { $set: profileData },
          { new: true }
        );
        return res.json({ msg: "Profile Updated", profile: updatedProfile });
      } else {
        //Create new profile
        const newProfile = await Profile.create(profileData);
        return res.json({ msg: "Profile Created", profile: newProfile });
      }
    } catch (err) {
      return res.status(500).json({ errors: [{ msg: err.msg }] });
    }
  }
);

// ROUTE        => GET /api/profile
// ACCESS TYPE  => Protected
// Description  => get current user profile
router.get("/", authenticate, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    })
      .populate("user", ["firstName", "lastName", "email"])
      .exec();
    return res.json({ profile });
  } catch (err) {
    return res.status(500).json({ errors: [{ msg: err.msg }] });
  }
});

// ROUTE        => DELETE /api/profile
// ACCESS TYPE  => Protected
// Description  => get current user profile
router.delete("/", authenticate, async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({ user: req.user.id });
    return res.json({ msg: "Profile Deleted!", profile });
  } catch (err) {
    return res.status(500).json({ errors: [{ msg: err.msg }] });
  }
});

module.exports = router;
