const { QueryTypes } = require("sequelize")
const databaseSosmed = require("../databases/connectionSosmed")

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

    usercari = await databaseSosmed.query(
        "select * from user where username = :username",
        {
            type:QueryTypes.SELECT,
            replacements:{
                username:usercari
            }
        }
    ) 

    usermain = await databaseSosmed.query(
        "select * from user where username = :username && password = :password",
        {
            type:QueryTypes.SELECT,
            replacements: {
                username:username,
                password:password
            }
        }
    )

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

const viewMessage = async(req, res) => {
    let {username} = req.params
    let {password} = req.body

    usermain = await databaseSosmed.query(
        "select * from user where username = :username && password = :password",
        {
            type:QueryTypes.SELECT,
            replacements: {
                username:username,
                password:password
            }
        }
    )

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

        temp_res = [];

        result.forEach(res => {
            new_res = {
                from:res.user_sender,
                to:res.user_receiver,
                message:res.message
            }

            temp_res.push(new_res);
        });

        return res.status(200).json(temp_res);
    }
}

module.exports = {
    sendMessage,
    viewMessage
}