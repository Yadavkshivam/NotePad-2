import dotenv from 'dotenv';
dotenv.config();


import app from './app.js';
import connectDB from './src/config/db.js';

(async function start() {
try {
await connectDB();

app.listen(8080, () => console.log(`API listening on http://localhost:8080`));
} catch (e) {
console.error('Failed to start server now', e);
process.exit(1);
}
})();