const express = require("express");
const router = express.Router();
const { getHackathons } = require("../Controllers/hackathonController");
const { verifyToken } = require("../Middleware/verifyToken");

router.get("/hackathons", verifyToken, getHackathons);

module.exports = router;
