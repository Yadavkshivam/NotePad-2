import React, { useState } from 'react';
import { requestOtp, verifyOtp } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';


export default function Signup() {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [otp, setOtp] = useState('');
const [stage, setStage] = useState('form');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const { login } = useAuth();
const nav = useNavigate();


async function sendOtp(e) {
e.preventDefault();
setError('');
setLoading(true);
try {
const otpresult=await requestOtp(email);
console.log(otpresult.otp);
alert(`Please note down the otp for future purpose : ${otpresult.otp}`);
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
const { token, user } = await verifyOtp(email, otp, name);
login(token, user);
nav('/dashboard');
} catch (e) {
setError(e?.response?.data?.message || 'Invalid OTP');
} finally { setLoading(false); }
}


return (
<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-600 via-indigo-500 to-blue-500 p-5">
  <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-10 w-full max-w-md shadow-2xl animate-[slideUp_0.6s_ease-out]">
    
    {/* Icon */}
    <div className="text-5xl text-center mb-4 animate-bounce">
      {stage === 'form' ? '✨' : '🔐'}
    </div>
    
    {/* Header */}
    <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
      Create Account
    </h2>
    <p className="text-sm text-gray-500 text-center mb-8">
      {stage === 'form' ? 'Fill in your details to get started' : 'Enter the OTP sent to your email'}
    </p>
    
    {/* Stage Indicator */}
    <div className="flex justify-center gap-2 mb-6">
      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
        stage === 'form' 
          ? 'bg-linear-to-r from-purple-500 to-indigo-600 scale-125' 
          : 'bg-gray-200'
      }`}></div>
      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
        stage === 'otp' 
          ? 'bg-linear-to-r from-purple-500 to-indigo-600 scale-125' 
          : 'bg-gray-200'
      }`}></div>
    </div>

    {/* Error Message */}
    {error && (
      <div className="bg-linear-to-r from-red-100 to-red-200 border border-red-400 rounded-xl p-3 mb-6 text-red-600 text-sm animate-[shake_0.5s_ease-in-out]">
        {error}
      </div>
    )}


{stage === 'form' ? (
<form onSubmit={sendOtp} className="space-y-5">
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Full Name
    </label>
    <input 
      className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 bg-gray-50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 hover:border-gray-300"
      type="text" 
      placeholder="Enter your name" 
      value={name} 
      onChange={e => setName(e.target.value)} 
      required 
    />
  </div>
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Email Address
    </label>
    <input 
      className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 bg-gray-50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 hover:border-gray-300"
      type="email" 
      placeholder="you@example.com" 
      value={email} 
      onChange={e => setEmail(e.target.value)} 
      required 
    />
  </div>
  <button 
    className={`w-full py-4 text-base font-semibold text-white bg-linear-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/40 transition-all duration-300 ${
      loading 
        ? 'opacity-70 cursor-not-allowed' 
        : 'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/50 active:translate-y-0'
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
      className="w-full px-4 py-3.5 text-2xl font-semibold text-center tracking-[0.5em] border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 bg-gray-50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 hover:border-gray-300"
      type="text" 
      placeholder="••••••" 
      value={otp} 
      onChange={e => setOtp(e.target.value)} 
      required 
    />
  </div>
  <button 
    className={`w-full py-4 text-base font-semibold text-white bg-linear-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/40 transition-all duration-300 ${
      loading 
        ? 'opacity-70 cursor-not-allowed' 
        : 'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/50 active:translate-y-0'
    }`}
    disabled={loading}
  >
    {loading ? '🔄 Verifying...' : '✓ Verify & Create'}
  </button>
</form>
)}


<p className="text-center mt-7 text-sm text-gray-500">
  Already have an account?{' '}
  <Link 
    to="/login" 
    className="text-purple-500 font-semibold no-underline transition-all duration-300 hover:text-indigo-600 hover:underline"
  >
    Login
  </Link>
</p>
  </div>
</div>
);
}