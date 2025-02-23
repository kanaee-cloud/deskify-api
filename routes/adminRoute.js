const express = require("express");
const { registerAdmin, adminLogin, getAdminDashboard } = require("../controllers/adminController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerAdmin); 
router.post("/login", adminLogin);
router.get("/dashboard", authenticateJWT, getAdminDashboard);

module.exports = router;
