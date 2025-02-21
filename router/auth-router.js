const express = require("express");
const router = express.Router();
const auth_controller = require("../controllers/auth-controller");
const authMiddleware = require("../middlewares/auth-middleware");
router.use(express.json());

router.post("/register", auth_controller.register);
router.post("/login", auth_controller.Login);
router.get("/userDetails", authMiddleware, auth_controller.getUserDetail);
module.exports = router;
