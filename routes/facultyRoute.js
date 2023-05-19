const express = require("express");
const {protect} = require("../middleWare/authMiddleware");
const { createFaculty, getAllFaculty, getFacultyByCampus, updateFaculty, deleteFaculty, updateFacultyStatus } = require("../controllers/facultyController");
const router = express.Router();

router.post("/create", protect, createFaculty);
router.get("/get", getAllFaculty);
router.post("/getbycampus", getFacultyByCampus);
router.patch("/update/:facultyId", protect, updateFaculty);
router.delete("/delete/:facultyId", protect, deleteFaculty);
router.patch("/updatestatus/:facultyId", protect, updateFacultyStatus);

module.exports = router;