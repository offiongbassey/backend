const express = require('express');
const { createCampus, getCampus, updateCampus, deleteCampus, updateCampusStatus } = require('../controllers/campusController');
const router = express.Router();
const {protect} = require("../middleWare/authMiddleware");

router.post("/create", protect, createCampus);
router.get("/get", getCampus);
router.patch("/update/:campusId", protect, updateCampus);
router.delete("/delete/:campusId", protect, deleteCampus);
router.patch("/updatestatus/:campusId", protect, updateCampusStatus);



module.exports = router;

