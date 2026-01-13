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

// Devolver todos los usuarios
app.get("/usuarios", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM usuarios");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: usuarios" });
    }
});

// Devolver un usuario por id
app.get("/usuarios/:id", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM usuarios where id = ${req.params.id}`);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: usuarios/id" });
    }
});

// Crear un usuario 
app.post("/usuarios", async (req, res) => {
    try {
        const query_usuario = `INSERT INTO usuarios (nombre, apellido, username, contraseña, email, biografia, redSocial, linkFotoPerfil, contacto)
        VALUES ('${req.body.nombre}', '${req.body.apellido}', '${req.body.username}', '${req.body.contraseña}', '${req.body.email}', '${req.body.biografia}', '${req.body.redesSociales}', '${req.body.linkFoto}', '${req.body.contacto}') RETURNING id`;
        result_usuario = await pool.query(query_usuario);

        const id = result_usuario.rows[0].id;

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
        res.status(500).json({ error: "DB error en el metodo POST: usuarios" });
    }
})

// Editar la informacion de un usuario
app.patch("/usuarios", async(req, res) =>{
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
        res.status(500).json({ error: "DB error en el metodo PATCH: usuarios" });
    }
})

// Borrar la informacion completa de un usuario con su id.
app.delete("/usuarios/:id", async (req, res) => {
    try{
        const query_eliminar_contactos_espacios = `
        DELETE FROM usuarios WHERE id = ${req.params.id};
        `;
        await pool.query(query_eliminar_contactos_espacios);
        res.status(200).send("Usuario eliminado");
    }
    catch (err){
        console.error(err);
        res.status(500).send("DB error en el metodo DELETE: usuarios/id");
    }
});

// Devolver todos los generos de los usuarios
app.get("/generos_usuarios", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM generos_usuarios`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error : "DB error en el metodo GET: generos_usuarios" });
    }
});

// Devolver todos los generos de un usuario por id
app.get("/generos_usuarios/:id_usuario", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM generos_usuarios WHERE id_usuario = ${req.params.id_usuario}`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error : "DB error en el metodo GET: generos_usuarios/id_usuario" });
    }
});

// Devolver todos los instrumentos de un usuario por id
app.get("/instrumentos_usuarios/:id_usuario", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM instrumentos WHERE id_usuario = ${req.params.id_usuario}`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error : "DB error en el metodo GET: instrumentos_usuarios/id_usuario" });
    }
});

// Devolver todas las bandas
app.get("/bandas", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM bandas");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: bandas" });
    }
});

// Devolver una banda por id
app.get("/bandas/:id", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM bandas where id = ${req.params.id}`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: bandas/id" });
    }
});

// Crear una banda
app.post("/bandas", async (req, res) => {
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

        res.json({ message: "Banda creada" });
    }
    catch (err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo POST: bandas" });
    }
});

// Editar la informacion de una banda
app.patch("/bandas", async(req, res) =>{
    try{
        const bandaId = parseInt(req.body.idBanda);
    
        const query_banda = `UPDATE bandas SET descripcion = '${req.body.descripcion}', redSocial = '${req.body.redes}'
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
        res.status(500).json({ error: "DB error en el metodo PATCH: bandas" });
    }
});

// Devolver todos los generos de una banda segun el id.
app.get("/generos_bandas/:id_banda", async (req, res) => {
    try{
        const result = await pool.query(`SELECT * FROM generos_bandas WHERE id_banda = ${req.params.id_banda}`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: generos_bandas/id_banda"});
    }
});

// Devolver todos los generos de todas las bandas
app.get("/generos_bandas", async (req, res) => {
    try{
        const result = await pool.query(`SELECT * FROM generos_bandas`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: generos_bandas"});
    }
});

//Devolver todos los integrantes de una banda
app.get("/integrantes_bandas/:id_banda", async (req, res) => {
    try{
        const result = await pool.query(`select * from usuarios join integrantes_bandas on integrantes_bandas.id_integrante = usuarios.id where integrantes_bandas.id_banda = ${req.params.id_banda}`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: integrantes_bandas/id_banda" });
    }
});

// Devuelve el id_banda correspondiente al id_usuario
app.get("/obtener_id_banda/:id_usuario", async (req, res) => {
    try{
        const query_obtener_id_banda = `SELECT id_banda FROM integrantes_bandas WHERE id_integrante = ${req.params.id_usuario}`;
        const result = await pool.query(query_obtener_id_banda);
        res.json(result.rows[0]);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: obtener_id_banda/id_usuario" });
    }
});

app.get("/obtener_cantidad_personas_banda/:id_banda", async (req, res) => {
    try{
        const query = `SELECT COUNT(*) FROM integrantes_bandas WHERE id_banda = ${req.params.id_banda}`;
        const result = await pool.query(query);
        res.json(result.rows[0]);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET:obtener_cantidad_personas_banda/id_banda" });
    }
});

// Unirse a un banda
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

        const queryIntegranteNuevo = `INSERT INTO integrantes_bandas (id_banda, id_integrante) VALUES (${idBanda}, ${idUsuario})`;
        await pool.query(queryIntegranteNuevo);
        res.json("EXITO");

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo POST: unirse_banda" });
    }
});

app.delete("/dejar_banda/:id_usuario/:id_banda", async (req, res) => {
    try{
        const query = `DELETE FROM integrantes_bandas WHERE id_banda = ${req.params.id_banda} AND id_integrante = ${req.params.id_usuario}`
        await pool.query(query);
        res.status(200).send("Banda dejada");
    }
    catch (err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo DELETE: dejar_banda/id_usuario" });
    }
});

