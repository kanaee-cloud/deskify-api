const { db } = require('./config/firebase'); // Sesuaikan path jika berbeda

async function fixLaptopIds() {
    try {
        const snapshot = await db.collection('laptops').get();
        const batch = db.batch(); // Gunakan batch untuk efisiensi
        
        let updates = 0;

        for (const doc of snapshot.docs) {
            const data = doc.data();
            let currentId = data.id;

            if (!currentId) continue; // Lewati jika ID tidak ada
            
            // Pastikan ID berupa string dan tambahkan padding jika kurang dari 3 digit
            const newId = String(currentId).padStart(3, '0');

            if (newId !== currentId) {
                console.log(`Updating ID: ${currentId} → ${newId}`);

                // Buat dokumen baru dengan ID yang benar
                const newDocRef = db.collection('laptops').doc(newId);
                batch.set(newDocRef, { ...data, id: newId });

                // Hapus dokumen lama
                batch.delete(doc.ref);
                updates++;
            }
        }

        if (updates > 0) {
            await batch.commit();
            console.log(`✅ Successfully updated ${updates} laptop IDs.`);
        } else {
            console.log("✅ All laptop IDs are already correct.");
        }

    } catch (error) {
        console.error("❌ Error fixing laptop IDs:", error);
    }
}

// Jalankan script
fixLaptopIds();
