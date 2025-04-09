CREATE DATABASE GestionTrabajosGrado;

USE GestionTrabajosGrado;

CREATE TABLE usuario(
	id INT PRIMARY KEY AUTO_INCREMENT,
	nombre VARCHAR(100),
	contraseña VARCHAR(256),
	correo VARCHAR(256),
	fecha_ingreso DATETIME,
	imagen VARCHAR(2500),
	genero VARCHAR(1),
    fecha_ultimo_ingreso DATETIME,
    estado CHAR(1),
    telefono VARCHAR(15),
    direccion VARCHAR(256),
    id_escuela INT,
    
    UNIQUE (correo),
    FOREIGN KEY(id_escuela) REFERENCES escuela(id)
    
);

CREATE TABLE usuario_escuelas(
	id_usuario INT NOT NULL,
    id_escuela INT NOT NULL,
    
	PRIMARY KEY(id_usuario, id_escuela),
    
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION,
    
    FOREIGN KEY (id_escuela) REFERENCES escuela(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE facultad(
	id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(80),
    estado char(1)
);

CREATE TABLE escuela(
	id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    estado char(1),
    id_facultad INT,
    
    FOREIGN KEY(id_facultad) REFERENCES facultad(id)
);

CREATE TABLE especializacion(
	id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50)
);

CREATE TABLE asesor(
	id INT PRIMARY KEY AUTO_INCREMENT,
    disponibilidad char(1),
    id_usuario int,
    
    FOREIGN KEY(id_usuario) REFERENCES usuario(id)
);

CREATE TABLE asesor_trabajos(
	id_asesor INT NOT NULL,
    id_trabajo INT NOT NULL,
    rol_asesor VARCHAR(20),
    
	PRIMARY KEY(id_asesor, id_trabajo),
    
    FOREIGN KEY (id_asesor) REFERENCES asesor(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION,
    
    FOREIGN KEY (id_trabajo) REFERENCES trabajos_de_grado(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE asesor_especializacion(
	id_asesor INT NOT NULL,
    id_especializacion INT NOT NULL,
    
	PRIMARY KEY(id_asesor, id_especializacion),
    
    FOREIGN KEY (id_asesor) REFERENCES asesor(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION,
    
    FOREIGN KEY (id_especializacion) REFERENCES especializacion(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE estudiante(
	id INT PRIMARY KEY AUTO_INCREMENT,
    matricula VARCHAR(8),
    creditos_aprobados INT,
    id_usuario int,
    
    UNIQUE (matricula),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);


CREATE TABLE trabajos_de_grado(
	id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    objetivo_general VARCHAR(100) NOT NULL,
    objetivos_especificos TEXT NOT NULL,
    justificacion TEXT NOT NULL,
    progreso TINYINT NOT NULL,
    planteamiento TEXT NOT NULL,
    anteproyecto VARCHAR(2500),
    trabajo VARCHAR(2500),
    estado VARCHAR(30),
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    id_propuesta INT, 
    
    FOREIGN KEY (id_propuesta) REFERENCES propuestas(id)
    
);

CREATE TABLE estudiante_trabajo(
	id_estudiante INT NOT NULL,
    id_trabajo INT NOT NULL,
    
    PRIMARY KEY(id_estudiante, id_trabajo),
    
    FOREIGN KEY (id_estudiante) REFERENCES estudiante(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION,
    
    FOREIGN KEY (id_trabajo) REFERENCES trabajos_de_grado(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION
    
);

CREATE TABLE eventos(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    fecha DATETIME NOT NULL,
    descripcion TEXT,
    id_trabajo INT NOT NULL,
    id_usuario INT NOT NULL,
    
    FOREIGN KEY(id_trabajo) REFERENCES trabajos_de_grado(id),
    FOREIGN KEY(id_usuario) REFERENCES usuario(id)
    
);

CREATE TABLE propuestas(
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    tipo_trabajo VARCHAR(30),
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    estado VARCHAR(30),	
    id_director INT NOT NULL,
    id_investigacion INT NOT NULL,
    
    FOREIGN KEY(id_director) REFERENCES director(id),
	FOREIGN KEY(id_investigacion) REFERENCES linea_investigacion(id)
  
);

CREATE TABLE director(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_escuela INT NOT NULL,
    id_usuario INT NOT NULL,
    
    FOREIGN KEY(id_escuela) REFERENCES escuela(id),
    FOREIGN KEY(id_usuario) REFERENCES usuario(id)
    
);
 
CREATE TABLE estudiante_propuesta(
	id_estudiante INT NOT NULL,
    id_propuesta INT NOT NULL,
    
    PRIMARY KEY(id_estudiante, id_propuesta),
    
	FOREIGN KEY (id_estudiante) REFERENCES estudiante(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION,
    
    FOREIGN KEY (id_propuesta) REFERENCES propuestas(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION
    
);	
 
CREATE TABLE historial_de_cambios(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100),
    fecha DATETIME,
    descripcion TEXT,
    id_trabajo INT,
    id_propuesta INT,
    id_autor INT NOT NULL,
    
    FOREIGN KEY(id_trabajo) REFERENCES trabajos_de_grado(id),
    FOREIGN KEY(Id_propuesta) REFERENCES propuestas(id),
	FOREIGN KEY(id_autor) REFERENCES usuario(id)
);
 
CREATE TABLE linea_investigacion(
	id INT PRIMARY KEY,
    nombre VARCHAR(50),
    estado CHAR(1),
    id_escuela INT,
    
    FOREIGN KEY(id_escuela) REFERENCES escuela(id)
    
);
 
CREATE TABLE jurado(
	id INT PRIMARY KEY,
    disponibilidad varchar(20),
    id_usuario INT NOT NULL,
    
    FOREIGN KEY(id_usuario) REFERENCES usuario(id)
    
);
 
CREATE TABLE jurados_trabajos(
	id_jurado INT,
    id_trabajo INT,
    
    PRIMARY KEY(id_jurado, id_trabajo),
    
	FOREIGN KEY (id_jurado) REFERENCES jurado(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION,
    
    FOREIGN KEY (id_trabajo) REFERENCES trabajos_de_grado(id)
    ON DELETE NO ACTION ON UPDATE NO ACTION    
);