require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Schema
const Log = mongoose.model("Log", {
  website: String,
  timeSpent: Number,
  productive: Boolean,
  date: Date
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Save tracking data
app.post("/track", async (req, res) => {
  const log = new Log(req.body);
  await log.save();
  res.json({ success: true });
});

// Get analytics
app.get("/analytics", async (req, res) => {
  const data = await Log.find();
  res.json(data);
});

app.listen(5000, () => {
  console.log("Server running on 5000");
});
