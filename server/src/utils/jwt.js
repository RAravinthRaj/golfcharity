const jwt = require("jsonwebtoken");
const env = require("../config/env");

function signToken(user) {
  return jwt.sign({ sub: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: "7d"
  });
}

module.exports = { signToken };
