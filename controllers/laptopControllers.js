const LaptopModel = require('../models/laptopModel')
const jsonData = require('../data-laptop.json')

const LaptopController = {

    async getLaptop(req, res){
        try{
            const laptops = await LaptopModel.getAllLaptop()
            if(laptops.length === 0){
                return res.status(404).json({
                    message: 'Gaada datanya'
                })
            }

            res.status(200).json({
                laptops,
            })
        } catch(error){
            console.error('gagal ambil package : ', error)
            res.status(500).json({
                message: 'error cuk',
                error: error.message
            })
        }
    },

    async getLaptopById(req, res){
        try{
            const { id } = req.params

            if(!id){
                return res.status(400).json({
                    message: 'masukkan id yang valid'
                })
            }
            const laptopDetail = await LaptopModel.getLaptopById(id)

            res.status(200).json({
                laptops: laptopDetail
            })
        } catch(error){
            console.error('Gagal mengambil laptop by id : ', error)
            res.status(404).json({
                message: error.message
            })
        }
    }, 
    async importLaptops(req, res){
        try{
            const laptops = jsonData.laptops
            if(!Array.isArray(laptops)){
                throw new Error('invalid json format')
            }

            await LaptopModel.importLaptops(laptops)

            res.status(200).json({
                message: 'data imported'
            })

        }catch(error){
            console.error('gagal import data : ', error)
            res.status(500).json({
                message: 'error cuk',
                error: error.message
            })
        }
    }

}

module.exports = LaptopController