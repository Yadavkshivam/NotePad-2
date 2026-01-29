import jwt from 'jsonwebtoken';


export function requireAuth(req, res, next) {
try {
const auth = req.headers.authorization || '';
const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;
if (!token) return res.status(401).json({ message: 'No token provided' });
const payload = jwt.verify(token, process.env.JWT_SECRET);
req.user = payload; // { sub, email, name }
next();
} catch (err) {
return res.status(401).json({ message: 'Invalid or expired token' });
}
}