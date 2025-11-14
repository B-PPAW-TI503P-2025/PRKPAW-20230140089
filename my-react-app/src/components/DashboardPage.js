import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Ambil nama user dari localStorage
    const storedName = localStorage.getItem("username");

    if (!storedName) {
      // Jika tidak ada data user, arahkan ke login
      navigate("/login");
      return;
    }

    setUsername(storedName);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-blue-200 flex flex-col items-center justify-center p-6">

      <div className="bg-white w-full max-w-xl p-10 rounded-2xl shadow-xl text-center border">
        <h1 className="text-4xl font-extrabold text-green-700 mb-4">
          Selamat Datang, {username} 🎉
        </h1>

        <p className="text-lg text-gray-700 mb-8">
          Anda berhasil login! Ini adalah halaman dashboard utama.
        </p>

        <button
          onClick={handleLogout}
          className="py-2 px-6 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
