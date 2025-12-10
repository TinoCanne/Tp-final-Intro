CREATE TABLE espacios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    ubicacion VARCHAR(150) NOT NULL,
    linkFotoEspacio VARCHAR(250),
    descripcion VARCHAR(150),
    contacto VARCHAR(100),
    horarios VARCHAR(150),
    tamaño VARCHAR(20),
    precioPorHora INT
);

CREATE TABLE bandas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fechaCreacion INT,
    descripcion VARCHAR(150),
    redSocial VARCHAR(100)
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR (100),
    username VARCHAR(100) NOT NULL,
    contraseña VARCHAR(200) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    biografia VARCHAR(150),
    redSocial VARCHAR(150),
    linkFotoPerfil VARCHAR(300),
<<<<<<< HEAD
    id_bandas INT,
    FOREIGN KEY (id_bandas) REFERENCES bandas(id)
=======
    contacto VARCHAR(30),
    id_banda INT,
    FOREIGN KEY (id_banda) REFERENCES bandas(id)
>>>>>>> feature/miperfil
);

CREATE TABLE generos_usuarios (
    id_usuario INT,
    genero VARCHAR(30),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE instrumentos (
    id_usuario INT,
    instrumento VARCHAR(30),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE integrantes_bandas (
    id_banda INT,
    id_integrante INT,
    PRIMARY KEY (id_banda, id_integrante),
    FOREIGN KEY (id_banda) REFERENCES bandas(id),
    FOREIGN KEY (id_integrante) REFERENCES usuarios(id)
);

CREATE TABLE generos_bandas (
    id_banda INT,
    genero VARCHAR(30),
    FOREIGN KEY (id_banda) REFERENCES bandas(id)
);