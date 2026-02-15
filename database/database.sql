-- DDL: Creación de la Estructura
IF OBJECT_ID('dbo.solicitudes', 'U') IS NOT NULL
    DROP TABLE dbo.solicitudes;

CREATE TABLE solicitudes (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    titulo NVARCHAR(100) NOT NULL,
    descripcion NVARCHAR(MAX) NOT NULL,
    prioridad NVARCHAR(10) CHECK (prioridad IN ('Alta', 'Media', 'Baja')),
    estado NVARCHAR(20) DEFAULT 'Nuevo' CHECK (estado IN ('Nuevo', 'En Proceso', 'Resuelto', 'Cerrado')),
    solicitante NVARCHAR(100) NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    fecha_actualizacion DATETIME NULL,
    activo BIT NOT NULL DEFAULT 1
);

-- DML: Datos Iniciales (Mínimo 10 registros)
INSERT INTO solicitudes 
(titulo, descripcion, prioridad, estado, solicitante, fecha_creacion, fecha_actualizacion)
VALUES 
('Error al iniciar sesión', 'El sistema no permite iniciar sesión.', 'Alta', 'Nuevo', 'Juan Pérez', '2026-02-01 08:15:00', '2026-02-02 09:30:00'),
('Acceso a reportes', 'Se requiere acceso al módulo financiero.', 'Media', 'En Proceso', 'María López', '2026-02-03 10:00:00', '2026-02-05 11:45:00'),
('Actualización de datos', 'Cambio de número de teléfono.', 'Baja', 'Resuelto', 'Carlos Ramírez', '2026-02-02 14:20:00', '2026-02-04 16:00:00'),
('Falla en PDF', 'Error al generar comprobantes.', 'Alta', 'En Proceso', 'Ana Torres', '2026-02-06 09:10:00', '2026-02-08 13:25:00'),
('Cierre de cuenta', 'Solicitud de baja definitiva.', 'Media', 'Cerrado', 'Luis Gómez', '2026-02-04 12:00:00', '2026-02-07 15:40:00'),
('Lentitud en sistema', 'La carga de tablas demora más de 10s.', 'Alta', 'Nuevo', 'Sofía Castro', '2026-02-07 08:50:00', '2026-02-09 10:10:00'),
('Nueva funcionalidad', 'Sugerencia de modo oscuro.', 'Baja', 'Nuevo', 'Pedro Picapiedra', '2026-02-09 11:30:00', '2026-02-11 14:15:00'),
('Error de tipografía', 'Error ortográfico en el menú lateral.', 'Baja', 'En Proceso', 'Laura Rivas', '2026-02-10 09:00:00', '2026-02-12 17:20:00'),
('Recuperar contraseña', 'El correo de recuperación no llega.', 'Media', 'Nuevo', 'Roberto Díaz', '2026-02-11 07:45:00', '2026-02-13 12:00:00'),
('Backup de datos', 'Solicitud de respaldo de la última semana.', 'Alta', 'Resuelto', 'Elena Nito', '2026-02-12 10:30:00', '2026-02-15 18:00:00');

-- Consulta de Listado
SELECT * FROM solicitudes
WHERE estado = 'Nuevo' OR prioridad = 'Alta'
ORDER BY fecha_creacion DESC;