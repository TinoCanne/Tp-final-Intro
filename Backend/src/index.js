import express from "express";
import cors from "cors";
import pkg from 'pg'; 
const { Pool } = pkg; 

const app = express();

app.use(express.json());
app.use(cors());

app.get('/favicon.ico', (req, res) => res.status(204).end());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://admin:admin@db:5432/tpDb'
});

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
        const query_usuario = `INSERT INTO usuarios (nombre, apellido, username, contraseña, email, biografia, redSocial, linkFotoPerfil, contacto)
        VALUES ('${req.body.nombre}', '${req.body.apellido}', '${req.body.username}', '${req.body.contraseña}', '${req.body.email}', '${req.body.biografia}', '${req.body.redesSociales}', '${req.body.linkFoto}', '${req.body.contacto}')`;
        await pool.query(query_usuario);

        const query_id = `SELECT id from usuarios where email = '${req.body.email}'`;
        const result_id = await pool.query(query_id);
        const id = result_id.rows[0].id;

        let query_instrumentos = `INSERT INTO instrumentos (id_usuario, instrumento) VALUES `;
        let instrumentos = req.body.instrumentos.split(" ", 4);
        instrumentos.forEach(instrumento => {
            query_instrumentos += `(${id}, '${instrumento}'),`;
        });
        const query_instrumentos_limpia = query_instrumentos.slice(0, -1);
        await pool.query(query_instrumentos_limpia);

        let query_generos = `INSERT INTO generos_usuarios (id_usuario, genero) VALUES `;
        let generos = req.body.generos.split(" ", 4);
        generos.forEach(genero => {
            query_generos += `(${id}, '${genero}'),`;
        })
        const query_generos_limpia = query_generos.slice(0, -1);
        await pool.query(query_generos_limpia);

        res.json({ message: "Usuario creado" });
    }
    catch (err){
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
})

