CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contraseña VARCHAR(200) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    instrumentos VARCHAR(150),
    generos_favoritos VARCHAR(150),
    biografia VARCHAR(150),
    redes_sociales VARCHAR(150)
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
    precio_por_hora INT
);

CREATE TABLE bandas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    generos VARCHAR(100),
    fecha_creacion INT,
    descripcion VARCHAR(150),
    redes_sociales VARCHAR(100)
);
