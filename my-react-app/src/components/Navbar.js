// src/components/Navbar.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Pastikan sudah diinstal: npm install jwt-decode

const Navbar = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('Guest');
    const [isAdmin, setIsAdmin] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            try {
                // Menggunakan jwtDecode untuk membaca payload token
                const decoded = jwtDecode(token);
                // Asumsi payload JWT memiliki 'nama' dan 'role'
                setUserName(decoded.nama || 'User');
                setIsAdmin(decoded.role === 'admin');
            } catch (error) {
                console.error("Gagal decode token:", error);
                // Jika token rusak, paksa logout
                handleLogout(); 
            }
        } else {
            setUserName('Guest');
            setIsAdmin(false);
        }
    }, [token]);

    const handleLogout = () => {
        // Menghapus token dari localStorage
        localStorage.removeItem('token');
        // Reset state
        setUserName('Guest');
        setIsAdmin(false);
        // Navigasi ke halaman login
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 p-4 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-xl font-bold">
                    Aplikasi Presensi
                </Link>
                <div className="flex items-center space-x-4">
                    <Link to="/presensi" className="text-gray-300 hover:text-white">
                        Presensi
                    </Link>

                    {/* Tampilkan menu "Laporan Admin" hanya jika isAdmin true */}
                    {isAdmin && (
                        <Link to="/reports" className="text-gray-300 hover:text-white font-bold">
                            Laporan Admin
                        </Link>
                    )}

                    {token && (
                        <span className="text-white font-medium">
                            Halo, **{userName}**
                        </span>
                    )}

                    {/* Tombol Logout */}
                    {token ? (
                        <button
                            onClick={handleLogout}
                            className="py-2 px-3 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 transition duration-150"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="py-2 px-3 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;