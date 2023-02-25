const { QueryTypes } = require("sequelize")
const databaseSosmed = require("../databases/connectionSosmed")

const register = async(req, res) => {
    let {username, password, nama, alamat, nomorhp} = req.body

    const result = await databaseSosmed.query(
        "INSERT INTO user(username, password, nama, alamat, nomorhp) VALUES (:username, :password, :nama , :alamat, :nomorhp)",
        {
            type:QueryTypes.INSERT,
            replacements: {
                username:username,
                password:password,
                nama:nama,
                alamat:alamat,
                nomorhp:nomorhp
            }
        }
    )

    if (result) {
        return res.status(200).json({msg:`Sukses register username ${username}`})
    } else {
        return res.status(500).json({msg:`Silahkan coba lagi`})
    }
}

const login = async(req,res) => {
    let {username, password} = req.body

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

    if (result.length < 1) {
        return res.status(200).json({msg:"User tidak ditemukan"})
    }else {
        return res.status(200).json(result)
    }
}

const editProfile = async(req, res) => {
    let {username} = req.params
    let {nama, alamat, nomorhp, oldpassword, newpassword} = req.body

    const result = await databaseSosmed.query(
        "update user set nama = :nama, alamat = :alamat, nomorhp = :nomorhp, password = :newpassword where username = :username && password = :password",
        {
            type:QueryTypes.UPDATE,
            replacements: {
                nama:nama,
                alamat:alamat,
                nomorhp:nomorhp,
                newpassword:newpassword,
                username:username,
                password:oldpassword
            }
        }
    )

    if (result) {
        return res.status(200).json({msg:`Sukses update profile username ${username}`})
    } else {
        return res.status(500).json({msg:`Silahkan coba lagi`})
    }
}

module.exports = {
    register,
    login,
    editProfile
}