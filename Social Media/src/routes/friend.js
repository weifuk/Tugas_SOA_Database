const express = require('express')
const {addFriend, viewFriend, deleteFriend} = require('../controllers/friend')
const router = express.Router()

router.post("/friend", addFriend)
router.get("/friend/:username", viewFriend)
router.delete("/friend", deleteFriend)

module.exports = router