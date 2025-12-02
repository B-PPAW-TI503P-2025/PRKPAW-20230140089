// src/components/ReportPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = "http://localhost:3001/api/reports";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  // State untuk filter tanggal
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Handler untuk memanggil fetchReports saat tanggal atau pencarian berubah
  const fetchReports = async (nameQuery, start, end) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      // Pemeriksaan awal, walau middleware backend harusnya sudah melindungi
      if (decoded.role !== 'admin') {
        setError("Akses ditolak. Hanya untuk admin.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          nama: nameQuery,
          startDate: start,
          endDate: end,
        }
      };

      // Panggil GET /api/reports/daily dengan query parameters
      const response = await axios.get(`${API_URL}/daily`, config);
      setReports(response.data.data || response.data); 
      setError(null);
    } catch (err) {
      const msg = err.response ? err.response.data.message : "Gagal memuat laporan. Server tidak merespons.";
      setError(msg);
      setReports([]);
    }
  };

  useEffect(() => {
    // Panggil fetchReports saat komponen dimuat, dengan parameter awal kosong
    fetchReports(searchTerm, startDate, endDate);
  }, [navigate]); // navigate disertakan di dependency array hanya untuk kepatuhan React

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Panggil ulang fetchReports dengan state saat ini (termasuk tanggal)
    fetchReports(searchTerm, startDate, endDate);
  };

  // Handler untuk perubahan filter tanggal
  const handleFilterChange = (setter, value) => {
    setter(value);
  };
  
  // Efek samping untuk menjalankan pencarian segera setelah startDate atau endDate berubah
  useEffect(() => {
      // Hanya jalankan jika salah satu state berubah dan bukan inisialisasi awal
      fetchReports(searchTerm, startDate, endDate);
  }, [startDate, endDate]);
  

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Laporan Presensi Harian
      </h1>

      {/* Form Pencarian dan Filter Tanggal */}
      <form onSubmit={handleSearchSubmit} className="mb-6 flex flex-col space-y-4">
        {/* Pencarian Nama */}
        <div className="flex space-x-2">
            <input
                type="text"
                placeholder="Cari berdasarkan nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm
                focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
                type="submit"
                className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm
                hover:bg-blue-700"
            >
                Cari
            </button>
        </div>
        
        {/* Filter Tanggal */}
        <div className="flex space-x-4 items-center">
            <label className="text-gray-700">Filter Tanggal:</label>
            <input
                type="date"
                value={startDate}
                onChange={(e) => handleFilterChange(setStartDate, e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-gray-500">s/d</span>
            <input
                type="date"
                value={endDate}
                onChange={(e) => handleFilterChange(setEndDate, e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
      </form>

      {error && (
        <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</p>
      )}

      {!error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-Out
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length > 0 ? (
                reports.map((presensi) => (
                  <tr key={presensi.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {presensi.user ? presensi.user.nama : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(presensi.checkIn).toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.checkOut
                        ? new Date(presensi.checkOut).toLocaleString("id-ID", {
                            timeZone: "Asia/Jakarta",
                          })
                        : "Belum Check-Out"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReportPage;