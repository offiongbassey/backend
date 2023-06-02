const express = require("express");
const { updateProfile } = require("../controllers/studentController");
const {studentProtect } = require("../middleWare/studentAuthMiddleware");
const router = express.Router();

router.patch("/updateprofile", studentProtect, updateProfile);


module.exports = router;