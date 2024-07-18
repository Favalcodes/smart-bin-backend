const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { role } = require("../constants");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }
      if (decoded.user) {
        req.user = decoded.user;
        next();
      }
      if (decoded.admin) {
        req.admin = decoded.admin;
        next();
      }
    });
  } else {
    res.status(401);
    throw new Error("User is not authorized");
  }
});

module.exports = validateToken;
