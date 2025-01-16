const db = require('../firebase')

const PackageModel = {
    // ambil package nya
    async getAllPackages(limit, offset){
        const snapshot = await db.collection('packages')
        .orderBy('id')
        .offset(offset)
        .limit(limit)
        .get();

        if(snapshot.empty) return []

        return snapshot.docs.map((doc) => {
            const data = doc.data()

            const components = {
              laptop: data.components?.laptop || null,
              monitor: data.components?.monitor || {},
              keyboard: data.components?.keyboard || null,
              mouse: data.components?.mouse || null,
              mouse_pad: data.components?.mouse_pad || null,
              others: data.components?.others || {}
            }

            return {
              id: doc.id,
              ...data,
              components, 
            };
        })
    }, 

    async getPackageById(id){
      const docRef = db.collection('packages').doc(id)
      const doc = await docRef.get()

      if(!doc.exists){
        throw new Error(`Package dengan id: ${id} tidak ditemukan.`)
      }

      const data = doc.data()

      const components = {
        laptop: data ?.components?.laptop || null,
        monitor: data ?.components?.monitor || {},
        keyboard: data ?.components?.keyboard || null,
        mouse: data ?.components?.mouse || null,
        mouse_pad: data ?.components?.mouse_pad || null,
        others: data ?.components?.others || {}
      }

      return {
        id: doc.id,
        ...data,
        components
      }
    },

    // import package
    async importPackages(packages) {
      for (const [index, item] of packages.entries()) {
        
        const id = item.id ? String(item.id) : `package-${index + 1}`;
        console.log(`Assigning ID: ${id} for package`, item);
    
        const docRef = db.collection('packages').doc(id);
        await docRef.set({ ...item, id }); 
      }
    }
    
    
  }
 

module.exports = PackageModel