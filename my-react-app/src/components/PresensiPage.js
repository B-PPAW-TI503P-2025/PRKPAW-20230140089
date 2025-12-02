// src/components/PresensiPage.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const getToken = () => localStorage.getItem("authToken");

const API_URL = "http://localhost:3001/api/presensi";

function PresensiPage() {
  const [coords, setCoords] = useState(null); // {lat, lng}
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fungsi mendapatkan lokasi user
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Browser tidak mendukung geolocation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        setError("Gagal mendapatkan lokasi: " + err.message);
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  // Kirim request check-in / check-out
  const sendRequest = async (url) => {
    try {
      setMessage("");
      setError("");

      if (!coords) {
        setError("Lokasi belum tersedia. Izinkan akses lokasi.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const response = await axios.post(
        url,
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        config
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal melakukan presensi");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        Lakukan Presensi
      </h2>

      {/* MAP */}
      {coords && (
        <div className="w-full max-w-xl my-4 border rounded-lg overflow-hidden shadow-md">
          <MapContainer
            center={[coords.lat, coords.lng]}
            zoom={15}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[coords.lat, coords.lng]}>
              <Popup>Lokasi Anda saat ini</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {/* Card Check-in Checkout */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        {message && <p className="text-green-600 mb-4 font-semibold">{message}</p>}
        {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}

        <div className="flex space-x-4">
          <button
            onClick={() => sendRequest(`${API_URL}/check-in`)}
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
          >
            Check-In
          </button>

          <button
            onClick={() => sendRequest(`${API_URL}/check-out`)}
            className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
          >
            Check-Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;
