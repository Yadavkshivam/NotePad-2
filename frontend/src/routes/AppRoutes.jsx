import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import NotFound from '../pages/NotFound.jsx';
import { useAuth } from '../context/AuthContext.jsx';


function PrivateRoute({ children }) {
const { token } = useAuth();
return token ? children : <Navigate to="/login" replace />;
}


export default function AppRoutes() {
return (
<Routes>
<Route path="/" element={<Navigate to="/dashboard" replace />} />
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
<Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
<Route path="*" element={<NotFound />} />
</Routes>
);
}