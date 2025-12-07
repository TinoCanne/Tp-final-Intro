import express from "express";
import { pool } from "./db.js";

const app = express();
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});