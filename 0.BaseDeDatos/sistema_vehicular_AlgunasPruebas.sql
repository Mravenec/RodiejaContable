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

/* 8‑A) EGRESO: registro de la COMPRA del vehículo
   (monto = precio_compra + costo_grua + comisiones = 10,150,000) */
INSERT INTO transacciones_financieras
        (fecha, tipo_transaccion_id, vehiculo_id, generacion_id,
         monto, descripcion, referencia, estado)
VALUES  ('2023-05-01',
         1,                    -- id de “Compra Vehículo”
         1,                    -- vehiculo_id
         1,                    -- generacion_id
         10250000.00,
         'Compra Toyota Corolla gen12',
         'Factura #C-2023-0001',
         'COMPLETADA');


/* Registramos la venta del repuesto */
INSERT INTO transacciones_financieras
        (fecha, tipo_transaccion_id, empleado_id,
         vehiculo_id, repuesto_id, generacion_id,
         monto, comision_empleado,
         descripcion, referencia, estado)
VALUES  (CURDATE(),             -- hoy
         @id_venta_repuesto,    -- tipo “Venta Repuesto”
         1,                     -- empleado que vendió
         1,                     -- vehiculo_id para que sume al vehículo
         1,                     -- repuesto_id
         1,                     -- generacion_id
         2_000_000.00,          -- precio de venta
         100_000.00,            -- comisión al empleado
         'Venta Motor 1.8L Turbo',
         'Factura #VR-2025-0001',
         'COMPLETADA');


SELECT * FROM transacciones_financieras;  -- Ver códigos generados y campos calculados

-- ========================================
-- 9. EJEMPLOS DE REGISTROS EN HISTORIAL DE AUDITORÍA (2 datos)
-- ========================================
-- Cambio de estado del vehículo
UPDATE vehiculos SET estado = 'VENDIDO' WHERE id = 1;
SELECT * FROM vehiculos;  -- Ver estado actualizado

INSERT INTO historial_vehiculos (vehiculo_id, accion, campo_modificado, valor_anterior, valor_nuevo, usuario) 
VALUES (1, 'UPDATE', 'estado', 'DISPONIBLE', 'VENDIDO', 'admin');

-- Cambio de precio de repuesto
UPDATE inventario_repuestos SET precio_venta = 2200000.00 WHERE id = 1;
SELECT * FROM inventario_repuestos;  -- Ver precio actualizado

INSERT INTO historial_repuestos (repuesto_id, accion, campo_modificado, valor_anterior, valor_nuevo, usuario) 
VALUES (1, 'UPDATE', 'precio_venta', '2000000.00', '2200000.00', 'admin');

-- Ver registros de auditoría
SELECT * FROM historial_vehiculos;
SELECT * FROM historial_repuestos;