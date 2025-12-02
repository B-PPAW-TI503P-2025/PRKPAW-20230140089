import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";

// ================================
// 🔥 AXIOS INTERCEPTOR
// ================================
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika token kadaluwarsa → backend kirim 401
    if (error.response && error.response.status === 401) {
      alert("Sesi berakhir. Silakan login kembali.");
      localStorage.removeItem("token");
      window.location.href = "/"; // redirect ke login
    }
    return Promise.reject(error);
  }
);

// ================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
