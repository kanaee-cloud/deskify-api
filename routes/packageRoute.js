/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: API for managing packages
 */

/**
 * @swagger
 * /packages:
 *   get:
 *     summary: Get all packages
 *     tags: [Packages]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of packages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 packages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *       404:
 *         description: No packages found
 */

/**
 * @swagger
 * /packages/{id}:
 *   get:
 *     summary: Get a package by ID
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 package:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *       404:
 *         description: Package not found
 */

/**
 * @swagger
 * /packages/import:
 *   post:
 *     summary: Import packages from JSON
 *     tags: [Packages]
 *     responses:
 *       200:
 *         description: Data imported successfully
 *       500:
 *         description: Failed to import data
 */

const express = require('express');
const router = express.Router();
const PackageController = require('../controllers/packageControllers');

router.get('/', PackageController.getPackages);
router.get('/:id', PackageController.getPackageById);
router.post('/import', PackageController.importPackages);

module.exports = router;
