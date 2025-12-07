// ReportPage.js (KODE LENGKAP DENGAN FOTO DIGABUNG)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = "http://localhost:3001/api/reports";
const SERVER_BASE_URL = "http://localhost:3001"; 

function ReportPage() {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Modal image
    const [selectedImage, setSelectedImage] = useState(null);

    const openImage = (url) => setSelectedImage(url);
    const closeImage = () => setSelectedImage(null);

    const fetchReports = async (nameQuery, start, end) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/login");

            const decoded = jwtDecode(token);
            if (decoded.role !== "admin") {
                setError("Akses ditolak. Hanya admin.");
                return;
            }

            const response = await axios.get(`${API_URL}/daily`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { nama: nameQuery, startDate: start, endDate: end },
            });

            setReports(response.data.data || []);
            setError(null);
        } catch (err) {
            const msg = err.response ? err.response.data.message : "Server error";
            setError(msg);
        }
    };

    useEffect(() => {
        fetchReports(searchTerm, startDate, endDate);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchReports(searchTerm, startDate, endDate);
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Laporan Presensi Harian</h1>

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="mb-6 flex flex-col space-y-4">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <button className="px-4 bg-blue-600 text-white rounded-md">Cari</button>
                </div>

                <div className="flex space-x-4 items-center">
                    <label className="text-gray-700">Filter Tanggal:</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                 className="px-3 py-2 border rounded-md" />
                    <span>s/d</span>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                                 className="px-3 py-2 border rounded-md" />
                </div>
            </form>

            {error && <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</p>}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2">Nama</th>
                            <th className="px-4 py-2">Check-In</th>
                            {/* HANYA ADA SATU KOLOM FOTO */}
                            <th className="px-4 py-2">Bukti Foto</th> 
                            <th className="px-4 py-2">Check-Out</th>
                            {/* KOLOM FOTO CHECK-OUT DIHAPUS DARI HEADER */}
                        </tr>
                    </thead>

                    <tbody>
                        {reports.length > 0 ? (
                            reports.map((p) => (
                                <tr key={p.id} className="border-t">
                                    <td className="px-4 py-2">{p.user?.nama}</td>

                                    <td className="px-4 py-2">
                                        {new Date(p.checkIn).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}
                                    </td>

                                    {/* Kolom Bukti Foto (menggabungkan Check-In dan Check-Out) */}
                                    <td className="px-4 py-2">
                                        {/* Tampilkan Foto Check-In */}
                                        <div className="flex flex-col space-y-2">
                                            <span className="text-xs font-semibold text-gray-500">Check-In:</span>
                                            {p.foto_check_in ? (
                                                <img
                                                    src={`${SERVER_BASE_URL}${p.foto_check_in}`} 
                                                    className="w-16 cursor-pointer rounded shadow"
                                                    onClick={() => openImage(`${SERVER_BASE_URL}${p.foto_check_in}`)}
                                                    alt="check-in"
                                                />
                                            ) : (
                                                <span className="text-gray-400 text-sm">Tidak ada foto</span>
                                            )}
                                        </div>

                                        {/* Tambahkan pemisah */}
                                        <hr className="my-2 border-gray-200" />
                                        
                                        {/* Tampilkan Foto Check-Out */}
                                        <div className="flex flex-col space-y-2">
                                            <span className="text-xs font-semibold text-gray-500">Check-Out:</span>
                                            {p.foto_check_out ? (
                                                <img
                                                    src={`${SERVER_BASE_URL}${p.foto_check_out}`} 
                                                    className="w-16 cursor-pointer rounded shadow"
                                                    onClick={() => openImage(`${SERVER_BASE_URL}${p.foto_check_out}`)}
                                                    alt="check-out"
                                                />
                                            ) : (
                                                <span className="text-gray-400 text-sm">Tidak ada foto</span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-4 py-2">
                                        {p.checkOut
                                            ? new Date(p.checkOut).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
                                            : "Belum Check-Out"}
                                    </td>

                                    {/* Thumbnail Check-Out ASLI DIHAPUS */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                {/* colSpan diubah menjadi 4 karena hanya ada 4 kolom sekarang */}
                                <td colSpan="4" className="text-center p-4">
                                    Tidak ada data ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL IMAGE */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={closeImage}
                >
                    <img
                        src={selectedImage}
                        className="max-w-3xl max-h-[90vh] rounded shadow-lg"
                        alt="Full"
                    />
                </div>
            )}
        </div>
    );
}

export default ReportPage;