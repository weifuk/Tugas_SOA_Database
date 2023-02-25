const express = require('express')
const {sendMessage, viewMessage} = require('../controllers/message')
const router = express.Router()

router.post("/message", sendMessage)
router.get("/message/:username", viewMessage)

module.exports = router