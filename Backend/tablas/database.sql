CREATE TABLE bandas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    fechaCreacion INT,
    descripcion VARCHAR(150),
    redSocial VARCHAR(100),
    contraseñaParaIngresar VARCHAR(50)
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
    contacto VARCHAR(30),
    id_banda INT,
    FOREIGN KEY (id_banda) REFERENCES bandas(id)
);

CREATE TABLE espacios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    ubicacion VARCHAR(150) NOT NULL,
    linkFotoEspacio VARCHAR(5000),
    descripcion VARCHAR(150),
    contacto VARCHAR(100),
    tamaño VARCHAR(20),
    precioPorHora INT,
    idUsuarioPropietario INT,
    FOREIGN KEY (idUsuarioPropietario) REFERENCES usuarios(id)
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

CREATE TABLE contactos_usuarios (
    id_usuario INT,
    id_contacto_usuario INT,
    PRIMARY KEY (id_usuario, id_contacto_usuario),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_contacto_usuario) REFERENCES usuarios(id)
);

CREATE TABLE contactos_bandas (
    id_usuario INT,
    id_contacto_bandas INT,
    PRIMARY KEY (id_usuario, id_contacto_bandas),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_contacto_bandas) REFERENCES bandas(id)
);

CREATE TABLE contactos_espacios (
    id_usuario INT,
    id_contacto_espacio INT,
    PRIMARY KEY (id_usuario, id_contacto_espacio),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_contacto_espacio) REFERENCES espacios(id)
);