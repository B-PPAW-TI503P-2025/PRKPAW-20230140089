require("dotenv").config(); // WAJIB PALING ATAS, FIX ERROR JWT

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const app = express();
const PORT = 3001;

// Router
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const authRoutes = require("./routes/auth");
const booksRoutes = require("./routes/books");

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve folder uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route utama
app.get("/", (req, res) => {
  res.send("Home Page for API");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
