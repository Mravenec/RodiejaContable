USE sistema_vehicular;

-- ========================================
-- 1. POBLAR MARCAS 
-- ========================================
INSERT INTO marcas (nombre) VALUES
('Toyota'),   -- id = 1
('Honda');    -- id = 2
SELECT * FROM marcas;

-- ========================================
-- 2. POBLAR MODELOS 
-- ========================================
INSERT INTO modelos (marca_id, nombre) VALUES
(1, 'Corolla'),  -- id = 1  (Toyota)
(2, 'Civic');    -- id = 2  (Honda)
SELECT * FROM modelos;

-- ========================================
-- 3. POBLAR GENERACIONES 
-- ========================================
INSERT INTO generaciones (modelo_id, nombre, descripcion, anio_inicio, anio_fin) VALUES
(1, 'gen12', 'Duodécima generación E210', 2020, 2024),       -- id = 1  (Corolla)
(2, 'gen10', 'Décima generación FC/FK',    2016, 2021);      -- id = 2  (Civic)
SELECT * FROM generaciones;

-- ========================================
-- 4. POBLAR EMPLEADOS 
-- ========================================
INSERT INTO empleados (nombre) VALUES
('ACXEL'),
('ADRIANA'),
('AMAURIS'),
('CACHORRO'),
('DIEGO'),
('JHONATHAN'),
('LUIS MIRANDA'),
('NALLELY'),
('VICTORIA');
SELECT * FROM empleados;

-- ========================================
-- 5. POBLAR TIPOS DE TRANSACCIONES 
-- ========================================
INSERT INTO tipos_transacciones (nombre, descripcion, categoria) VALUES
('Venta Vehículo', 'Ingreso por venta de vehículo completo', 'INGRESO'),
('Venta Repuesto', 'Ingreso por venta de repuesto individual', 'INGRESO'),
('Venta Mayoreo', 'Ingreso por venta al mayoreo', 'INGRESO'),
('Servicios Mecánicos', 'Ingreso por servicios de mecánica', 'INGRESO'),
('Alquiler Espacio', 'Ingreso por alquiler de espacio en yonke', 'INGRESO'),
('Compra Vehículo', 'Egreso por compra de vehículo', 'EGRESO'),
('Compra Repuesto', 'Egreso por compra de repuesto', 'EGRESO'),
('Reparación Vehículo', 'Egreso por reparaciones de vehículo', 'EGRESO'),
('Mantenimiento Local', 'Egreso por mantenimiento del local', 'EGRESO'),
('Comisión Vendedor', 'Egreso por comisión a vendedor', 'EGRESO'),
('Costo Grúa', 'Egreso por servicio de grúa', 'EGRESO'),
('Transporte', 'Egreso por transporte de vehículos', 'EGRESO'),
('Combustible', 'Egreso por combustible', 'EGRESO'),
('Servicios Públicos', 'Egreso por electricidad, agua, teléfono', 'EGRESO'),
('Impuestos', 'Egreso por impuestos y patentes', 'EGRESO'),
('Otros Ingresos', 'Otros ingresos diversos', 'INGRESO'),
('Otros Egresos', 'Otros egresos diversos', 'EGRESO');
SELECT * FROM tipos_transacciones;

-- ========================================
-- 6. POBLAR VEHÍCULOS 
-- ========================================
/* Vehículo 1 – Toyota Corolla gen12 */
INSERT INTO vehiculos (
    generacion_id, anio, precio_compra, costo_grua, comisiones,
    fecha_ingreso, estado
) VALUES (
    1, 2023, 10000000.00, 50000.00, 100000.00,
    '2023-05-01', 'DISPONIBLE'
);

/* Vehículo 2 – Honda Civic gen10 (para repuestos) */
INSERT INTO vehiculos (
    generacion_id, anio, precio_compra, costo_grua, comisiones,
    fecha_ingreso, estado
) VALUES (
    2, 2018, 6000000.00, 40000.00, 80000.00,
    '2023-04-15', 'DESARMADO'
);
SELECT * FROM vehiculos;


