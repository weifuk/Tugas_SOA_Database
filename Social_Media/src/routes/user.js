const express = require('express')
const {register, login, editProfile} = require('../controllers/user')
const router = express.Router()

router.post("/user", register)
router.get("/login", login)
router.delete("/user/:username", editProfile)

module.exports = router