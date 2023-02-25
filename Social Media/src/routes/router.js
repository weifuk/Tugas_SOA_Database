const express = require('express')
const {register, login, editProfile} = require('../controllers/user')
const {sendMessage, viewMessage} = require('../controllers/message')
const {addFriend, viewFriend, deleteFriend} = require('../controllers/friend')
const router = express.Router()

router.post("/user", register)
router.get("/login", login)
router.delete("/user/:username", editProfile)
router.post("/message", sendMessage)
router.get("/message/:username", viewMessage)
router.post("/friend", addFriend)
router.get("/friend/:username", viewFriend)
router.delete("/friend", deleteFriend)

module.exports = router