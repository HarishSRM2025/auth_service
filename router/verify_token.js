const express = require("express");
const { verifyToken } = require("../controller/verify_token");
const router = express.Router();


router.post("/verify-token", verifyToken);

module.exports = router;