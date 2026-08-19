const db = require('../models');

async function connectDatabase() {
  try {
    await db.sequelize.authenticate();
    console.log('Database connected successfully');
    
    // Gunakan sync biasa (alter: true di serverless bisa memicu masalah performa/lock)
    await db.sequelize.sync();
    console.log('Database synchronized');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    // JANGAN gunakan process.exit(1) di Vercel / Serverless!
    throw err; // Lempar error ke middleware index.js agar ditangkap dengan res.status(500)
  }
}

module.exports = connectDatabase;