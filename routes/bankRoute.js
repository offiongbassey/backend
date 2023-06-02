const express = require("express");
const { createBank, viewBanks, viewActiveBanks, updateBank, updateBankStatus, getSignleBank } = require("../controllers/bankController");
const router = express.Router();
const {protect} = require("../middleWare/authMiddleware");

router.post("/create", protect, createBank);
router.get("/active", viewActiveBanks)
router.get("/view", protect, viewBanks);
router.patch("/update/:bankId", protect, updateBank);
router.patch("/updatestatus/:bankId", protect, updateBankStatus);
router.get("/:bankId", protect, getSignleBank);

module.exports = router;