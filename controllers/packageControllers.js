const PackageModel = require("../models/packageModel");
const jsonData = require("../product-package.json");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

const PackageController = {
  async getPackages(req, res) {
    try {
      const { page = 1 } = req.query;
      const limit = 4;
      const offset = (page - 1) * limit;
      const cacheKey = `packages:${page}`;
      const cachedPackages = myCache.get(cacheKey);

      if (cachedPackages) {
        console.log("data diambil dari cache");
        return res.status(200).json(cachedPackages); // Kembalikan data dari cache
      } else {
        console.log("data diambil dari database");
      }

      const packages = await PackageModel.getAllPackages(limit, offset);
      if (packages.length === 0) {
        return res.status(404).json({
          message: "Gaada datanya",
        });
      }

      const response = {
        page: Number(page),
        total: packages.length,
        packages,
      };

      myCache.set(cacheKey, response, 3600);
      res.status(200).json(response);

    } catch (error) {
      console.error("Gagal mengambil package : ", error);
      res.status(500).json({
        message: "Error mengambil data",
        error: error.message,
      });
    }
  },

  async getPackageById(req, res) {
    try {
      const { id } = req.params;
      const cacheKey = `package:${id}`;
      const cachedPackage = myCache.get(cacheKey);

      if (cachedPackage) {
        console.log("data diambil dari cache");
        return res.status(200).json({ package: cachedPackage });
      } else {
        console.log("data diambil dari database");
      }

      if (!id) {
        return res.status(400).json({
          message: "masukkan id yang valid",
        });
      }
      const packageDetail = await PackageModel.getPackageById(id);

      if(!packageDetail){
        return res.status(404).json({message: "Package tidak ditemukan"});
      }

      myCache.set(cacheKey, packageDetail, 3600);
      res.status(200).json({ package: packageDetail });

      
    } catch (error) {
      console.error("Gagal mengambil package by id : ", error);
      res.status(404).json({
        message: error.message,
      });
    }
  },

  async createPackage(req, res) {
    try {
      const packageData = req.body;
      const newPackage = await PackageModel.createPackage(packageData);

      res.status(201).json({
        message: "Package created successfully",
        package: newPackage,
      });
    } catch (error) {
      console.error("Failed to create package:", error);
      res.status(400).json({
        message: error.message,
      });
    }
  },

  async updatePackage(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedPackage = await PackageModel.updatePackage(id, updateData);

      res.status(200).json({
        message: "Package updated successfully",
        package: updatedPackage,
      });
    } catch (error) {
      console.error("Failed to update package:", error);
      res.status(404).json({
        message: error.message,
      });
    }
  },

  async deletePackage(req, res) {
    try {
      const { id } = req.params;
      await PackageModel.deletePackage(id);

      res.status(200).json({
        message: "Package deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete package:", error);
      res.status(404).json({
        message: error.message,
      });
    }
  },

  async importPackages(req, res) {
    try {
      const packages = jsonData.packages;
      if (!Array.isArray(packages)) {
        throw new Error("invalid json format");
      }

      await PackageModel.importPackages(packages);

      res.status(200).json({
        message: "data imported",
      });
    } catch (error) {
      console.error("gagal import data : ", error);
      res.status(500).json({
        message: "error cuk",
        error: error.message,
      });
    }
  },
};

module.exports = PackageController;
