const { db } = require("../config/firebase");

const PackageModel = {
  // ambil package nya
  async getAllPackages(limit, offset) {
    const snapshot = await db
      .collection("packages")
      .orderBy("id")
      .offset(offset)
      .limit(limit)
      .get();

    if (snapshot.empty) return [];

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      const packageId = parseInt(doc.id);

      const components = {
        monitor: data.components?.monitor || {},
        keyboard: data.components?.keyboard || null,
        mouse: data.components?.mouse || null,
        mouse_pad: data.components?.mouse_pad || null,
        others: data.components?.others || {},
      };

      return {
        id: packageId,
        ...data,
        components,
      };
    });
  },

  async getPackageById(id) {
    const docRef = db.collection("packages").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error(`Package dengan id: ${id} tidak ditemukan.`);
    }

    const data = doc.data();

    const components = {
      monitor: data?.components?.monitor || {},
      keyboard: data?.components?.keyboard || null,
      mouse: data?.components?.mouse || null,
      mouse_pad: data?.components?.mouse_pad || null,
      others: data?.components?.others || {},
    };

    return {
      id: doc.id,
      ...data,
      components,
    };
  },

  async createPackage(packageData) {
    try {
      if (!packageData.name) {
        throw new Error("Package name is required");
      }

      const docRef = db.collection("packages").doc();

      const components = {
        monitor: packageData.components?.monitor || {},
        keyboard: packageData.components?.keyboard || null,
        mouse: packageData.components?.mouse || null,
        mouse_pad: packageData.components?.mouse_pad || null,
        others: packageData.components?.others || {},
      };

      const newPackage = {
        id: docRef.id,
        name: packageData.name,
        description: packageData.description || "",
        components,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await docRef.set(newPackage);

      return {
        id: docRef.id,
        ...newPackage,
      };
    } catch (error) {
      console.error("Error creating package:", error);
      throw error;
    }
  },

  async updatePackage(id, updateData) {
    try {
      const docRef = db.collection("packages").doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error(`Package with id: ${id} not found`);
      }

      await docRef.update({
        ...updateData,
        updatedAt: new Date().toISOString(),
      });

      const updatedDoc = await docRef.get();
      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      };
    } catch (error) {
      throw error;
    }
  },

  async deletePackage(id) {
    try {
      const docRef = db.collection("packages").doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error(`Package with id: ${id} not found`);
      }

      await docRef.delete();
      return true;
    } catch (error) {
      throw error;
    }
  },

  async importPackages(packages) {
    for (const [index, item] of packages.entries()) {
      const id = item.id ? String(item.id) : `package-${index + 1}`;
      console.log(`Assigning ID: ${id} for package`, item);

      const docRef = db.collection("packages").doc(id);
      await docRef.set({ ...item, id });
    }
  },
};

module.exports = PackageModel;
