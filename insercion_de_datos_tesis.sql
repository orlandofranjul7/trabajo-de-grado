-- Consultas para insertar datos iniciales a la BD

-- Facultad
INSERT INTO facultad (nombre, estado) VALUES 
('Facultad de Arquitectura y Artes', 'A'),
('Facultad de Ciencias y Tecnología', 'A'),
('Facultad de Humanidades y Educación', 'A'),
('Facultad de Económicas y Sociales', 'A'),
('Facultad de Ciencias de la Salud', 'A');

-- Escuela
INSERT INTO escuela (nombre, estado, id_facultad) VALUES 
('Escuela de Informática', 'A', 2),
('Escuela de Arquitectura', 'A', 1),
('Escuela de Medicina', 'A', 5),
('Escuela de Psicología', 'A', 3),
('Escuela de Mercadotecnia', 'A', 4);

-- Usuario
INSERT INTO usuario (nombre, contraseña, correo, fecha_ingreso, imagen, genero, fecha_ultimo_ingreso, estado, telefono, direccion, id_escuela) VALUES 
('Orlando Franjul', 'hashed_password1', 'orlando.franjul@unphu.edu', '2023-01-15 08:30:00', '/path/to/img1.jpg', 'M', '2023-09-01 09:00:00', 'A', '8095551234', 'Calle 1, Ciudad', 2),
('Ana García', 'hashed_password2', 'ana.garcia@unphu.edu', '2023-02-10 10:00:00', '/path/to/img2.jpg', 'F', '2023-09-02 10:30:00', 'A', '8095555678', 'Calle 2, Ciudad', 1),
('Carlos Gómez', 'hashed_password3', 'carlos.gomez@unphu.edu', '2023-03-05 11:15:00', '/path/to/img3.jpg', 'M', '2023-09-03 11:45:00', 'A', '8095559101', 'Calle 3, Ciudad', 3),
('Maria Martínez', 'hashed_password4', 'maria.martinez@unphu.edu', '2023-04-20 14:00:00', '/path/to/img4.jpg', 'F', '2023-09-04 14:30:00', 'A', '8095551122', 'Calle 4, Ciudad', 4),
('Hector Hernández', 'hashed_password5', 'hector.hernandez@unphu.edu', '2023-05-18 16:30:00', '/path/to/img5.jpg', 'M', '2023-09-05 17:00:00', 'A', '8095553344', 'Calle 5, Ciudad', 5);

-- Estudiante
INSERT INTO estudiante (matricula, creditos_aprobados, id_usuario) VALUES 
('200354', 200, 2),
('189040', 115, 1);
/*
('217865', 110, 3),
('191873', 100, 4),
('20231115', 90, 5);
*/
-- Propuesta

INSERT INTO propuestas (tipo_trabajo, titulo, descripcion, estado, id_director, id_investigacion) VALUES 
('Tesis', 'Optimización de Procesos', 'Descripción de optimización', 'Aprobada', 1, 1),
('Proyecto', 'Sistema de Gestión', 'Descripción del sistema', 'En Espera', 1, 1),
('Tesis', 'Análisis de Redes', 'Descripción de redes', 'Rechazada', 1, 2),
('Proyecto', 'Aplicación Móvil', 'Descripción de app', 'En Espera', 1, 2),
('Tesis', 'Plataforma Educativa', 'Descripción de plataforma', 'Aprobada', 1, 3);

-- Trabajos de grado 

INSERT INTO trabajos_de_grado (titulo, descripcion, objetivo_general, objetivos_especificos, justificacion, progreso, planteamiento, anteproyecto, trabajo, estado, fecha_inicio, fecha_fin, id_propuesta) VALUES 
('Optimización de Procesos', 'Trabajo sobre procesos', 'Optimizar procesos', 'Específicos de procesos', 'Justificación 1', 75, 'Planteamiento 1', '/path/anteproyecto1.pdf', '/path/trabajo1.pdf', 'En Proceso', '2023-01-15 08:30:00', '2023-12-15 08:30:00', 1),
('Sistema de Gestión', 'Trabajo sobre gestión', 'Mejorar gestión', 'Específicos de gestión', 'Justificación 2', 50, 'Planteamiento 2', '/path/anteproyecto2.pdf', '/path/trabajo2.pdf', 'En Proceso', '2023-02-10 10:00:00', '2023-11-10 10:00:00', 2),
('Análisis de Redes', 'Trabajo sobre redes', 'Analizar redes', 'Específicos de redes', 'Justificación 3', 30, 'Planteamiento 3', '/path/anteproyecto3.pdf', '/path/trabajo3.pdf', 'En Revisión', '2023-03-05 11:15:00', '2023-10-05 11:15:00', 3),
('Aplicación Móvil', 'Trabajo sobre apps', 'Desarrollar apps', 'Específicos de apps', 'Justificación 4', 90, 'Planteamiento 4', '/path/anteproyecto4.pdf', '/path/trabajo4.pdf', 'Finalizado', '2023-04-20 14:00:00', '2023-09-20 14:00:00', 4),
('Plataforma Educativa', 'Trabajo sobre plataforma', 'Crear plataforma', 'Específicos de plataforma', 'Justificación 5', 100, 'Planteamiento 5', '/path/anteproyecto5.pdf', '/path/trabajo5.pdf', 'Aprobado', '2023-05-18 16:30:00', '2023-10-18 16:30:00', 5);

