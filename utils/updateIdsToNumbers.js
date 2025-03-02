const db = require('./firebase.js')

async function updateIdsToNumbers(){
    try{
      const snapshot = await db.collection('packages').get()

      for (const doc of snapshot.docs){
        const data = doc.data()

        if(typeof data.id === 'string'){
          const numericId = Number(data.id)
          console.log(`Updating ID: ${numericId} for package`, data)

          await db.collection('packages')
          .doc(doc.id)
          .update({
            id: numericId,
          })
          
        }
      }

      console.log('Semua ID berhasil diperbarui menjadi angka.');
    } catch (error) {
      console.error(`Terjadi kesalahan: ${error}`);
    }

  }
  
  updateIdsToNumbers();