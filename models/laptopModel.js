const { getLaptopById } = require('../controllers/laptopControllers')
const db = require('../firebase')

const LaptopModel = {
    async getAllLaptop(){
        const snapshot = await db.collection('laptops').get()
        if(snapshot.empty) return []

        return snapshot.docs.map((doc) => {
            const data = doc.data()

            const laptops = {
                id: data?.id || null,
                brand: data?.brand || null,
                model_name: data?.model_name || null,
                ram: data?.ram || null,
                display: data?.display || null,
                memory: data?.memory || null,
                refresh_rate: data?.refresh_rate || null,
                price: data?.price || null,
                image_url: data?.image_url || null
            }

            return {
                ...laptops
            }
        })
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

    async importLaptops(laptops){
        for (const [index, item] of laptops.entries()) {
            const id = item.id ? Number(item.id) : `laptop-${index + 1}`;
            console.log(`Assigning ID: ${id} for laptop`, item);
        
            const docRef = db.collection('laptops').doc(id);
            await docRef.set({ ...item, id }); 
        }
    }
}

module.exports = LaptopModel