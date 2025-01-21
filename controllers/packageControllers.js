const PackageModel = require('../models/packageModel')
const jsonData = require('../product-package.json')

const PackageController = {
    async getPackages(req, res){
        try {
            const { page = 1 } = req.query;
            const limit = 4;
            const offset = (page - 1) * limit;

            const packages = await PackageModel.getAllPackages(limit, offset)
            if(packages.length === 0){
                return res.status(404).json({
                    message: 'Gaada datanya'
                })
            }

            res.status(200).json({
                page: Number(page),
                total: packages.length,
                packages,
            })
        } catch(error){
            console.error('gagal ambil package cuk : ', error)
            res.status(500).json({
                message: 'error cuk', 
                error: error.message
            })
        }
    },

    async getPackageById(req, res){
        try {
            const { id } = req.params

            if(!id){
                return res.status(400).json({
                    message: 'masukkan id yang valid'
                })
            }
            const packageDetail = await PackageModel.getPackageById(id)

            res.status(200).json({
                package: packageDetail
            });
        } catch(error){
            console.error('Gagal mengambil package by id : ', error)
            res.status(404).json({
                message: error.message,
            })
        }


    },

    async importPackages(req, res){
        try{
            const packages = jsonData.packages
            if(!Array.isArray(packages)){
                throw new Error('invalid json format')
            }
            
            await PackageModel.importPackages(packages)

            res.status(200).json({
                message: 'data imported'
            })

        }catch (error){
            console.error('gagal import data : ', error)
            res.status(500).json({
                message: 'error cuk', 
                error: error.message
            })
        }
    }
}

module.exports = PackageController