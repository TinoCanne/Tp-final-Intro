CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR (100),
    username VARCHAR(100) NOT NULL,
    contraseña VARCHAR(200) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    instrumentos VARCHAR(150),
    generosFavoritos VARCHAR(150),
    biografia VARCHAR(150),
    redesSociales VARCHAR(150),
    linkFoto = VARCHAR(300)
);

CREATE TABLE espacios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    ubicacion VARCHAR(150) NOT NULL,
    fotos VARCHAR(250),
    descripcion VARCHAR(150),
    contacto VARCHAR(100),
    horarios VARCHAR(150),
    tamaño VARCHAR(20),
    precioPorHora INT
);

CREATE TABLE bandas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    generos VARCHAR(100),
    fechaCreacion INT,
    descripcion VARCHAR(150),
    redesSociales VARCHAR(100)
);
