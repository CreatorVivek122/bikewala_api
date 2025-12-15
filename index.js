require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const assetRoutes = require("./routes/asset");

const app = express();

// ✅ Middleware FIRST
app.use(express.json());

// ✅ Routes AFTER body parser
app.use("/api", assetRoutes);

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// ✅ Correct listen usage
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
