import dotenv from "dotenv";
import mongoose from "mongoose";
import { app } from "./app.js";  // Must match export in app.js

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`✅ Server running at port: ${PORT}`));

