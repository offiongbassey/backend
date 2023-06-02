const express = require("express");
const { registerUser, loginUser, logout, getUser, loginStatus, updateUser, changePassword, 
    forgotPassword, resetPassword, resendVerificationMail, confirmEmail, viewStudents, updateStudentStatus, 
    deleteStudent, viewSignleStudent, viewLecturers, updateLecturerStatus, deleteLecturer, viewSignleLecturer, 
    getOrders, getOrder, viewTransactions, viewUserTransactions, viewStudentOrders, viewLecturerOrders, viewGeneralReceipt, getSingleUser, viewWithdrawals, updateProductStatus, adminAccountData } = require("../controllers/userController");
const  {protect }  = require("../middleWare/authMiddleware");
const { generalProtect } = require("../middleWare/generalAuthMiddleware");
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);
// router.get('/getuser', fetchUser);
router.get('/finduser', generalProtect, getSingleUser);
router.get('/loggedin', loginStatus);
router.patch('/updateuser', generalProtect, updateUser);
router.patch('/changepassword', generalProtect, changePassword);
// router.post('/sendmail', sendMail);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
router.post("/resendverification", resendVerificationMail);
router.get('/confirmemail/:token', confirmEmail);
router.get("/viewstudents", protect, viewStudents);
router.patch("/changestudentstatus/:studentId", protect, updateStudentStatus);

router.patch("/changeproductstatus/:url", protect, updateProductStatus);

router.get("/accountdata", protect, adminAccountData);
router.delete("/deletestudent/:studentId", protect, deleteStudent);
router.get("/viewstudent/:studentId", protect, viewSignleStudent);
router.get("/viewlecturers", viewLecturers);
router.patch("/changelecturerstatus/:lecturerId", protect, updateLecturerStatus);
router.delete("/deletelecturer/:lecturerId", protect, deleteLecturer);
router.get("/viewlecturer/:lecturerId", viewSignleLecturer);

//view order and transaction
router.get("/orders", protect, getOrders);
router.get("/order/:orderId", protect, getOrder);
router.get("/transactions", protect, viewTransactions);
router.get("/withdraws", protect, viewWithdrawals);
router.get("/user-transactions/:userId", protect, viewUserTransactions);
router.get("/student-orders/:userId", protect, viewStudentOrders);
router.get("/lecturer-orders/:userId", protect, viewLecturerOrders);
router.get("/receipt/:transactionCode", viewGeneralReceipt);


module.exports = router;