const express = require("express");
const { createOrder, studentOrders, studentOrder, studentOrderPayment, studentTransactions } = require("../controllers/orderController");
const router = express.Router();
const {studentProtect } = require("../middleWare/studentsMiddleware");

router.post("/", studentProtect, createOrder);
router.get("/", studentProtect, studentOrders);
router.get("/transactions", studentProtect, studentTransactions);
router.get("/:orderId", studentProtect, studentOrder);
router.patch("/payment/:transactionCode", studentProtect, studentOrderPayment);


module.exports = router;