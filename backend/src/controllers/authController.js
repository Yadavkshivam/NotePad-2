import User from '../models/User.js';
import { createAndSendOtp, verifyOtp as verifyOtpCode } from '../utils/sendOtp.js';
import { generateToken } from '../utils/generateToken.js';


export async function requestOtp(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otp = await createAndSendOtp(email.toLowerCase());

    return res.json({ otp, message: 'This is backend' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
}


export async function verifyOtp(req, res) {
  try {
    const { email, otp, name } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

    const ok = verifyOtpCode(email.toLowerCase(), otp);
    if (!ok) return res.status(400).json({ message: 'Invalid or expired OTP' });

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({ email: email.toLowerCase(), name: name || 'User' });
    }

    const token = generateToken(user);

    return res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Failed to verify OTP' });
  }
}
 