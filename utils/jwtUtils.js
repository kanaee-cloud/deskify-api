const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const generateJWT = (payload) => {
  return jwt.sign(payload, SECRET_KEY);
};

module.exports = { generateJWT };
