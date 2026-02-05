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


//---------------------------------------------------------------
// ENDPOINTS USUARIOS 
//---------------------------------------------------------------


// Devolver todos los usuarios con todos sus campos
app.get("/usuarios", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM usuarios");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: usuarios" });
    }
});

// Devolver un usuario con todos sus campos, buscado por su id
app.get("/usuarios/id/:id", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM usuarios WHERE id = ${req.params.id}`);
        if (result.rows.length === 0){
            res.status(404).json({error: "Usuario no econtrado"});
        }
        else{
            res.json(result.rows[0]);
        }
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: usuarios/id" });
    }
});

// Devolver un usuario por email
app.get("/usuarios/email/:email", async (req, res) => {
    try{
        const email = req.params.email
        const result = await pool.query(`SELECT * FROM usuarios WHERE email = '${email}'`);
        if (result.rows.length === 0){
            res.status(404).json({error: "Usuario no encontrado"});
        }
        else{
            res.json(result.rows[0]);
        }
    }
    catch (err){
        console.error(err);
        res.status(500).json({error: "DB error en el metodo GET: usuarios/email"});
    }
})

// Crea un usuario con todos sus campos 
app.post("/usuarios", async (req, res) => {
    try {
        const query_usuario = `INSERT INTO usuarios (nombre, apellido, username, contraseña, email, biografia, redSocial, linkFotoPerfil, contacto)
        VALUES ('${req.body.nombre}', '${req.body.apellido}', '${req.body.username}', '${req.body.contraseña}', '${req.body.email}', '${req.body.biografia}', '${req.body.redesSociales}', '${req.body.linkFoto}', '${req.body.contacto}') RETURNING id`;
        const result_usuario = await pool.query(query_usuario);

        const id = result_usuario.rows[0].id;

        let query_instrumentos = `INSERT INTO instrumentos (id_usuario, instrumento) VALUES `;
        let instrumentos = req.body.instrumentos.split(",", 4);
        instrumentos.forEach(instrumento => {
            query_instrumentos += `(${id}, '${instrumento}'),`;
        });
        const query_instrumentos_limpia = query_instrumentos.slice(0, -1);
        await pool.query(query_instrumentos_limpia);

        let query_generos = `INSERT INTO generos_usuarios (id_usuario, genero) VALUES `;
        let generos = req.body.generos.split(",", 4);
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

// Editar la informacion de un usuario dado su id y los campos a editar
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

// Borrar toda la informacion completa (Todos los espacios y bandas) de un usuario con su id.
app.delete("/usuarios/:id", async (req, res) => {
    try{
        const query = `
        DELETE FROM usuarios WHERE id = ${req.params.id};
        `;
        await pool.query(query);
        res.status(200).send("Usuario eliminado");
    }
    catch (err){
        console.error(err);
        res.status(500).send("DB error en el metodo DELETE: usuarios");
    }
});

// Devolver todos los generos de todos los usuarios
app.get("/usuarios/generos/todos", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM generos_usuarios`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error : "DB error en el metodo GET: usuarios/generos/todos" });
    }
});

// Devolver todos los generos de un usuario por un id
app.get("/usuarios/generos/:id_usuario", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM generos_usuarios WHERE id_usuario = ${req.params.id_usuario}`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error : "DB error en el metodo GET: usuarios/generos" });
    }
});

// Devolver todos los intrumentos de todos los usuarios
app.get("/usuarios/instrumentos/todos", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM instrumentos`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error : "DB error en el metodo GET: usuarios/instrumentos/todos" });
    }
});

