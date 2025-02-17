const LaptopModel = require("../models/laptopModel");
const jsonData = require("../data-laptop.json");

const LaptopController = {
  async getLaptop(req, res) {
    try {
      const { brands, minPrice, maxPrice, sortByPrice } = req.query;
      const laptops = await LaptopModel.getAllLaptop();

      let laptop = laptops;

      if (brands) {
        const brandArray = brands.split(",");
        laptop = laptop.filter((laptop) => brandArray.includes(laptop.brand));
      }

      if (minPrice || maxPrice) {
        laptop = laptop.filter((laptop) => {
          const price = laptop.price;
          if (minPrice && price < Number(minPrice)) return false;
          if (maxPrice && price > Number(maxPrice)) return false;
          return true;
        });
      }

      if (sortByPrice) {
        laptop.sort((a, b) => {
          return sortByPrice === "asc" ? a.price - b.price : b.price - a.price;
        });
      }

      if (laptops.length === 0) {
        return res.status(404).json({
          message: "Gaada datanya",
        });
      }

      res.status(200).json({
        laptop,
      });
    } catch (error) {
      console.error("Error Fetching Laptops : ", error);
      res.status(500).json({
        message: "Failed to fetch laptops",
        error: error.message,
      });
    }
  },

  async deleteLaptop(req, res) {
    try {
      const { id } = req.params;
      console.log(`Menerima request delete untuk ID: ${id}`); // Tambahkan ini

      if (!id) {
        return res.status(400).json({ message: "ID harus disertakan" });
      }

      const success = await LaptopModel.deleteLaptop(id);

      if (success) {
        console.log(`Laptop dengan ID: ${id} berhasil dihapus`);
        res
          .status(200)
          .json({ message: `Laptop dengan ID: ${id} berhasil dihapus` });
      } else {
        console.log(`Laptop dengan ID: ${id} tidak ditemukan`);
        res
          .status(404)
          .json({ message: `Laptop dengan ID: ${id} tidak ditemukan` });
      }
    } catch (error) {
      console.error("Gagal menghapus laptop:", error);
      res
        .status(500)
        .json({ message: "Gagal menghapus laptop", error: error.message });
    }
  },
  async createLaptop(req, res) {
    try {
      const laptopData = req.body;
      console.log("Menerima data laptop:", laptopData); // Logging request body

      if (!laptopData.brand || !laptopData.model_name || !laptopData.price) {
        return res
          .status(400)
          .json({ message: "Brand, model_name, dan price wajib diisi" });
      }

      const newLaptop = await LaptopModel.createLaptop(laptopData);
      console.log("Laptop berhasil dibuat:", newLaptop); // Logging hasil penyimpanan

      res.status(201).json({
        message: "Laptop berhasil dibuat",
        laptop: newLaptop,
      });
    } catch (error) {
      console.error("Error saat membuat laptop:", error);
      res.status(500).json({
        message: "Gagal membuat laptop",
        error: error.message,
      });
    }
  },
  async getLaptopById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          message: "masukkan id yang valid",
        });
      }
      const laptopDetail = await LaptopModel.getLaptopById(id);

      res.status(200).json({
        laptops: laptopDetail,
      });
    } catch (error) {
      console.error("Gagal mengambil laptop by id : ", error);
      res.status(404).json({
        message: error.message,
      });
    }
  },
  async importLaptops(req, res) {
    try {
      const laptops = jsonData.laptops;
      if (!Array.isArray(laptops)) {
        throw new Error("invalid json format");
      }

      await LaptopModel.importLaptops(laptops);

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

module.exports = LaptopController;
