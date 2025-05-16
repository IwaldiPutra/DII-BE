const express = require("express");
const router = express.Router();
const { createJadwal, getJadwal } = require("../controllers/jadwalController");
const { authenticateToken } = require("../middlewares/auth");
const checkApiKey = require("../middlewares/key");

router.post("/jadwal", checkApiKey, authenticateToken, createJadwal);
router.get("/jadwal", checkApiKey, getJadwal);

module.exports = router;
