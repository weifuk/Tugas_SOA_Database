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

const addFriend = async(req, res) => {
    let {username, password, usercari} = req.body

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
            "INSERT INTO friend(user_main, user_friend) VALUES (:user_main, :user_friend)",
            {
                type:QueryTypes.INSERT,
                replacements: {
                    user_main:username,
                    password:password
                }
            }
        )
    
        if (result) {
            return res.status(200).json({msg:`Sukses register username ${username}`})
        } else {
            return res.status(500).json({msg:`Silahkan coba lagi`})
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

        return res.status(200).json(result)
    }
}

const deleteFriend = async(req, res) => {
    let {username, password, usercari} = req.body

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
            "delete from friend where user_main = :user_main and user_friend = :user_friend",
            {
                type:QueryTypes.DELETE,
                replacements: {
                    user_main:username,
                    user_friend:usercari
                }
            }
        )

        if (result) {
            return res.status(200).json({msg:`Sukses delete pertemanan ${username} dengan ${usercari}`})
        } else {
            return res.status(500).json({msg:`Silahkan coba lagi`})
        }
    }
}

module.exports = {
    addFriend,
    viewFriend,
    deleteFriend
}