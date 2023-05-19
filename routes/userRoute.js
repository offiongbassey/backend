const express = require("express");
const { registerUser, loginUser, logout, getUser, loginStatus, updateUser, changePassword, sendMail, forgotPassword, resetPassword, resendVerificationMail, confirmEmail } = require("../controllers/userController");
const  {protect }  = require("../middleWare/authMiddleware");
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);
router.get('/getuser', protect,  getUser);
router.get('/loggedin', loginStatus);
router.patch('/updateuser', protect, updateUser);
router.patch('/changepassword', protect, changePassword);
// router.post('/sendmail', sendMail);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
router.post("/resendverification", resendVerificationMail);
router.get('/confirmemail/:token', confirmEmail);

module.exports = router;