const { QueryTypes } = require("sequelize")
const databaseBuku = require("../databases/connectionBuku")

const queryBuku = async (req, res) => {
    let keyword = req.query.keyword
    let processKeyword = `%${keyword}%`
    
    const result = await databaseBuku.query(
        "select * from buku join kategori_buku on kategori_buku.kategori_id = buku.kategori_id where buku_nama like ?",
        {
            type:QueryTypes.SELECT,
            replacements: [processKeyword]
        }
    )

    if (result.length < 1) {
        return res.status(200).json({msg:"Tidak ada buku yang cocok dengan keyword"})
    }else {
        return res.status(200).json(result)
    }
}

const getSingleBuku = (req, res) => {
    
}

const insertBuku = async (req, res) => {
    const body = req.body
    const result = await databaseBuku.query(
        "INSERT INTO buku(buku_nama, buku_tahun_terbit, kategori_id) VALUES (:buku_nama, :buku_tahun_terbit, :kategori_id)",
        {
            type:QueryTypes.INSERT,
            replacements: {
                buku_nama:body.buku_nama, 
                buku_tahun_terbit:body.buku_tahun_terbit, 
                kategori_id:body.kategori_id
            }
        }
    )

    if (result) {
        return res.status(200).json({msg:`Sukses insert dengan id ${result[0]}`})
    } else {
        return res.status(500).json({msg:`Silahkan coba lagi`})
    }
}

const updateBuku = (req, res) => {
    
}

const patchBuku = (req, res) => {
    
}

const deleteBuku = (req, res) => {
    
}

module.exports = {
    queryBuku,
    getSingleBuku,
    insertBuku,
    updateBuku,
    patchBuku,
    deleteBuku
}