app.post("/perfil_usuario", async(req, res) =>{
    try {
        const userId = req.body.id;
        const query_usuario = `UPDATE usuarios SET nombre = '${req.body.nombre}', apellido = '${req.body.apellido}', username = '${req.body.username}', email = '${req.body.email}', biografia =  '${req.body.biografia}', redsocial =  '${req.body.redesSociales}', linkfotoperfil = '${req.body.linkFoto}', contacto = '${req.body.contacto}'
        WHERE id = ${userId}`;
        await pool.query(query_usuario);
        
        const instrumentos = req.body.instrumentos.split(", ", 4);
        let query_borrar_instrumentos = `DELETE FROM instrumentos WHERE id_usuario = ${userId}`;
        await pool.query(query_borrar_instrumentos);
        
        let query_insertar_instrumentos = `INSERT INTO instrumentos (id_usuario, instrumento) VALUES `;
        instrumentos.forEach(instrumento => {
            query_insertar_instrumentos += `(${userId}, '${instrumento}'),`;
        });

        const query_instrumentos_limpia = query_insertar_instrumentos.slice(0, -1);
        await pool.query(query_instrumentos_limpia);
        
        const generos = req.body.generos.split(", ", 4);
        let query_borrar_generos = `DELETE FROM generos_usuarios WHERE id_usuario = ${userId}`;
        await pool.query(query_borrar_generos);
        
        let query_insertar_generos = `INSERT INTO generos_usuarios (id_usuario, genero) VALUES `;
        generos.forEach(genero => {
            query_insertar_generos += `(${userId}, '${genero}'),`;
        });

        const query_generos_limpia = query_insertar_generos.slice(0, -1);
        await pool.query(query_generos_limpia);

        res.json({ message: "Perfil editado con exito."})
    }
    catch (err){
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
})

app.post("/banda_usuario", async(req, res) =>{
    try{
        const userId = req.body.idUsuario;
        const bandaId = req.body.idBanda;
    
        const query_banda = `UPDATE bandas SET nombre = '${req.body.nombre}', fechaCreacion = '${req.body.fechaCreacion}', descripcion = '${req.body.descripcion}', redSocial = '${req.body.redes}'
        WHERE id = ${bandaId}`;
        await pool.query(query_banda);

        const generos_banda = req.body.generos.split(", ", 4);
        let query_borrar_generos_banda = `DELETE FROM generos_bandas WHERE id_banda = ${bandaId}`;
        await pool.query(query_borrar_generos_banda);
        
        let query_insertar_generos_banda = `INSERT INTO generos_bandas (id_banda, genero) VALUES `;
        generos_banda.forEach(genero => {
            query_insertar_generos_banda += `(${bandaId}, '${genero}'),`;
        });

        const query_generos_banda_limpia = query_insertar_generos_banda.slice(0, -1);
        await pool.query(query_generos_banda_limpia);

        res.json({ message: "Banda editada con exito."});
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
});

app.get("/generos_bandas", async (req, res) => {
    try{
        const result = await pool.query(`SELECT * FROM generos_bandas`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error"});
    }
});

app.get("/username_integrantes_bandas/:id_banda", async (req, res) => {
    try{
        const result = await pool.query(`select usuarios.username from usuarios join integrantes_bandas on integrantes_bandas.id_integrante = usuarios.id where integrantes_bandas.id_banda = ${req.params.id_banda}`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

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
});

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
});

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
});

app.post("/unirse_banda", async (req, res) => {
    const { nombre, contraseña, idUsuario } = req.body; 
    try {
        const queryVerificacion = `
            SELECT id FROM bandas 
            WHERE bandas.nombre = '${nombre}' AND bandas.contraseñaParaIngresar = '${contraseña}'
        `;
        
        const result = await pool.query(queryVerificacion);
        if (result.rows.length === 0) {
            console.log("No se encontró la banda o la contraseña es incorrecta");
            return res.status(400).json({ error: "Credenciales incorrectas" });
        }
        const idBanda = result.rows[0].id;

        const queryUpdate = `UPDATE usuarios SET id_banda = ${idBanda} WHERE id = ${idUsuario}`;
        await pool.query(queryUpdate);
        res.json("EXITO");

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

app.post("/crear_banda", async (req, res) => {
    try {
        const query_banda = `INSERT INTO bandas (nombre, fechaCreacion, descripcion, redSocial, contraseñaParaIngresar)
        VALUES ('${req.body.nombre}', '${req.body.fecha}','${req.body.descripcion}', '${req.body.redSocial}', '${req.body.contraseña}')`;
        await pool.query(query_banda);

        const query_id_banda = `SELECT id from bandas where nombre = '${req.body.nombre}'`;
        const result_id_banda = await pool.query(query_id_banda);
        const id_banda = result_id_banda.rows[0].id;

        let query_generos = `INSERT INTO generos_bandas (id_banda, genero) VALUES `;
        let generos = req.body.generos.split(" ", 4);
        generos.forEach(genero => {
            query_generos += `(${id_banda}, '${genero}'),`;
        })
        const query_generos_limpia = query_generos.slice(0, -1);
        await pool.query(query_generos_limpia);

        console.log(req.body.idUsuario, id_banda);

        let query_integrante = `INSERT INTO integrantes_bandas (id_banda, id_integrante) values (${id_banda}, ${req.body.idUsuario})`;
        await pool.query(query_integrante);

        let query_actualizar_id_bandas = `UPDATE usuarios SET id_banda = ${id_banda} WHERE id = ${req.body.idUsuario}`;
        await pool.query(query_actualizar_id_bandas);

        res.json({ message: "Banda creada" });
    }
    catch (err){
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const contraseña = req.body.contraseña;
        
        if (!email || !contraseña) {
            return res.status(400).json({ error: "Faltan datos" });
        }
        
        const query = `SELECT id FROM usuarios WHERE email = '${email}' AND contraseña = '${contraseña}'`;
        const result = await pool.query(query);
        res.json(result.rows[0]);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error del servidor" });
    }
});

app.post("/espacios", async (req, res) => {
    try{
        const precio = parseInt(req.body.precio);
        const idUsuario = parseInt(req.body.idUsuario);
        const query_espacio = `INSERT INTO espacios (nombre, ubicacion, descripcion, contacto, tamaño, precioPorHora) VALUES ('${req.body.nombre}', '${req.body.ubicacion}', '${req.body.descripcion}', '${req.body.contacto}', '${req.body.tamaño}', ${precio}) RETURNING id`;
        const res_espacio = await pool.query(query_espacio);
        const id_espacio = res_espacio.rows[0].id;
        
        const query_actualizar_id_espacio = `UPDATE usuarios SET id_espacio = ${id_espacio} WHERE id = ${idUsuario}`;
        await pool.query(query_actualizar_id_espacio);
        res.json({ message: "Espacio creado" });  
    }
    catch (error) {
        res.status(500).json({ error: "No se pudo crear el espacio" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localunuhost:" + PORT);
});
