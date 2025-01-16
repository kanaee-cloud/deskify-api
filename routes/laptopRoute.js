const express = require('express')
const router = express.Router()
const LaptopController = require('../controllers/laptopControllers')

router.get('/', LaptopController.getLaptop)
router.get('/:id', LaptopController.getLaptopById)

router.post('/import', LaptopController.importLaptops)

module.exports = router