-- Linea de investigacion

INSERT INTO linea_investigacion (id, nombre, estado, id_escuela) VALUES 
(1, 'Inteligencia Artificial', 'A', 2),
(2, 'Redes de Computadoras', 'A', 2),
(3, 'Desarrollo de Software', 'A', 2),
(4, 'Sistemas Embebidos', 'A', 2),
(5, 'Computación Cuántica', 'A', 2),
(6, 'Operaciones Médicas', 'A', 5),
(7, 'Neurociencia y Cognición', 'A', 3);

-- Director

INSERT INTO director (id, id_escuela, id_usuario) VALUES 
(1, 2, 3);
-- Jurado

INSERT INTO jurado (id, disponibilidad, id_usuario) VALUES 
(1, 'Disponible', 2),
(2, 'No Disponible', 3),
(3, 'Disponible', 4),
(4, 'Disponible', 5),
(5, 'No Disponible', 1);

-- Especializacion

INSERT INTO especializacion (id, nombre) VALUES 
(1, 'Redes de Datos'),
(2, 'Desarrollo de Aplicaciones'),
(3, 'Ciberseguridad'),
(4, 'Inteligencia Artificial'),
(5, 'Gestión de Proyectos');

-- Asesor

INSERT INTO asesor (id, disponibilidad, id_usuario) VALUES 
(1, 'Y', 4);
/*
(2, 'Disponible', 2),
(3, 'No Disponible', 3),
(4, 'Disponible', 4),
(5, 'Disponible', 5);
*/
-- Asesor_Especializacion

INSERT INTO asesor_especializacion (id_asesor, id_especializacion) VALUES 
(1, 2);

-- Estudiante_Trabajo

INSERT INTO estudiante_trabajo (id_estudiante, id_trabajo) VALUES 
(1, 1),
(2, 1);
/*
(3, 2),
(4, 3),
(5, 4);
*/

-- Jurado_Trabajos

INSERT INTO jurados_trabajos (id_jurado, id_trabajo) VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Eventos

INSERT INTO eventos (titulo, fecha, descripcion, id_trabajo, id_usuario) VALUES 
('Revisión inicial', '2024-01-10 10:00:00', 'Revisión inicial de avances.', 1, 4);
/*
('Primera evaluación', '2024-02-15 14:00:00', 'Evaluación del capítulo 1.', 2, 2),
('Entrega final', '2024-05-20 16:00:00', 'Entrega del trabajo final.', 3, 3),
('Revisión intermedia', '2024-03-10 11:00:00', 'Revisión de avances generales.', 4, 4),
('Entrega anteproyecto', '2024-04-05 09:00:00', 'Revisión del anteproyecto.', 5, 5
*/

-- Historial de cambios

INSERT INTO historial_de_cambios (titulo, fecha, descripcion, id_trabajo, id_propuesta, id_autor) VALUES 
('Actualización de título', '2024-01-15 10:30:00', 'Se actualizó el título del trabajo.', 1, 1, 1),
('Modificación de objetivos', '2024-02-10 11:00:00', 'Se corrigieron los objetivos específicos.', 2, 2, 2),
('Cambio en la justificación', '2024-03-05 14:00:00', 'Se ajustó la justificación del proyecto.', 3, 3, 3),
('Actualización de progreso', '2024-04-01 09:15:00', 'Se registró un avance del 80%.', 4, 4, 4),
('Entrega de versión final', '2024-05-20 17:00:00', 'Se subió la versión final del trabajo.', 5, 5, 5);

-- Usuario_Escuelas 
INSERT INTO usuario_escuelas (id_usuario, id_escuela) VALUES 
(1, 2),
(2, 2);

     



