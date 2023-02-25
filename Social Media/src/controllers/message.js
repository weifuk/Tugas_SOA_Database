const { QueryTypes } = require("sequelize")
const databaseSosmed = require("../databases/connectionSosmed")

const getUser = async(username) => {
    const result = await databaseSosmed.query(
        "select * from user where username = :username",
        {
            type:QueryTypes.SELECT,
            replacements:{
                username:username
            }
        }
    ) 
    
    return result
}

const loginUserFriend = async(username, password) => {
    const result = await databaseSosmed.query(
        "select * from user where username = :username && password = :password",
        {
            type:QueryTypes.SELECT,
            replacements: {
                username:username,
                password:password
            }
        }
    )

    return result
}

const sendMessage = async(req, res) => {
    let {username, password, message, usercari} = req.body

    usercari = getUser(usercari)

    usermain = loginUserFriend(username,password)

    if (usercari.length < 1) {
        return res.status(404).json({msg:`User dengan username ${usercari} tidak ditemukan`})
    }
    else if (usermain.length < 1) {
        return res.status(404).json({msg:`Gagal login`})
    }
    else {
        const result = await databaseSosmed.query(
            "insert into message(user_sender, user_receiver, message) values(:user_sender, :user_receiver, :message)",
            {
                type:QueryTypes.INSERT,
                replacements:{
                    user_sender:username,
                    user_receiver:usercari,
                    message:message
                }
            }
        )

        if (result) {
            res.status(200).json({msg:`Berhasil mengirim pesan`})
        }
        else {
            res.status(500).json({msg:`Gagal mengirim pesan`})
        }
    }
}

const viewFriend = async(req, res) => {
    let {username} = req.params
    let {password} = req.body

    usermain = loginUserFriend(username,password)

    if (usermain.length < 1) {
        return res.status(404).json({msg:`Gagal login`})
    }
    else {
        const result = await databaseSosmed.query(
            "select * from friend where user_main = :user_main",
            {
                type:QueryTypes.SELECT,
                replacements: {
                    user_main:username
                }
            }
        )

        return result
    }
}

const viewMessage = async(req, res) => {
    let {username} = req.params
    let {password} = req.body

    usermain = loginUserFriend(username,password)

    if (usermain.length < 1) {
        return res.status(404).json({msg:`Gagal login`})
    }
    else {
        const result = await databaseSosmed.query(
            "select * from message where user_sender = :user_sender",
            {
                type:QueryTypes.SELECT,
                replacements: {
                    user_sender:username
                }
            }
        )

        return res.status(200).json(result)
    }
}

module.exports = {
    sendMessage,
    viewMessage
}