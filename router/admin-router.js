const express = require("express");
const router = express.Router();
const admin_controller = require("../controllers/admin-controller");
const authMiddleware = require("../middlewares/auth-middleware");
router.use(express.json());
router.post("/AddQuiz", authMiddleware, admin_controller.AddQuiz);

module.exports = router;
