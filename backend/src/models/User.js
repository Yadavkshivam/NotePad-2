import mongoose from 'mongoose';


const userSchema = new mongoose.Schema(
{
email: { type: String, required: true, unique: true, lowercase: true },
name: { type: String },
// For real OTP via email/SMS you’d store verification states
googleId: { type: String }
},
{ timestamps: true }
);


export default mongoose.model('User', userSchema);