-- ========================================
-- 7. POBLAR INVENTARIO DE REPUESTOS (1 dato)
-- ========================================
INSERT INTO inventario_repuestos (
    vehiculo_origen_id, parte_vehiculo, descripcion,
    precio_costo, precio_venta, precio_mayoreo,
    bodega, zona, pared, malla, estante, piso,
    estado, condicion, fecha_creacion
) VALUES (
    2,                               -- vehiculo_origen_id (Honda Civic 2018)
    'MOTOR',                         -- parte_vehiculo
    'Motor 1.5 L Turbo VTEC',        -- descripcion
    1200000.00,                      -- precio_costo
    1800000.00,                      -- precio_venta
    1500000.00,                      -- precio_mayoreo (ejemplo ± 25 %)
    'C-',                            -- bodega
    'Z1-',                           -- zona
    'PE-',                           -- pared
    'V5',                            -- malla
    'E1',                            -- estante
    'P2-',                           -- piso
    'STOCK',                         -- estado
    '50%-',                          -- condicion (usado en buen estado)
    '2023-05-12'                     -- fecha_creacion (triggers calculan año/mes)
);

SELECT * FROM inventario_repuestos; -- Ver códigos generados automáticos

-- ========================================
-- 8. POBLAR TRANSACCIONES FINANCIERAS (2 datos)
-- ========================================

-- A) Venta del repuesto (motor Civic 1.5L Turbo).
INSERT INTO transacciones_financieras (
    fecha, tipo_transaccion_id, empleado_id,
    repuesto_id, monto, comision_empleado,
    descripcion, referencia
) VALUES (
    '2023-06-01',         -- Fecha de la venta
    2,                    -- tipo_transaccion_id = 2 (Venta Repuesto)
    1,                    -- empleado_id = 1 (ACXEL)
    1,                    -- repuesto_id = 1
    1800000.00,           -- monto de venta
    25000.00,             -- comisión al vendedor
    'Venta Motor Civic 1.5L Turbo', 
    'VENTA-REP-001'
);


-- B) Venta del Toyota Corolla 2023 (vehiculo_id = 1)

INSERT INTO transacciones_financieras (
    fecha, tipo_transaccion_id, empleado_id,
    vehiculo_id, monto, comision_empleado,
    descripcion, referencia
) VALUES (
    '2023-06-05',          -- Fecha de venta
    1,                     -- tipo_transaccion_id = 1 (Venta Vehículo)
    2,                     -- empleado_id = 2 (ADRIANA)
    1,                     -- vehiculo_id = 1 (Corolla)
    12000000.00,           -- monto
    60000.00,              -- comisión al vendedor
    'Venta Toyota Corolla 2023',
    'VENTA-COROLLA-001'
);

SELECT * FROM transacciones_financieras;  -- Ver códigos generados y campos calculados

-- ========================================
-- 9. EJEMPLOS DE REGISTROS EN HISTORIAL DE AUDITORÍA (2 datos)
-- ========================================

-- Visualizar todos los cambios auditados (vehículos, repuestos y transacciones)
SELECT * FROM vista_auditoria_completa;

-- 🔍 Filtrar por tipo de entidad si deseas:

-- Cambios en vehículos (estado, precio_venta, etc.)
SELECT * FROM vista_auditoria_completa WHERE tipo_entidad = 'Vehículo';

-- Cambios en repuestos (estado, precio_venta)
SELECT * FROM vista_auditoria_completa WHERE tipo_entidad = 'Repuesto';

-- Cambios en transacciones (monto, comisiones, etc.)
SELECT * FROM vista_auditoria_completa WHERE tipo_entidad = 'Transacción';

-- 📘 Historial completo de un vehículo específico (por ID)
CALL sp_historial_vehiculo(1);

-- 🗓️ Actividad de auditoría entre fechas específicas
CALL sp_actividad_auditoria_fecha('2023-05-01', '2023-07-01');

-- ========================================
-- Ejemplo de reparacion de automovil
-- ========================================



