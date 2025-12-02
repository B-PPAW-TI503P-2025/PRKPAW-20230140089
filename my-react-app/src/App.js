// src/App.js (Versi Final)

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Import komponen yang sudah ada
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage'; // Dianggap sebagai halaman utama setelah login

// Import komponen baru dari UCP 1
import Navbar from './components/Navbar';
import PresensiPage from './components/PresensiPage';
import ReportPage from './components/ReportPage';

// --- Component Pelindung Rute ---
// Memastikan user sudah login (memiliki token di localStorage)
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Jika token tidak ada, arahkan ke login
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <Router>
            {/* Navbar ditampilkan di luar Routes agar muncul di semua halaman */}
            {/* Navbar yang baru sudah memiliki logic untuk menampilkan/menyembunyikan Logout/Login */}
            <Navbar /> 
            
            <div className="pt-4"> {/* Tambahkan padding agar konten tidak tertutup navbar */}
                <Routes>
                    {/* 1. Rute Publik (Tanpa perlu token) */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* 2. Rute yang Dilindungi (Perlu token) */}
                    
                    {/* Rute lama yang dilindungi */}
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        } 
                    />
                    
                    {/* Rute UCP 1 - Presensi */}
                    <Route 
                        path="/presensi" 
                        element={
                            <ProtectedRoute>
                                <PresensiPage />
                            </ProtectedRoute>
                        } 
                    />
                    
                    {/* Rute UCP 1 - Laporan Admin (Di dalamnya ada cek role admin) */}
                    <Route 
                        path="/reports" 
                        element={
                            <ProtectedRoute>
                                <ReportPage />
                            </ProtectedRoute>
                        } 
                    />

                    {/* 3. Rute Default/Home */}
                    {/* Arahkan root path ke Dashboard (jika login) atau Login (jika belum) */}
                    <Route 
                        path="/" 
                        element={
                            localStorage.getItem('token') ? (
                                <Navigate to="/dashboard" replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        } 
                    />
                    
                    {/* Rute Catch-all untuk halaman yang tidak ditemukan */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;