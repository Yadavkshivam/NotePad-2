import React, { useState } from 'react';
import { requestOtp, verifyOtp } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "react-toastify";


export default function Login() {
const [email, setEmail] = useState('');
const [otp, setOtp] = useState('');
const [stage, setStage] = useState('email');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const { login } = useAuth();
const nav = useNavigate();




async function sendOtp(e) {
e.preventDefault();
setError('');
setLoading(true);
try {
const otpResult = await requestOtp(email);

console.log(otpResult.otp)
toast.success(`This is required otp : ${otpResult.otp}`);
setStage('otp');
} catch (e) {
setError(e?.response?.data?.message || 'Failed to send OTP');
} finally { setLoading(false); }
}


async function handleVerify(e) {
e.preventDefault();
setError('');
setLoading(true);
try {
const { token, user } = await verifyOtp(email, otp);
login(token, user);
nav('/dashboard');
} catch (e) {
setError(e?.response?.data?.message || 'Invalid OTP');
} finally { setLoading(false); }
}


return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 p-5">
  <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-10 w-full max-w-md shadow-2xl animate-[slideUp_0.6s_ease-out]">
    
    {/* Icon */}
    <div className="text-5xl text-center mb-4 animate-bounce">
      {stage === 'email' ? '📧' : '🔐'}
    </div>
    
    {/* Header */}
    <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
      Welcome Back
    </h2>
    <p className="text-sm text-gray-500 text-center mb-8">
      {stage === 'email' ? 'Enter your email to receive OTP' : 'Enter the OTP sent to your email'}
    </p>
    
    {/* Stage Indicator */}
    <div className="flex justify-center gap-2 mb-6">
      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
        stage === 'email' 
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 scale-125' 
          : 'bg-gray-200'
      }`}></div>
      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
        stage === 'otp' 
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 scale-125' 
          : 'bg-gray-200'
      }`}></div>
    </div>

    {/* Error Message */}
    {error && (
      <div className="bg-gradient-to-r from-red-100 to-red-200 border border-red-400 rounded-xl p-3 mb-6 text-red-600 text-sm animate-[shake_0.5s_ease-in-out]">
        {error}
      </div>
    )}


{stage === 'email' ? (
<form onSubmit={sendOtp} className="space-y-5">
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Email Address
    </label>
    <input 
      className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 bg-gray-50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-gray-300"
      type="email" 
      placeholder="you@example.com" 
      value={email} 
      onChange={e => setEmail(e.target.value)} 
      required 
    />
  </div>
  <button 
    className={`w-full py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/40 transition-all duration-300 ${
      loading 
        ? 'opacity-70 cursor-not-allowed' 
        : 'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/50 active:translate-y-0'
    }`}
    disabled={loading}
  >
    {loading ? '✨ Sending...' : 'Send OTP →'}
  </button>
</form>
) : (

<form onSubmit={handleVerify} className="space-y-5">
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      One-Time Password
    </label>
    <input 
      className="w-full px-4 py-3.5 text-2xl font-semibold text-center tracking-[0.5em] border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 bg-gray-50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-gray-300"
      type="text" 
      placeholder="••••••" 
      value={otp} 
      onChange={e => setOtp(e.target.value)} 
      required 
    />
  </div>
  <button 
    className={`w-full py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/40 transition-all duration-300 ${
      loading 
        ? 'opacity-70 cursor-not-allowed' 
        : 'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/50 active:translate-y-0'
    }`}
    disabled={loading}
  >
    {loading ? '🔄 Verifying...' : '✓ Verify & Login'}
  </button>
</form>
)}

 

<p className="text-center mt-7 text-sm text-gray-500">
  Don't have an account?{' '}
  <Link 
    to="/signup" 
    className="text-indigo-500 font-semibold no-underline transition-all duration-300 hover:text-purple-600 hover:underline"
  >
    Sign up
  </Link>
</p>
  </div>
</div>
);
}