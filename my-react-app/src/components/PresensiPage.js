// src/components/PresensiPage.js

import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const getToken = () => localStorage.getItem("authToken");
const API_URL = "http://localhost:3001/api/presensi";

function PresensiPage() {
  const [coords, setCoords] = useState(null);
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ======================
  // Ambil Lokasi
  // ======================
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
      (err) => setError("Gagal mendapatkan lokasi: " + err.message)
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  // ======================
  // Ambil Foto dari Webcam
  // ======================
  const capture = useCallback(() => {
    const imgSrc = webcamRef.current.getScreenshot();
    setImage(imgSrc);
  }, [webcamRef]);

  // ======================
  // CHECK-IN (dengan foto)
  // ======================
  const handleCheckIn = async () => {
    setMessage("");
    setError("");

    if (!coords) return setError("Lokasi belum tersedia.");
    if (!image) return setError("Foto wajib diambil sebagai bukti!");

    try {
      const blob = await (await fetch(image)).blob();

      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", blob, "selfie.jpg");

      const response = await axios.post(
        `${API_URL}/check-in`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal melakukan check-in");
    }
  };

  // ======================
  // CHECK-OUT (tanpa foto)
  // ======================
  const handleCheckOut = async () => {
    setMessage("");
    setError("");

    if (!coords) return setError("Lokasi belum tersedia.");

    try {
      const response = await axios.post(
        `${API_URL}/check-out`,
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal check-out");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Lakukan Presensi</h2>

      {/* ======================
           MAP AREA
      ====================== */}
      {coords && (
        <div className="w-full max-w-xl my-4 border rounded-lg overflow-hidden shadow-md">
          <MapContainer
            center={[coords.lat, coords.lng]}
            zoom={15}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap"
            />
            <Marker position={[coords.lat, coords.lng]}>
              <Popup>Lokasi Anda</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {/* ======================
           WEBCAM AREA
      ====================== */}
      <div className="w-full max-w-md my-4">
        <div className="border rounded-lg overflow-hidden bg-black">
          {!image ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full"
            />
          ) : (
            <img src={image} alt="Selfie" className="w-full" />
          )}
        </div>

        <div className="mt-3">
          {!image ? (
            <button
              onClick={capture}
              className="w-full py-2 bg-blue-600 text-white rounded-md"
            >
              Ambil Foto 📸
            </button>
          ) : (
            <button
              onClick={() => setImage(null)}
              className="w-full py-2 bg-gray-600 text-white rounded-md"
            >
              Ulangi Foto 🔄
            </button>
          )}
        </div>
      </div>

      {/* ======================
           CHECK-IN / OUT
      ====================== */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        {message && (
          <p className="text-green-600 mb-4 font-semibold">{message}</p>
        )}
        {error && (
          <p className="text-red-600 mb-4 font-semibold">{error}</p>
        )}

        <div className="flex space-x-4">
          <button
            onClick={handleCheckIn}
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
          >
            Check-In
          </button>

          <button
            onClick={handleCheckOut}
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
