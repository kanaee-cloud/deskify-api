const LaptopModel = require("../models/laptopModel");
const jsonData = require("../data-laptop.json");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

const LaptopController = {
  async getLaptop(req, res) {
    try {
      const { brands, minPrice, maxPrice, sortByPrice } = req.query;
      const cacheKey = `laptops:${brands}:${minPrice}:${maxPrice}:${sortByPrice}`;
      const cachedLaptops = myCache.get(cacheKey);

      if (cachedLaptops) {
        console.log("Data diambil dari cache");
        return res.status(200).json({
          laptop: cachedLaptops,
        });
      } else {
        console.log("Data diambil dari database");
      }

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
          message: "data tidak ditemukan",
        });
      }

      myCache.set(cacheKey, laptops, 3600);
      res.status(200).json({ laptop: laptops });
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
      console.log(`Menerima request delete untuk ID: ${id}`);

      if (!id) {
        return res.status(400).json({ message: "ID harus disertakan" });
      }

      const success = await LaptopModel.deleteLaptop(id);

      if (success) {
        myCache.del(`laptop:${id}`);
        res
          .status(200)
          .json({ message: `Laptop dengan ID: ${id} berhasil dihapus` });
      } else {
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
      console.log("Menerima data laptop:", laptopData);

  
      if (!laptopData.brand || !laptopData.model_name || !laptopData.price) {
        return res
          .status(400)
          .json({ message: "Brand, model_name, dan price wajib diisi" });
      }


      if (typeof laptopData.brand !== 'string' || typeof laptopData.model_name !== 'string') {
        return res.status(400).json({ 
          message: "Brand dan model_name harus berupa text" 
        });
      }

    
      if (typeof laptopData.price !== 'number' || laptopData.price <= 0) {
        return res.status(400).json({ 
          message: "Price harus berupa angka positif" 
        });
      }

 
      if (laptopData.brand.length > 50 || laptopData.model_name.length > 100) {
        return res.status(400).json({ 
          message: "Brand maksimal 50 karakter dan model_name maksimal 100 karakter" 
        });
      }

   
      const sanitizedData = {
        ...laptopData,
        brand: laptopData.brand.replace(/<[^>]*>/g, '').trim(),
        model_name: laptopData.model_name.replace(/<[^>]*>/g, '').trim(),
        // price: laptopData.description ? 
        //   laptopData.description.replace(/<[^>]*>/g, '').trim() : undefined
      };

    
      const allowedBrands = ['lenovo', 'hp', 'dell', 'asus', 'acer', 'msi', 'axioo'];
      if (!allowedBrands.includes(sanitizedData.brand)) {
        return res.status(400).json({ 
          message: "Brand tidak valid" 
        });
      }

 
      const MAX_PRICE = 100000000;
      if (sanitizedData.price > MAX_PRICE) {
        return res.status(400).json({ 
          message: `Price tidak boleh lebih dari ${MAX_PRICE}` 
        });
      }

 
      if (sanitizedData.image_url) {
        const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
        if (!urlPattern.test(sanitizedData.image_url)) {
          return res.status(400).json({ 
            message: "Format image URL tidak valid" 
          });
        }
      }

   
      const clientIP = req.ip;
      const cacheKey = `createLaptop:${clientIP}`;
      const requestCount = myCache.get(cacheKey) || 0;
      
      if (requestCount > 10) { 
        return res.status(429).json({ 
          message: "Terlalu banyak request. Coba lagi nanti." 
        });
      }
      
      myCache.set(cacheKey, requestCount + 1, 3600); 

     
      const newLaptop = await LaptopModel.createLaptop(sanitizedData);
      console.log("Laptop berhasil dibuat:", newLaptop);

   
      myCache.del("laptops:all");

      res.status(201).json({
        message: "Laptop berhasil dibuat",
        laptop: newLaptop,
      });
    } catch (error) {
      console.error("Error saat membuat laptop:", error);
      res.status(500).json({
        message: "Gagal membuat laptop",
        error: "Terjadi kesalahan internal server"
      });
    }
  },
  async getLaptopById(req, res) {
    try {
      const { id } = req.params;
      const cachedLaptop = myCache.get(`laptop:${id}`);

      if (cachedLaptop) {
        return res.status(200).json({ laptops: cachedLaptop });
      }

      if (!id) {
        return res.status(400).json({
          message: "masukkan id yang valid",
        });
      }
      const laptopDetail = await LaptopModel.getLaptopById(id);

      if (!laptopDetail) {
        return res.status(404).json({ message: "Laptop tidak ditemukan" });
      }

      myCache.set(`laptop:${id}`, laptopDetail, 3600);
      res.status(200).json({ laptops: laptopDetail });
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
