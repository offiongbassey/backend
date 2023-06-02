const express = require("express");
const { updateLecturerProfile, registerLecturer, resetWithdrawalPin, changeWalletPin, lecturerOrders, lecturerOrder, lecturerTransaction, withdrawFunds, lecturerViewStudent, sumLecturerOrder, lecturerWithdraws, verifyBankInfo, transferWebhook } = require("../controllers/lecturerController");
const {lecturerProtect} = require("../middleWare/lecturerAuthMiddleware");

const router = express.Router();

router.patch("/updateprofile", lecturerProtect, updateLecturerProfile);
router.post("/signup", registerLecturer);
router.post("/resetpin", lecturerProtect, resetWithdrawalPin);
router.patch("/changepin/:token", lecturerProtect, changeWalletPin);
router.get("/orders", lecturerProtect, lecturerOrders);
router.get("/order/:orderId", lecturerProtect, lecturerOrder);
router.get("/transactions", lecturerProtect, lecturerTransaction);
router.post("/withdraw", lecturerProtect, withdrawFunds);
router.get("/viewstudent/:userId", lecturerProtect, lecturerViewStudent);
router.get("/sumorders", lecturerProtect, sumLecturerOrder);
router.get("/withdraw", lecturerProtect, lecturerWithdraws);
router.post("/verifybankaccount", lecturerProtect, verifyBankInfo);
router.post("/verifywithdraw", transferWebhook);
module.exports = router;