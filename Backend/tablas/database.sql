CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR (100),
    username VARCHAR(100) NOT NULL,
    contraseña VARCHAR(200) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    biografia VARCHAR(150),
    redSocial VARCHAR(150),
    linkFotoPerfil TEXT,
    contacto VARCHAR(30)
);

CREATE TABLE bandas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    fechaCreacion DATE,
    descripcion VARCHAR(150),
    redSocial VARCHAR(100),
    contraseñaParaIngresar VARCHAR(50),
    linkfotobanda TEXT
);

CREATE TABLE espacios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    ubicacion VARCHAR(150) NOT NULL,
    linkFotoEspacio TEXT,
    horarioApertura INT,
    horarioCierre INT,
    diasAbierto VARCHAR(10),
    descripcion VARCHAR(150),
    contacto VARCHAR(100),
    tamaño VARCHAR(20),
    precioPorHora INT,
    id_dueño INT,
    FOREIGN KEY (id_dueño) REFERENCES usuarios(id) ON DELETE CASCADE,
    buscanMiembrosNuevos BOOLEAN DEFAULT TRUE
);

CREATE TABLE generos_usuarios (
    id_usuario INT,
    genero VARCHAR(30),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE instrumentos (
    id_usuario INT,
    instrumento VARCHAR(30),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE integrantes_bandas (
    id_banda INT,
    id_integrante INT,
    PRIMARY KEY (id_banda, id_integrante),
    FOREIGN KEY (id_banda) REFERENCES bandas(id) ON DELETE CASCADE,
    FOREIGN KEY (id_integrante) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE generos_bandas (
    id_banda INT,
    genero VARCHAR(30),
    FOREIGN KEY (id_banda) REFERENCES bandas(id) ON DELETE CASCADE
);

CREATE TABLE contactos_usuarios (
    id_usuario INT,
    id_contacto_usuario INT,
    PRIMARY KEY (id_usuario, id_contacto_usuario),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_contacto_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE contactos_bandas (
    id_usuario INT,
    id_contacto_bandas INT,
    PRIMARY KEY (id_usuario, id_contacto_bandas),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_contacto_bandas) REFERENCES bandas(id) ON DELETE CASCADE
);

CREATE TABLE contactos_espacios (
    id_usuario INT,
    id_contacto_espacio INT,
    PRIMARY KEY (id_usuario, id_contacto_espacio),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_contacto_espacio) REFERENCES espacios(id) ON DELETE CASCADE
);

CREATE TABLE reservas (
    id_usuario INT,
    id_espacio INT, 
    hora_reserva INT,
    dia_reserva INT,
    mes_reserva INT,
    año_reserva INT,
    PRIMARY KEY (id_espacio, hora_reserva, dia_reserva, mes_reserva, año_reserva),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_espacio) REFERENCES espacios(id) ON DELETE CASCADE
);