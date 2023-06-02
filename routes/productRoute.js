const express = require("express");
const { createProduct, getProducts, getProduct, deleteProduct, updateProduct, uploadProductSoftcopy, getAllProducts, getProductByUrl, getProductByAuthor } = require("../controllers/productController");
const {lecturerProtect } = require("../middleWare/lecturerAuthMiddleware");
const {generalProtect} = require("../middleWare/generalAuthMiddleware");
const router = express.Router();
const {upload} = require("../utils/fileUpload");
const { document} = require("../utils/documentUpload");



router.post("/", lecturerProtect, upload.single("image"), createProduct);
//view product by anyone
router.get("/all", generalProtect, getAllProducts);
// view product by url
router.get("/single/:url", generalProtect, getProductByUrl);
// view products by author
router.get("/author/:userId", generalProtect, getProductByAuthor);

//protect routes for lecturer
router.get("/lecturer", generalProtect, getProducts);
router.get("/:productId", lecturerProtect, getProduct);
router.delete("/:productId", lecturerProtect, deleteProduct);
router.patch("/:productId", lecturerProtect, upload.single("image"), updateProduct);
router.patch("/softcopy/:productId", lecturerProtect, document.single("image"), uploadProductSoftcopy);


module.exports = router;