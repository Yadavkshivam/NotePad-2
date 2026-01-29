import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';


export default function Navbar() {
const { user, logout, token } = useAuth();
const nav = useNavigate();


function handleLogout() {
logout();
nav('/login');
}


return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-gradient-to-r from-indigo-50 via-white/80 to-purple-50 border-b border-indigo-100 shadow-sm">
        <div className="w-full px-6 sm:px-10 lg:px-16">
            <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <Link to="/" className="no-underline group">
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-pink-500 to-purple-600 flex items-center gap-2 transition-all duration-300 group-hover:scale-105">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-pink-500 text-white shadow-md text-2xl">📝</span>
                        Notes
                    </h3>
                </Link>
                
                {/* Nav Items */}
                <div className="flex items-center gap-4">
{token ? (
<>
    <span className="text-sm text-gray-600 font-medium hidden sm:inline-flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-sm" aria-hidden="true" />
        👋 Hi, <span className="text-indigo-600 font-semibold">{user?.name || user?.email}</span>
    </span>
    <button 
        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm transform transition duration-200 hover:bg-indigo-50 hover:text-indigo-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        onClick={handleLogout}
    >
        Logout
    </button>
</>
) : (
<>
    <Link to="/login">
        <button className="px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-100/60 border border-indigo-200 rounded-lg transform transition duration-200 hover:bg-indigo-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-200">
            Login
        </button>
    </Link>
    <Link to="/signup">
        <button className="px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md transform transition duration-200 bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-600 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-200">
            Signup
        </button>
    </Link>
</>
)}
                </div>
            </div>
        </div>
    </nav>
);
}