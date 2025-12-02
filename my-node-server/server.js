const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

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

// Log tambahan
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Route utama
app.get("/", (req, res) => {
  res.send("Home Page for API");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);

// Server Start
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