// Devolver todos los instrumentos de un usuario por un id
app.get("/usuarios/instrumentos/:id_usuario", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM instrumentos WHERE id_usuario = ${req.params.id_usuario}`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error : "DB error en el metodo GET: usuarios/instrumentos" });
    }
});

//Devolver todos los usuarios que cumplan con los requisitos dados por genero y instrumento que no sean el usuario pidiendolos.
app.get("/usuarios/filtros", async (req, res) => {
    try{
        const { genero, instrumento, idUsuario } = req.query;
        let query = `SELECT usuarios.* FROM usuarios
            LEFT JOIN contactos_usuarios  
            ON usuarios.id = contactos_usuarios.id_contacto_usuario AND contactos_usuarios.id_usuario = ${idUsuario} 
            AND contactos_usuarios.id_contacto_usuario IS NULL`;
        if (genero != ""){
            query += ` JOIN generos_usuarios ON usuarios.id = generos_usuarios.id_usuario AND generos_usuarios.genero = '${genero}'`;
        }
        if (instrumento != "")
            query += ` JOIN instrumentos ON usuarios.id = instrumentos.id_usuario AND instrumentos.instrumento = '${instrumento}'`;
        query += ` WHERE usuarios.id != ${idUsuario}`;
        const result = await pool.query(query);
        res.json(result.rows);
    }
    catch (err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: usuarios/filtros" });
    }
});

// Devuelve el ID correspodiente en caso de coincidir el email y contraseña
app.post("/usuarios/login", async (req, res) => {
    try {
        const email = req.body.email;
        const contraseña = req.body.contraseña;
        
        if (!email || !contraseña) {
            return res.status(400).json({ error: "Faltan datos" });
        }
        
        const query = `SELECT id FROM usuarios WHERE email = '${email}' AND contraseña = '${contraseña}'`;
        const result = await pool.query(query);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Email o contraseña incorrectos" });
        }
        
        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo POST: usuarios/login" });
    }
});

// Devuelve todos los contactos usuarios de un usuario dado su id
app.get("/usuarios/contactos/usuarios/:id_usuario", async(req, res) =>{
    const query = `SELECT usuarios.* FROM usuarios INNER JOIN contactos_usuarios ON usuarios.id = contactos_usuarios.id_contacto_usuario WHERE contactos_usuarios.id_usuario = ${req.params.id_usuario}`;

    try{
        const response = await pool.query(query);
        res.json(response.rows); 
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error : "DB error en el metodo GET: usuarios/contactos/usuarios" });
    }
})

// Borrar un contacto dado el id del usuario y el del contacto usuario
app.delete("/usuarios/contactos/usuarios/:id_usuario/:id_contacto", async(req, res) =>{
    const query = `DELETE FROM contactos_usuarios WHERE id_usuario = ${req.params.id_usuario} AND id_contacto_usuario = ${req.params.id_contacto}`;

    try{
        const respone = await pool.query(query);
        res.send("contacto eliminado con exito");
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error : "DB error en el metodo DELETE: usuarios/contactos/usuarios" });
    }
})

// Devuelve todos los contactos bandas de un usuario dado por su id
app.get("/usuarios/contactos/bandas/:id_usuario", async(req, res) => {
    const idUsuario = parseInt(req.params.id_usuario);
    const q = `SELECT bandas.* FROM bandas INNER JOIN contactos_bandas ON bandas.id = contactos_bandas.id_contacto_bandas WHERE contactos_bandas.id_usuario = ${idUsuario}`;

    try{
        const response = await pool.query(q);
        res.json(response.rows)
    }
    catch(err){
        console.log(err)
        res.status(500).json({ error : "DB error en el metodo GET: usuarios/contactos/bandas" });
    }
})

// Borrar un contacto dado el id del usuario y el del contacto banda
app.delete("/usuarios/contactos/bandas/:id_usuario/:id_banda", async(req, res) =>{
    const query = `DELETE FROM contactos_bandas WHERE id_usuario = ${req.params.id_usuario} AND id_contacto_bandas = ${req.params.id_banda}`;
    try{
        const response = await pool.query(query);
        res.send("banda eliminada exitosamente de los contactos");
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error : "DB error en el metodo DELETE: usuarios/contactos/bandas" });
    }
})

// Devuelve todos los usuarios que no son contactos del usuario buscado por su id
app.get("/usuarios/nuevos/usuarios/:id_usuario", async (req, res) => {
    try{
        const query = `SELECT usuarios.* FROM usuarios
            LEFT JOIN contactos_usuarios  
            ON usuarios.id = contactos_usuarios.id_contacto_usuario AND contactos_usuarios.id_usuario = ${req.params.id_usuario} 
            WHERE usuarios.id != ${req.params.id_usuario} 
            AND contactos_usuarios.id_contacto_usuario IS NULL`;
        const response = await pool.query(query);
        res.json(response.rows);
    }
    catch(err){
        console.log(err)
        res.status(500).json({ error : "DB error en el metodo GET: usuarios/nuevos" });
    }
});

// Agrega un usuario-contacto a la lista de contactos del usuario
app.post("/usuarios/contactos/usuarios", async (req, res) =>{
    try{
        const query = `INSERT INTO contactos_usuarios (id_usuario, id_contacto_usuario) VALUES (${req.body.id_usuario}, ${req.body.id_contacto_usuario})`
        await pool.query(query);
        console.log("agregado exitoso");
    }
    catch(err){
        console.log(err)
        res.status(500).json({ error : "DB error en el metodo POST: usuarios/contactos/usuarios" });
    }
})

// Agrega una banda-contacto a la lista de contactos del usuario 
app.post("/usuarios/contactos/bandas", async (req, res) => {
    try{
        const query = `INSERT INTO contactos_bandas (id_usuario, id_contacto_bandas) VALUES (${req.body.id_usuario}, ${req.body.id_contacto_banda})`
        await pool.query(query);
        res.status(200);
    }
    catch(err){
        console.log(err)
        res.status(500).json({ error : "DB error en el metodo POST: usuarios/contactos/bandas" });
    }
})

// Devuelve todas las bandas que no son contactos del usuario buscado por su id
app.get("/usuarios/nuevos/bandas/:id_usuario", async (req, res) => {
    try{
        const query = `SELECT bandas.* FROM bandas
            LEFT JOIN contactos_bandas
            ON bandas.id = contactos_bandas.id_contacto_bandas AND contactos_bandas.id_usuario = ${req.params.id_usuario} 
            WHERE contactos_bandas.id_contacto_bandas IS NULL`;
        const response = await pool.query(query);
        res.json(response.rows);
    }
    catch(err){
        console.log(err)
        res.status(500).json({ error : "DB error en el metodo GET: usuarios/nuevos/bandas" });
    }
});

// Devuelve todas las bandas integradas por un usuario buscado por su id
app.get("/usuarios/bandas/idUsuario/:id_usuario", async (req, res) => {
    try{
        const query_obtener_id_banda = `SELECT bandas.* FROM bandas INNER JOIN integrantes_bandas ON integrantes_bandas.id_banda = bandas.id WHERE id_integrante = ${req.params.id_usuario}`;
        const result = await pool.query(query_obtener_id_banda);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: usuarios/bandas/idUsuario" });
    }
});

// Devuelve los ids de los espacios correspondientes al usuario dado por su id
app.get("/usuarios/espacios/ids/:id_usuario", async (req, res) => {
    try{
        const query_obtener_id_espacio = `SELECT id FROM espacios WHERE id_dueño = ${req.params.id_usuario}`;
        const result = await pool.query(query_obtener_id_espacio);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: obtener_id_espacio/id_usuario" });
    }
});

// Devuelve los espacios correspondientes al usuario dado por su id
app.get("/usuarios/espacios/:id_usuario", async (req, res) => {
    try{
        const query_obtener_id_espacio = `SELECT * FROM espacios WHERE id_dueño = ${req.params.id_usuario}`;
        const result = await pool.query(query_obtener_id_espacio);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: obtener_id_espacio/id_usuario" });
    }
}); 


//---------------------------------------------------------------
// ENDPOINTS BANDAS 
//--------------------------------------------------------------- 


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

// Devolver una banda por su id
app.get("/bandas/id/:id", async (req, res) => {
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
        const query_banda = `INSERT INTO bandas (nombre, fechaCreacion, descripcion, redSocial, contraseñaParaIngresar, linkfotobanda)
        VALUES ('${req.body.nombre}', '${req.body.fecha}','${req.body.descripcion}', '${req.body.redSocial}', '${req.body.contraseña}', '${req.body.linkFotoBanda}') RETURNING id`;
        const query_id_banda = await pool.query(query_banda);

        const id_banda = query_id_banda.rows[0].id;

        let query_generos = `INSERT INTO generos_bandas (id_banda, genero) VALUES `;
        let generos = req.body.generos.split(", ", 4);
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
    
        const query_banda = `UPDATE bandas SET nombre = '${req.body.nombre}', descripcion = '${req.body.descripcion}', redSocial = '${req.body.redes}', linkfotobanda = '${req.body.linkfoto}'
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
app.get("/bandas/generos/idBanda/:id_banda", async (req, res) => {
    try{
        const result = await pool.query(`SELECT * FROM generos_bandas WHERE id_banda = ${req.params.id_banda}`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: bandas/generos/idBanda"});
    }
});

// Devolver todos los generos de todas las bandas
app.get("/bandas/generos", async (req, res) => {
    try{
        const result = await pool.query(`SELECT * FROM generos_bandas`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: bandas/generos"});
    }
});

// Devolver todos los integrantes de una banda
app.get("/bandas/integrantes/idBanda/:id_banda", async (req, res) => {
    try{
        const result = await pool.query(`select * from usuarios join integrantes_bandas on integrantes_bandas.id_integrante = usuarios.id where integrantes_bandas.id_banda = ${req.params.id_banda}`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: bandas/integrantes/idBanda" });
    }
});

// Devuelve la cantidad de integrantes de una banda dada por su id
app.get("/bandas/integrantes/cantidad/:id_banda", async (req, res) => {
    try{
        const query = `SELECT COUNT(*) FROM integrantes_bandas WHERE id_banda = ${req.params.id_banda}`;
        const result = await pool.query(query);
        res.json(result.rows[0]);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: bandas/integrantes/cantidad" });
    }
});

// Unirse a un banda
app.post("/bandas/unirse", async (req, res) => {
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
        res.status(500).json({ error: "DB error en el metodo POST: bandas/unirse" });
    }
});

// Salir de una banda
app.delete("/bandas/salir/:id_usuario/:id_banda", async (req, res) => {
    try{
        const query = `DELETE FROM integrantes_bandas WHERE id_banda = ${req.params.id_banda} AND id_integrante = ${req.params.id_usuario}`
        await pool.query(query);
        res.status(200).send("Banda dejada");
    }
    catch (err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo DELETE: bandas/salir" });
    }
});

// Eliminar una banda dada por su id
app.delete("/bandas/id/:id_banda", async (req, res) => {
    try{
        const query = `DELETE FROM bandas WHERE id = ${req.params.id_banda}`
        await pool.query(query);
        res.status(200).send("Banda eliminada");
    }
    catch (err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo DELETE: bandas/id" });
    }
})

// Devuelve todas las bandas que cumplen con el filtro de genero
app.get("/bandas/filtros", async (req, res) => {
    try{
        const { genero, idUsuario } = req.query;
        let query = `SELECT bandas.* FROM bandas
            LEFT JOIN contactos_bandas
            ON bandas.id = contactos_bandas.id_contacto_bandas AND contactos_bandas.id_usuario = ${idUsuario}`;
        if (genero){
            query += ` JOIN generos_bandas ON generos_bandas.id_banda = bandas.id AND generos_bandas.genero = '${genero}'`;
        }
        query += ` WHERE contactos_bandas.id_contacto_bandas IS NULL`
        const result = await pool.query(query);
        res.json(result.rows);
    }
    catch (err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: bandas/filtros"});
    }
});


//---------------------------------------------------------------
// ENDPOINTS ESPACIOS
//---------------------------------------------------------------


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

// Devolver un espacio por id de espacio
app.get("/espacios/idEspacio/:idEspacio", async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM espacios where id = ${req.params.idEspacio}`);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: espacios/idEspacio" });
    }
});

// Devuelve todos los espacios con sus respectivos campos personalizados dependiendo del id del usuario
app.get("/espacios/usuarios/idUsuario/:idUsuario", async (req, res) => {
    try {
        const idUsuario = parseInt(req.params.idUsuario);
        const result = await pool.query(`SELECT espacios.*, (CASE WHEN espacios_favoritos.id_contacto_espacio IS NOT NULL THEN true ELSE false END) AS es_favorito FROM espacios LEFT JOIN espacios_favoritos ON espacios.id = espacios_favoritos.id_contacto_espacio AND espacios_favoritos.id_usuario = ${idUsuario}`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: espacios/usuarios/idUsuario" });
    }
});

// Crear un espacio nuevo
app.post("/espacios", async (req, res) => {
    try{
        const precio = parseInt(req.body.precio);
        const idUsuario = parseInt(req.body.idUsuario);
        const horaApertura = parseInt(req.body.horarioApertura);
        const horaCierre = parseInt(req.body.horarioCierre);
        
        const query_espacio = `INSERT INTO espacios (nombre, ubicacion, linkfotoespacio, descripcion, contacto, tamaño, precioPorHora, id_dueño, diasAbierto, horarioCierre, horarioApertura) VALUES ('${req.body.nombre}', '${req.body.ubicacion}', '${req.body.linkfotoespacio}', '${req.body.descripcion}', '${req.body.contacto}', '${req.body.tamaño}', ${precio}, ${idUsuario}, '${req.body.diasAbiertos}', ${horaCierre}, ${horaApertura})`;
        await pool.query(query_espacio);
        
        res.json({ message: "Espacio creado" });  
    }
    catch (error) {
        res.status(500).json({ error: "DB error en el metodo POST: espacios" });
    }
});

// Edita los campos de un espacio 
app.patch("/espacios", async(req, res) => {
    try {
        const espacioId = parseInt(req.body.espacioId);
        const precioPorHora = parseInt(req.body.precioPorHora);
        const query_espacio = `UPDATE espacios SET nombre = '${req.body.nombreEspacio}', ubicacion = '${req.body.ubicacionEspacio}', linkfotoespacio = '${req.body.linkFotoEspacio}', descripcion = '${req.body.descripcionEspacio}', contacto = '${req.body.contactoEspacio}', tamaño = '${req.body.tamañoEspacio}', precioporhora = ${precioPorHora}
        WHERE id = ${espacioId}`;
        await pool.query(query_espacio);

        res.json({ message: "Espacio editado con exito."});
    }
    catch (err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo PATCH: espacios" });
    }
})

// Elimina un espacio dado por su id
app.delete("/espacios/idEspacio/:idEspacio", async (req, res) => {
    try{
        const idEspacioINT = parseInt(req.params.idEspacio);
        const queryEliminarEspacio = `DELETE FROM espacios WHERE id = ${idEspacioINT}`;
        await pool.query(queryEliminarEspacio);
        res.status(200).send("Espacio eliminado!");
    }
    catch(error){
        console.error(error);
        res.status(500).json({ error: "DB error en el metodo DELETE: espacios/idEspacio" });
    }
})

// Agrega el espacio seleccionado como un espacio favorito para el usuario 
app.post("/espacios/favoritos", async (req, res) => {
    try{
        const idUsuario = parseInt(req.body.id_usuario);
        const idEspacioFavorito = parseInt(req.body.id_espacio); 
        const query = `INSERT INTO espacios_favoritos (id_usuario, id_contacto_espacio) VALUES (${idUsuario}, ${idEspacioFavorito})`;
        const result = await pool.query(query);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo POST: espacios/favoritos" });
    }
});

// Elimina el espacio indicado por su id de los espacios favoritos del usuario indicado por su id
app.delete("/espacios/favoritos/:id_espacio/:id_usuario", async (req, res) => {
    try{
        const idUsuario = parseInt(req.params.id_usuario);
        const idEspacioFavorito = parseInt(req.params.id_espacio); 
        const query = `DELETE FROM espacios_favoritos WHERE id_usuario = ${idUsuario} AND id_contacto_espacio = ${idEspacioFavorito}`;
        const result = await pool.query(query);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo DELETE: espacios/favoritos" });
    }
});

// Devuelve todos los espacios que cumplen con los filtros de espacioFavorito, ubicacion, precioPorHora y hora 
app.get("/espacios/filtros", async (req, res) => {
    try{
        const { ubicacion, precioPorHora, hora, idUsuario, espaciosFavoritos } = req.query;
        let query = `SELECT espacios.*`;
        const intIdUsuario = parseInt(idUsuario);
        if (espaciosFavoritos === 'true'){
            query += ` , (CASE WHEN espacios_favoritos.id_contacto_espacio IS NOT NULL THEN true ELSE false END) AS es_favorito FROM espacios INNER JOIN espacios_favoritos ON espacios.id = espacios_favoritos.id_contacto_espacio WHERE espacios_favoritos.id_usuario = ${intIdUsuario}`;
        }
        else{
            query += `, (CASE WHEN espacios_favoritos.id_contacto_espacio IS NOT NULL THEN true ELSE false END) AS es_favorito FROM espacios LEFT JOIN espacios_favoritos ON espacios.id = espacios_favoritos.id_contacto_espacio AND espacios_favoritos.id_usuario = ${intIdUsuario} WHERE 1=1`;
        }
        if (ubicacion){
            query += ` AND espacios.ubicacion = '${ubicacion}'`;
        }
        if (precioPorHora){
            let precioPorHoraInt = parseInt(precioPorHora);
            query += ` AND espacios.precioPorHora <= ${precioPorHoraInt}`;
        }
        if (hora){
            let horaDeseada = parseInt(hora);
            query += ` AND (
            (espacios.horarioApertura < espacios.horarioCierre AND(espacios.horarioApertura <= ${horaDeseada} AND espacios.horarioCierre > ${horaDeseada})) or 
            (espacios.horarioApertura > espacios.horarioCierre AND (espacios.horarioApertura <= ${horaDeseada} OR espacios.horarioCierre > ${horaDeseada}))
            )  `;
        }
        const result = await pool.query(query);
        res.json(result.rows);
    }
    catch (err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo GET: espacios/filtros" });
    }
});

// Devuelve todas las reservas asociadas a un espacio por su id
app.get("/espacios/reservas/idEspacio/:id_espacio", async (req, res) => {
    try {
        const result = await pool.query(`SELECT reservas.*, usuarios.email FROM reservas INNER JOIN usuarios ON usuarios.id = reservas.id_usuario WHERE reservas.id_espacio = ${req.params.id_espacio} ORDER BY reservas.año_reserva, reservas.mes_reserva, reservas.dia_reserva, hora_reserva`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({error: "DB error en el metodo GET reservas/espacios/:id_espacio"});
    }
})


//---------------------------------------------------------------
// ENDPOINTS RESERVAS
//---------------------------------------------------------------


// Devuelve todas las reservas de todos los usuarios y espacios
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

// Devuelve todas las reservas de un usuario por su id
app.get("/reservas/usuarios/:id_usuario", async (req, res) => {
    try {
        const result = await pool.query(`SELECT reservas.*, espacios.nombre, espacios.precioporhora FROM reservas INNER JOIN espacios ON espacios.id = reservas.id_espacio WHERE id_usuario = ${req.params.id_usuario} ORDER BY año_reserva, mes_reserva, dia_reserva, hora_reserva`);
                res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error : "DB error en el metodo GET: reservas/usuarios/:id_usuario" });
    }
})

// Crea una reserva a nombre del usuario y la vincula con el espacio a reservar
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

// Elimina una reserva por su id
app.delete("/reservas/:idReserva", async (req, res) => {
    try{
        const query = `DELETE FROM reservas WHERE id = ${req.params.idReserva}`;
        const result = await pool.query(query);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "DB error en el metodo DELETE: reservas/idReserva" });
    }
})

// Devuelve las reservas de un espacio de un mes y año especifico
app.get("/reservas/espacios/mes/:id_espacio/:año/:mes", async (req, res) => {
    try {
        const result = await pool.query(`SELECT dia_reserva, hora_reserva FROM reservas WHERE id_espacio = ${req.params.id_espacio} AND mes_reserva = ${req.params.mes} AND año_reserva = ${req.params.año} ORDER BY dia_reserva, hora_reserva;`);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error : "DB error en el metodo GET: reservas/espacios/mes/:id_espacio/:año/:mes" });
    }
});

// Modifica el estado de autorizacion de una reserva 
app.patch("/reservas/autorizar", async (req, res) => {
    try {
        const idReserva = req.body.idReserva;
        const query = `UPDATE reservas SET reserva_confirmada = TRUE WHERE id = ${idReserva} RETURNING *`;
        const result = await pool.query(query);
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({error: "DB error en el metodo PATCH reservas/autorizar" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localunuhost:" + PORT);
});

