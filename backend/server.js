import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 8080;

(async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`✅ API listening on port ${PORT}`));
  } catch (e) {
    console.error('❌ Failed to start server:', e);
    process.exit(1);
  }
})();