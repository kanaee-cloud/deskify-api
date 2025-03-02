const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const authenticateJWT = (req, res, next) => {
  const authHeader = req.header("Authorization");
  
  console.log("Authorization Header:", authHeader); 

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied, no valid token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token); 

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Decoded JWT:", decoded); 
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

const adminMiddleware = (req, res, next) => {
  console.log("Decoded User in Admin Middleware:", req.user);

  if (!req.user || (!req.user.isAdmin && req.user.role !== "admin")) {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }

  next();
};

// console.log("Authorization Header:", req.headers.authorization);
// console.log("Decoded User:", req.user);

module.exports = { authenticateJWT, adminMiddleware };
