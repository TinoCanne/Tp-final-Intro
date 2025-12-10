import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// Mostrar todos los usuarios
app.get("/usuarios", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM usuarios");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

// Mostrar un usuario por id
app.get("/usuarios/:id", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM usuarios where id = ${req.params.id}`);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

// Mostrar todas las bandas
app.get("/bandas", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM bandas");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

// Mostrar una banda por id
app.get("/bandas/:id", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM bandas where id = ${req.params.id}`);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

// Mostrar todos los espacios
app.get("/espacios", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM espacios");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

// Mostrar un espacio por id
app.get("/espacios/:id", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM espacios where id = ${req.params.id}`);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

app.post("/crear_usuario", async (req, res) => {
    try {
        const query = `INSERT INTO usuarios (nombre, apellido, username, contraseña, email, instrumentos, generosfavoritos, biografia, redessociales, linkFoto, contacto)
        VALUES ('${req.body.nombre}', '${req.body.apellido}', '${req.body.username}', '${req.body.contraseña}', '${req.body.email}', '${req.body.instrumentos}', '${req.body.generosfavoritos}', '${req.body.biografia}', '${req.body.redessociales}', '${req.body.linkfoto}', '${req.body.contacto}')`;
        await pool.query(query);
        res.json();
    }
    catch (err){
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
})

app.get("/generos_usuarios/:id_usuario", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM generos_usuarios WHERE id_usuario = ${req.params.id_usuario}`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error : "DB error" });
    }
});

app.get("/generos_usuarios", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM generos_usuarios`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error : "DB error" });
    }
});

app.get("/instrumentos_usuarios/:id_usuario", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM instrumentos WHERE id_usuario = ${req.params.id_usuario}`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error : "DB error" });
    }
});

app.get("/instrumentos_usuarios", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM instrumentos`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error : "DB error" });
    }
});

app.get("/generos_bandas/:id_banda", async (req, res) => {
    try{
        const result = await pool.query(`SELECT * FROM generos_bandas WHERE id_banda = ${req.params.id_banda}`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error"});
    }
})

app.get("/generos_bandas", async (req, res) => {
    try{
        const result = await pool.query(`SELECT * FROM generos_bandas`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error"});
    }
})

app.get("/username_integrantes_bandas/:id_banda", async (req, res) => {
    try{
        const result = await pool.query(`select usuarios.username from usuarios join integrantes_bandas on integrantes_bandas.id_integrante = usuarios.id where integrantes_bandas.id_banda = ${req.params.id_banda}`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
})

app.get("/filtro_musicos", async (req, res) => {
    try{
        const { genero, instrumento } = req.query;
        let query = `SELECT * FROM usuarios `;
        if (genero != ""){
            query += ` JOIN generos_usuarios ON usuarios.id = generos_usuarios.id_usuario AND generos_usuarios.genero = '${genero}'`;
        }
        if (instrumento != "")
            query += ` JOIN instrumentos ON usuarios.id = instrumentos.id_usuario AND instrumentos.instrumento = '${instrumento}'`;
        const result = await pool.query(query);
        res.json(result.rows);
    }
    catch (err){
        console.error(err);
        res.status(500).json({ error: "DB error"});
    }
})

app.get("/filtro_bandas", async (req, res) => {
    try{
        const { genero } = req.query;
        let query = `SELECT * FROM bandas`;
        if (genero){
            query += ` JOIN generos_bandas ON generos_bandas.id_banda = bandas.id AND generos_bandas.genero = '${genero}'`;
        }
        const result = await pool.query(query);
        res.json(result.rows);
    }
    catch (err){
        console.error(err);
        res.status(500).json({ error: "DB error"});
    }
})

app.get("/filtro_espacios", async (req, res) => {
    try{
        const { ubicacion, horarios, tamaño, precioPorHora } = req.query;
        let query = `SELECT * FROM espacios WHERE 1=1`;
        if (ubicacion != ""){
            query += ` AND ubicacion = '${ubicacion}'`;
        }
        if (tamaño != ""){
            query += ` AND tamaño = '${tamaño}'`;
        }
        if (precioPorHora != ""){
            let precioPorHoraInt = parseInt(precioPorHora);
            query += ` AND precioPorHora <= ${precioPorHoraInt}`;
        }
        const result = await pool.query(query);
        res.json(result.rows);
    }
    catch (err){
        console.error(err);
        res.status(500).json({ error: "DB error"});
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localunuhost:" + PORT);
});
