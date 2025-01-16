const express = require('express')
const router = express.Router()
const PackageController = require('../controllers/packageControllers')

router.get('/', PackageController.getPackages)
router.get('/:id', PackageController.getPackageById)

router.post('/import', PackageController.importPackages)

module.exports = router