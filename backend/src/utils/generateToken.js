import jwt from 'jsonwebtoken';


export function generateToken(user) {
const payload = { sub: user._id, email: user.email, name: user.name };
return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}