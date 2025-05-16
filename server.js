const express = require("express");
require("dotenv").config();
const sequelize = require("./config/db");

const jadwalRoutes = require("./routes/jadwalRoute");
const authRoutes = require("./routes/authRoute");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", jadwalRoutes);
app.use("/api", authRoutes);

const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected.");
    // return sequelize.sync({ alter: true });
  })
  .then(() => {
    // console.log("Database synced.");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect or sync to database:", err);
  });
