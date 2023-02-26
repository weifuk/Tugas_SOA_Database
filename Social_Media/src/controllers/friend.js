const { QueryTypes } = require("sequelize")
const databaseSosmed = require("../databases/connectionSosmed")

const addFriend = async(req, res) => {
    let {username, password, usercari} = req.body

    user_usercari = await databaseSosmed.query(
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

    if (user_usercari.length < 1) {
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
                    user_friend:usercari
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
            "select u.username, u.nama, u.alamat, u.nomorhp from user u join friend f on f.user_friend = u.username where user_main = :user_main",
            {
                type:QueryTypes.SELECT,
                replacements: {
                    user_main:username
                }
            }
        )

        temp_res = [];
        result.forEach(res => {
            new_obj = {};
            obj_isi = {
                nama:res.nama,
                alamat:res.alamat,
                nomorhp:res.nomorhp
            };
            new_obj[res.username] = obj_isi
            temp_res.push(new_obj);
        });


        return res.status(200).json(temp_res)
    }
}

const deleteFriend = async(req, res) => {
    let {username, password, usercari} = req.body

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