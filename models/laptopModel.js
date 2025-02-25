const { db } = require('../config/firebase')

const LaptopModel = {
    async getAllLaptop(){
        const snapshot = await db.collection('laptops').orderBy('id').get()
        if(snapshot.empty) return []

        return snapshot.docs.map((doc) => {
            const data = doc.data()

            const laptopId = parseInt(data?.id);

            const laptops = {
                id: laptopId || null,
                brand: data?.brand || null,
                model_name: data?.model_name || null,
                ram: data?.ram || null,
                display: data?.display || null,
                memory: data?.memory || null,
                refresh_rate: data?.refresh_rate || null,
                price: data?.price || null,
                image_url: data?.image_url || null,
                processor: data?.processor || null,
                gpu: data?.gpu || null
            }

            return {
                ...laptops
            }
        })
    },

    async deleteLaptop(id) {
        try {
          const docRef = db.collection("laptops").doc(id);
          const doc = await docRef.get();
    
          if (!doc.exists) {
            throw new Error(`Laptop with id: ${id} not found`);
          }
    
          await docRef.delete();
          return true;
        } catch (error) {
          throw error;
        }
      },

    async getLaptopById(id){
        const docRef = db.collection('laptops').doc(id)
        const doc = await docRef.get()

        if(!doc.exists){
            throw new Error(`Laptop dengan id : ${id} tidak ada`)
        }

        const data = doc.data()

        return {
            ...data
        }
    },

    async createLaptop(laptopData) {
        try {
            
            const snapshot = await db.collection('laptops').orderBy('id').get();
            let maxId = 0;
            
            
            if (!snapshot.empty) {
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const currentId = parseInt(data.id);
                    if (!isNaN(currentId) && currentId > maxId) {
                        maxId = currentId;
                    }
                });
            }
            
          
            const newId = String(maxId + 1).padStart(3, '0');
    
            const laptop = {
                id: newId,
                brand: laptopData.brand || null,
                model_name: laptopData.model_name || null,
                ram: laptopData.ram || null,
                display: laptopData.display || null,
                memory: laptopData.memory || null,
                refresh_rate: laptopData.refresh_rate || null,
                price: laptopData.price || null,
                image_url: laptopData.image_url || null,
                processor: laptopData.processor || null,
                gpu: laptopData.gpu || null
            };
    
            await db.collection('laptops').doc(newId).set(laptop);
            return laptop;
        } catch (error) {
            throw error;
        }
    },
    
    async updateLaptop(id, updatedData) {
        try {
          const docRef = db.collection('laptops').doc(id);
          const doc = await docRef.get();
      
          if (!doc.exists) {
            throw new Error(`Laptop dengan id: ${id} tidak ditemukan`);
          }
      
          const filteredUpdate = Object.keys(updatedData).reduce((obj, key) => {
            if (updatedData[key] !== undefined && key !== 'id') { 
              obj[key] = updatedData[key];
            }
            return obj;
          }, {});
      
          await docRef.update(filteredUpdate);
          
          const updatedDoc = await docRef.get();
          return updatedDoc.data();
        } catch (error) {
          throw error;
        }
      },

    async importLaptops(laptops){
        for (const [index, item] of laptops.entries()) {
            const id = item.id ? String(item.id) : `laptop-${index + 1}`;
            console.log(`Assigning ID: ${id} for laptop`, item);
        
            const docRef = db.collection('laptops').doc(id);
            await docRef.set({ ...item, id }); 
        }
    }
}

module.exports = LaptopModel