app.delete("/bandas/:id_banda", async (req, res) => {
    try{
        const query = `DELETE FROM bandas WHERE id = ${req.params.id_banda}`
        await pool.query(query);
        res.status(200).send("Banda eliminada");
    }
    catch (err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo DELETE: bandas/id_banda" });
    }
})

// Devolver todos los espacios
app.get("/espacios", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM espacios");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: espacios" });
    }
});

// Devolver un espacio por id
app.get("/espacios/:id", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM espacios where id = ${req.params.id}`);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: espacios/id" });
    }
});

// Crear un espacio nuevo
app.post("/espacios", async (req, res) => {
    try{
        const precio = parseInt(req.body.precio);
        const idUsuario = parseInt(req.body.idUsuario);
        const query_espacio = `INSERT INTO espacios (nombre, ubicacion, descripcion, contacto, tamaño, precioPorHora, id_dueño) VALUES ('${req.body.nombre}', '${req.body.ubicacion}', '${req.body.descripcion}', '${req.body.contacto}', '${req.body.tamaño}', ${precio}, ${idUsuario})`;
        await pool.query(query_espacio);
        
        res.json({ message: "Espacio creado" });  
    }
    catch (error) {
        res.status(500).json({ error: "DB error en el metodo POST: espacios" });
    }
});

app.delete("/espacios/:idEspacio", async (req, res) => {
    try{
        const idEspacioINT = parseInt(req.params.idEspacio);
        const queryEliminarEspacio = `DELETE FROM espacios WHERE id = ${idEspacioINT}`;
        await pool.query(queryEliminarEspacio);
        res.status(200).send("Espacio eliminado!");
    }
    catch(error){
        console.error(error);
        res.status(500).send("DB error en el metodo DELETE: espacios/idEspacio");
    }
})

// Devuelve el id_espacio correspondiente al id_usuario
app.get("/obtener_id_espacio/:id_usuario", async (req, res) => {
    try{
        const query_obtener_id_espacio = `SELECT id FROM espacios WHERE id_dueño = ${req.params.id_usuario}`;
        const result = await pool.query(query_obtener_id_espacio);
        res.json(result.rows[0]);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: obtener_id_espacio/id_usuario" });
    }
});

// Devolver todos los intrumentos de todos los usuarios
app.get("/instrumentos_usuarios", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM instrumentos`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error : "DB error en el metodo GET: instrumentos_usuarios" });
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

// Devuelve el ID correspodiente en caso de coincidir el email y contraseña
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
        res.status(500).json({ error: "DB error en el metodo POST: login" });
    }
});

app.post("/reservas", async(req, res) => {
    try {
        const id_usuario = parseInt(req.body.id_usuario);
        const id_espacio = parseInt(req.body.id_espacio);
        const hora_reserva = parseInt(req.body.hora_reserva);
        const dia_reserva = parseInt(req.body.dia_reserva);
        const mes_reserva = parseInt(req.body.mes_reserva);
        const año_reserva = parseInt(req.body.año_reserva);

        const query_reserva = `INSERT INTO reservas (id_usuario, id_espacio, hora_reserva, dia_reserva, mes_reserva, año_reserva) VALUES (${id_usuario}, ${id_espacio}, ${hora_reserva}, ${dia_reserva}, ${mes_reserva}, ${año_reserva}) `
        
        await pool.query(query_reserva);
        
        res.json({message: "Reserva realizada con exito"}); 
    }
    catch (err) {
        console.error(err);
        res.status(500).json({error: "DB error en el metodo POST: reservas"})
    }
});

app.get("/reservas", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM reservas`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: reservas"});
    }
});

app.get("/reservas/usuarios/:id_usuario", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM reservas WHERE id_usuario = ${req.params.id_usuario}`);
                res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error : "DB error en el metodo GET: reservas/usuarios/:id_usuario" });
    }
})

app.get("/reservas/espacios/mes/:id_espacio/:año/:mes", async (req, res) => {
    try {
        const result = await pool.query(`SELECT dia_reserva, hora_reserva FROM reservas WHERE id_espacio = ${req.params.id_espacio} AND mes_reserva = ${req.params.mes} AND año_reserva = ${req.params.año} ORDER BY dia_reserva, hora_reserva;`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error : "DB error en el metodo GET: reservas/espacios/:id_espacio" });
    }
});
        //devuelve todos los contactos de un usuario dado su id
app.get("/pedir_contactos/:id_usuario", async(req, res) =>{
    const q = ` SELECT * FROM contactos_usuarios WHERE id_usuario = ${req.params.id_usuario}`;

    try{
        const response = await pool.query(q);
        res.json(response.rows); 
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error : "DB error" });
    }
})

app.get("/pedir_bandas/:id_usuario", async(req, res) => {
    const q = `SELECT b.id_banda FROM integrantes_bandas b INNER JOIN usuarios u ON u.id = b.id_integrante WHERE U.ID = ${req.params.id_usuario}`;

    try{
        const response = await pool.query(q);
        res.json(response.rows)
    }
    catch(err){
        console.log(err)
        res.status(500).json({ error : "DB error" });
    }
})

app.post("/aceptar_usuarios/", async (req, res)=>{
    const q = `INSERT INTO contactos_usuarios (id_usuario, id_contacto_usuario) VALUES (${req.body.id_usuario}, ${req.body.id_contacto_usuario});`
    await pool.query(q);
    console.log("agregado exitoso");
})

app.get("/pedir_generos/:id_usuario", async (req, res)=>{
    const q = `SELECT genero from generos_usuarios WHERE id_usuario = ${req.params.id_usuario}`

    try{
        const response = await pool.query(q);
        res.json(response.rows);
    }
    catch(err){
        console.log(err);
        res.send(500);
    }
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localunuhost:" + PORT);
});

