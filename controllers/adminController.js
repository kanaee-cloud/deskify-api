const { createAdmin, verifyAdmin } = require("../models/adminModel");
const { generateJWT } = require("../utils/jwtUtils");

const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const newAdmin = await createAdmin(email, password);
    res.status(201).json(newAdmin);
  } catch (error) {
    console.error("Failed to register admin:", error);
    res
      .status(500)
      .json({ message: "Failed to register admin", error: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const adminData = await verifyAdmin(email, password);
    if (!adminData)
      return res.status(401).json({
        error: "invalid credentials",
      });

    const jwtToken = generateJWT({ email: adminData.email, role: "admin" });
    res
      .status(200)
      .json({ token: jwtToken, message: "Admin logged in successfully" });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getAdminDashboard = (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Unauthorized" });

  res.json({ message: "Welcome to admin dashboard", user: req.user });
};

module.exports = { registerAdmin, adminLogin, getAdminDashboard };