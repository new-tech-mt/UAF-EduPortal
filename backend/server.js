const express = require("express");
const cors = require("cors");
require("dotenv").config();

const resultsRoutes = require("./routes/results");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/results", resultsRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "UAF EduPortal Backend is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`UAF EduPortal Backend running on port ${PORT}`);
  });
}

module.exports = app;