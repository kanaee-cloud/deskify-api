const bcrypt = require('bcryptjs');
const { db } = require('../config/firebase.js');

const ADMIN_COLLECTION = 'admins';

const createAdmin = async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection(ADMIN_COLLECTION).doc(email).set({ email, password: hashedPassword });
    return {
        email,
        message: "Admin created successfully"
    }
};

const getAdminByEmail = async (email) => {
    const adminDoc = await db.collection(ADMIN_COLLECTION).doc(email).get();
    return adminDoc.exists? adminDoc.data() : null;
};

const verifyAdmin = async(email, password) => {
    const adminData = await getAdminByEmail(email);
    if(!adminData) return false;

    const isMatch = await bcrypt.compare(password, adminData.password);
    return isMatch ? adminData : false;
};

module.exports = { createAdmin, getAdminByEmail, verifyAdmin };