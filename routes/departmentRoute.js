const express = require("express");
const { createDepartment, getAllDepartments, getDepartmentByFaculty, updateDepartment, deleteDepartment, updateDepartmentStatus } = require("../controllers/departmentController");
const {protect} = require("../middleWare/authMiddleware");

const router = express.Router();

router.post("/create", protect, createDepartment);
router.get("/get", getAllDepartments);
router.post("/getbyfaculty", getDepartmentByFaculty);
router.patch("/update/:departmentId", protect, updateDepartment);
router.delete("/delete/:departmentId", protect, deleteDepartment);
router.patch("/updatestatus/:departmentId", protect, updateDepartmentStatus);

module.exports = router;