-- ========================================
-- 1. Agregar Modelo y Generación Hilux
-- ========================================

-- Modelo Hilux para Toyota (marca_id = 1)
INSERT INTO modelos (marca_id, nombre) VALUES
(1, 'Hilux');           -- id = 3

-- Generación gen8 de Hilux (supón 2016-2023)
INSERT INTO generaciones (modelo_id, nombre, descripcion, anio_inicio, anio_fin)
VALUES (3, 'gen8', 'Octava generación Hilux', 2016, 2023);  -- id = 3


SELECT * FROM marcas;
SELECT * FROM modelos;
SELECT * FROM generaciones;

-- ========================================
-- 2. Ingresar el Vehículo Dañado
-- ========================================
-- Ingresar Hilux 2020 en estado REPARACION
INSERT INTO vehiculos (
    generacion_id, anio, precio_compra, costo_grua, comisiones,
    fecha_ingreso, estado, notas
) VALUES (
    3, 2020, 8000000.00, 45000.00, 90000.00,   -- Ejemplo de costos
    '2024-06-10', 'REPARACION',
    'Vehículo ingresado con daño en motor y carrocería, apto para reparación'
);

SELECT * FROM vehiculos;


-- (El trigger genera código y registra compra automáticamente)

-- ========================================
-- 3. Registrar Gastos de Reparación
-- ========================================

-- Supongamos 2 egresos: repuesto motor y repintado.

-- Egreso: compra motor usado (egreso, sin repuesto ligado)
INSERT INTO transacciones_financieras (
    fecha, tipo_transaccion_id, vehiculo_id, generacion_id, monto,
    descripcion, referencia
) VALUES (
    '2024-06-15', 
    7,    -- tipo_transaccion_id = 7: 'Compra Repuesto'
    3,    -- vehiculo_id = 3 (el Hilux)
    3,    -- generacion_id = 3
    600000.00, 
    'Compra motor usado para Hilux reparación', 
    'REP-HILUX-MOTOR-001'
);

-- Egreso: pintura completa (servicio externo)
INSERT INTO transacciones_financieras (
    fecha, tipo_transaccion_id, vehiculo_id, generacion_id, monto,
    descripcion, referencia
) VALUES (
    '2024-06-18',
    8,    -- tipo_transaccion_id = 8: 'Reparación Vehículo'
    3,    -- vehiculo_id = 3
    3,    -- generacion_id = 3
    250000.00, 
    'Pintura completa Hilux 2020', 
    'SERV-PINTURA-001'
);


SELECT * FROM generaciones;
SELECT * FROM vehiculos;
SELECT * FROM transacciones_financieras; 
-- ========================================
-- 3. Cambiar el Estado del Vehículo a DISPONIBLE (opcional, para marcarlo listo para venta)
-- ========================================
SELECT * FROM vehiculos;
SELECT * FROM generaciones;

UPDATE vehiculos
SET estado = 'DISPONIBLE',
    notas = CONCAT(
        COALESCE(notas, ''), 
        '\n[2024-06-20] Reparación finalizada: motor y pintura. Vehículo listo para venta.'
    )
WHERE id = 3;

-- ========================================
-- 4. Registrar la Venta del Hilux Reparado
-- ========================================
INSERT INTO transacciones_financieras (
    fecha, tipo_transaccion_id, empleado_id,
    vehiculo_id, monto, comision_empleado,
    descripcion, referencia
) VALUES (
    '2024-07-01',     -- Fecha de venta
    1,                -- tipo_transaccion_id = 1 (Venta Vehículo)
    5,                -- empleado_id = 5 (DIEGO)
    3,                -- vehiculo_id = 3 (Hilux)
    10900000.00,      -- monto de venta
    50000.00,         -- comisión al vendedor
    'Venta Hilux 2020 Reparado',
    'VENTA-HILUX-2020-001'
);
SELECT * FROM generaciones;
SELECT * FROM vehiculos;
SELECT * FROM transacciones_financieras; 


SELECT * FROM tipos_transacciones;