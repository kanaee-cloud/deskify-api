/**
 * @swagger
 * tags:
 *   name: Laptops
 *   description: API for managing laptops
 */

/**
 * @swagger
 * /laptops:
 *   get:
 *     summary: Get all laptops
 *     tags: [Laptops]
 *     parameters:
 *       - in: query
 *         name: brands
 *         schema:
 *           type: string
 *         description: Filter laptops by brands (comma-separated)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price of laptops
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price of laptops
 *       - in: query
 *         name: sortByPrice
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort laptops by price
 *     responses:
 *       200:
 *         description: List of laptops
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filteredLaptops:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       brand:
 *                         type: string
 *                       price:
 *                         type: number
 *       404:
 *         description: No laptops found
 */

/**
 * @swagger
 * /laptops/{id}:
 *   get:
 *     summary: Get a laptop by ID
 *     tags: [Laptops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Laptop ID
 *     responses:
 *       200:
 *         description: Laptop details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 laptops:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     brand:
 *                       type: string
 *                     price:
 *                       type: number
 *       404:
 *         description: Laptop not found
 */

/**
 * @swagger
 * /laptops/import:
 *   post:
 *     summary: Import laptops from JSON
 *     tags: [Laptops]
 *     responses:
 *       200:
 *         description: Data imported successfully
 *       500:
 *         description: Failed to import data
 */

const express = require('express');
const router = express.Router();
const LaptopController = require('../controllers/laptopControllers');
const { authenticateJWT, adminMiddleware } = require('../middlewares/authMiddleware');

router.get('/', LaptopController.getLaptop);
router.get('/:id', LaptopController.getLaptopById);
router.delete('/:id', authenticateJWT, adminMiddleware, LaptopController.deleteLaptop);
router.post('/', authenticateJWT, adminMiddleware, LaptopController.createLaptop);
router.post('/import', authenticateJWT, adminMiddleware, LaptopController.importLaptops);

module.exports = router;
