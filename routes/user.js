const express = require("express");
const { register2,registerValiations } = require("../controllers/user");

const router = express.Router();

router.post("/register",registerValiations, register2);

module.exports = router;
