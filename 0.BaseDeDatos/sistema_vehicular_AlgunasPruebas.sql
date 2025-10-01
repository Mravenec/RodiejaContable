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
('Salarios', 'Egreso por planillas y cargas sociales', 'EGRESO'),
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
    CURRENT_DATE(), 'DISPONIBLE'
);

/* Vehículo 2 – Honda Civic gen10 (para repuestos) */
INSERT INTO vehiculos (
    generacion_id, anio, precio_compra, costo_grua, comisiones,
    fecha_ingreso, estado
) VALUES (
    2, 2018, 6000000.00, 40000.00, 80000.00,
    CURRENT_DATE(), 'DESARMADO'
);
SELECT * FROM vehiculos;
SELECT * FROM generaciones;
SELECT * FROM transacciones_financieras;

-- ========================================
-- 7. POBLAR INVENTARIO DE REPUESTOS (1 dato)
-- ========================================
INSERT INTO inventario_repuestos (
    vehiculo_origen_id, parte_vehiculo, descripcion,
    precio_costo, precio_venta, precio_mayoreo,
    bodega, zona, pared, malla, estante, piso,
    estado, condicion, fecha_creacion, imagen_url
) VALUES (
    2,                               -- vehiculo_origen_id (Honda Civic 2018)
    'MOTOR',                         -- parte_vehiculo
    'Motor 1.5 L Turbo VTEC',        -- descripcion
    1200000.00,                      -- precio_costo
    1800000.00,                      -- precio_venta
    1500000.00,                      -- precio_mayoreo (ejemplo ± 25 %)
    'C-',                            -- bodega
    'Z1-',                           -- zona
    'PE-',                           -- pared
    'V5',                            -- malla
    'E1',                            -- estante
    'P2-',                           -- piso
    'STOCK',                         -- estado
    '50%-',                          -- condicion (usado en buen estado)
    CURRENT_DATE(),                  -- fecha_creacion (triggers calculan año/mes)
    'https://tu-cdn.com/repuestos/motor_civic_15t.jpg'  -- ✅ imagen_url
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
    CURRENT_DATE(),       -- Fecha de la venta
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
    CURRENT_DATE(),        -- Fecha de venta
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
CALL sp_actividad_auditoria_fecha(CURRENT_DATE(), CURRENT_DATE());

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
    CURRENT_DATE(), 'REPARACION',
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
    CURRENT_DATE(), 
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
    CURRENT_DATE(),
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
        CONCAT('\n[', CURRENT_DATE(), '] Reparación finalizada: motor y pintura. Vehículo listo para venta.')
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
    CURRENT_DATE(),       -- Fecha de venta
    1,                    -- tipo_transaccion_id = 1 (Venta Vehículo)
    5,                    -- empleado_id = 5 (DIEGO)
    3,                    -- vehiculo_id = 3 (Hilux)
    10900000.00,          -- monto de venta
    50000.00,             -- comisión al vendedor
    'Venta Hilux 2020 Reparado',
    'VENTA-HILUX-2020-001'
);
SELECT * FROM generaciones;
SELECT * FROM vehiculos;
SELECT * FROM transacciones_financieras; 

-- ========================================
--  PROCESO: COMPRA → VENTA DE REPUESTOS SIN VEHÍCULO ORIGEN
-- ========================================
USE sistema_vehicular;

-- =========================================================
-- A) "Bomba de Agua" (Corolla gen12) – SIN comisión
-- =========================================================
SELECT * FROM generaciones;
SELECT * FROM vehiculos;
SELECT * FROM inventario_repuestos;
SELECT * FROM transacciones_financieras; 

-- A-1. Compra automática + alta en inventario
CALL sp_insertar_repuesto_con_generacion_sin_vehiculo(
    1, 'Toyota',                        -- p_generacion_id, p_marca_nombre
    'BOMBA DE AGUA',                    -- p_parte_vehiculo
    'Bomba de agua OEM Toyota Corolla', -- p_descripcion
    70000.00, 110000.00, 95000.00,      -- p_precio_costo, p_precio_venta, p_precio_mayoreo
    'R-', 'Z2-', 'PN-', 'V10', 'E2', 'P3-', -- p_bodega, p_zona, p_pared, p_malla, p_estante, p_piso
    'STOCK', '100%-',                   -- p_estado, p_condicion
    'https://tu-cdn.com/repuestos/bomba_corolla.jpg' -- p_imagen_url  ✅
);
-- Crea:
--   • inventario_repuestos (ej. id = 2)
--   • transacciones_financieras (tipo = Compra Repuesto)

-- A-2. Venta sin comisión – tipo 2 (Venta Repuesto)
-- ⚠️ Incluye generación_id explícita para asegurar actualización correcta
INSERT INTO transacciones_financieras (
    fecha, tipo_transaccion_id,
    empleado_id, repuesto_id, generacion_id,
    monto, comision_empleado,
    descripcion, referencia
) VALUES (
    CURRENT_DATE(), 2,     -- Venta Repuesto
    3, 2, 1,               -- AMAURIS vende repuesto id = 2, generación = Corolla
    110000.00, 0.00,
    'Venta Bomba de Agua Corolla gen12',
    'VENTA-REP-BA-COR-001'
);

-- =========================================================
-- B) "Kit Embrague" (Civic gen10) – CON comisión
-- =========================================================
SELECT * FROM vista_ventas_por_empleado;
SELECT * FROM generaciones;
SELECT * FROM vehiculos;
SELECT * FROM inventario_repuestos;
SELECT * FROM transacciones_financieras; 


-- B-1. Compra automática + alta (sin vehículo origen, con código único por generación)
CALL sp_insertar_repuesto_con_generacion_sin_vehiculo(
    2,                -- generación_id = 2 (Civic gen10)
    'Honda',          -- marca asociada a la generación
    'EMBRAGUE',       -- parte del vehículo
    'Kit embrague original Honda Civic',  -- descripción
    85000.00,         -- precio_costo
    140000.00,        -- precio_venta
    120000.00,        -- precio_mayoreo
    'R-',             -- bodega
    'Z3-',            -- zona
    'PS-',            -- pared
    'V12',            -- malla
    'E3',             -- estante
    'P3-',            -- piso
    'STOCK',          -- estado inicial del repuesto
    '100%-',          -- condición del repuesto
    'https://tu-cdn.com/repuestos/embrague_civic.jpg' -- p_imagen_url  ✅
);

-- Crea repuesto id = 3

-- B-2. Venta del repuesto con comisión al vendedor
INSERT INTO transacciones_financieras (
    fecha, tipo_transaccion_id,
    empleado_id, repuesto_id, generacion_id,
    monto, comision_empleado,
    descripcion, referencia
) VALUES (
    CURRENT_DATE(),   -- Fecha de la venta
    2,                -- tipo_transaccion_id = 2 (Venta Repuesto)
    4,                -- empleado_id = 4 (CACHORRO)
    3,                -- repuesto_id = 3 (Kit embrague Civic)
    2,                -- generacion_id = 2 (Civic gen10)
    140000.00,        -- monto de venta
    10000.00,         -- comisión al vendedor
    'Venta Embrague Civic gen10',  -- descripción de la transacción
    'VENTA-REP-EMB-CIV-001'        -- código de referencia personalizado
);

SELECT * FROM vista_ventas_por_empleado;
SELECT * FROM vista_ventas_empleado_mensual WHERE anio = YEAR(NOW()) AND mes = MONTH(NOW());

-- =========================================================
-- C) CONSULTAS DE VERIFICACIÓN
-- =========================================================

-- Repuestos vendidos: deben tener estado = 'VENDIDO'
SELECT id, codigo_repuesto, estado
FROM inventario_repuestos
WHERE id IN (2, 3);

-- Últimas transacciones (venta y compra)
SELECT id, codigo_transaccion, fecha, tipo_transaccion_id,
       repuesto_id, empleado_id, monto, comision_empleado
FROM transacciones_financieras
ORDER BY id DESC
LIMIT 10;

-- Ver ingresos reflejados por generación (gen12 y gen10)
SELECT *
FROM vista_resumen_generaciones
WHERE generacion_id IN (1, 2);



-- ========================================
-- 8B. TRANSACCIONES DE GASTOS FIJOS GLOBALES (NO VINCULADOS A VEHÍCULOS)
-- ========================================

-- Gasto: Patente
INSERT INTO transacciones_financieras (fecha, tipo_transaccion_id, monto, descripcion, referencia)
VALUES (
    CURRENT_DATE(),
    (SELECT id FROM tipos_transacciones WHERE nombre = 'Impuestos' LIMIT 1),
    20000.00,
    'Pago de patente municipal',
    'EGRESO-PATENTE-JUL25'
);

-- Gasto: Impuesto municipal
INSERT INTO transacciones_financieras (fecha, tipo_transaccion_id, monto, descripcion, referencia)
VALUES (
    CURRENT_DATE(),
    (SELECT id FROM tipos_transacciones WHERE nombre = 'Impuestos' LIMIT 1),
    15000.00,
    'Pago de impuesto municipal julio',
    'EGRESO-IMP-MUN-JUL25'
);

-- Gasto: Servicios públicos
INSERT INTO transacciones_financieras (fecha, tipo_transaccion_id, monto, descripcion, referencia)
VALUES (
    CURRENT_DATE(),
    (SELECT id FROM tipos_transacciones WHERE nombre = 'Servicios Públicos' LIMIT 1),
    105000.00,
    'Pago de electricidad, agua y teléfono',
    'EGRESO-SERVPUB-JUL25'
);

-- Gasto: CCSS
INSERT INTO transacciones_financieras (fecha, tipo_transaccion_id, monto, descripcion, referencia)
VALUES (
    CURRENT_DATE(),
    (SELECT id FROM tipos_transacciones WHERE nombre = 'Salarios' LIMIT 1),
    227000.00,
    'Aporte patronal CCSS',
    'EGRESO-CCSS-JUL25'
);

-- Gasto: Salarios
INSERT INTO transacciones_financieras (fecha, tipo_transaccion_id, monto, descripcion, referencia)
VALUES (
    CURRENT_DATE(),
    (SELECT id FROM tipos_transacciones WHERE nombre = 'Salarios' LIMIT 1),
    2120000.00,
    'Pago de salarios',
    'EGRESO-SALARIOS-JUL25'
);

-- Gasto: Préstamo bancario
INSERT INTO transacciones_financieras (fecha, tipo_transaccion_id, monto, descripcion, referencia)
VALUES (
    CURRENT_DATE(),
    (SELECT id FROM tipos_transacciones WHERE nombre = 'Otros Egresos' LIMIT 1),
    1000000.00,
    'Pago de préstamo bancario',
    'EGRESO-PRESTAMO-JUL25'
);

-- Gasto: Contadora externa
INSERT INTO transacciones_financieras (fecha, tipo_transaccion_id, monto, descripcion, referencia)
VALUES (
    CURRENT_DATE(),
    (SELECT id FROM tipos_transacciones WHERE nombre = 'Otros Egresos' LIMIT 1),
    56500.00,
    'Honorarios contadora externa',
    'EGRESO-CONTADORA-JUL25'
);

-- Gasto: Seguro de riesgos del trabajo
INSERT INTO transacciones_financieras (fecha, tipo_transaccion_id, monto, descripcion, referencia)
VALUES (
    CURRENT_DATE(),
    (SELECT id FROM tipos_transacciones WHERE nombre = 'Otros Egresos' LIMIT 1),
    35000.00,
    'Pago seguro riesgos del trabajo',
    'EGRESO-CERO-RIESGOS-JUL25'
);

-- VISTAS

-- Todo el mes:
SELECT *
FROM vista_transacciones_completas
WHERE YEAR(fecha) = YEAR(NOW())
  AND MONTH(fecha) = MONTH(NOW())
ORDER BY fecha DESC;

-- Solo egresos
SELECT * FROM vista_transacciones_completas
WHERE categoria = 'EGRESO'
  AND YEAR(fecha) = YEAR(NOW())
  AND MONTH(fecha) = MONTH(NOW());

-- Solo ingresos
SELECT * FROM vista_transacciones_completas
WHERE categoria = 'INGRESO'
  AND YEAR(fecha) = YEAR(NOW())
  AND MONTH(fecha) = MONTH(NOW());
  
  
-- Analisis financiero del mes:
SELECT 
    anio, mes, nombre_mes,
    total_ingresos_netos AS total_ingresos,
    total_egresos,
    balance_neto,
    total_comisiones
FROM vista_analisis_financiero_mensual
WHERE anio = YEAR(NOW()) AND mes = MONTH(NOW());



SELECT 
    anio,                          -- Año del movimiento
    mes,                           -- Mes numérico (1–12)
    nombre_mes,                    -- Nombre del mes (Enero, Febrero, ...)
    
    total_transacciones,          -- Número total de transacciones del mes
    
    -- 💰 Ingresos brutos y netos
    total_ingresos_brutos,           -- Ingresos antes de comisiones
    total_comisiones,                -- Comisiones pagadas (egreso)
    total_ingresos_netos,            -- Ingresos después de comisiones
    
    -- 💸 Egresos
    total_egresos,                   -- Egresos registrados
    
    -- 📊 Balance real
    balance_neto,                    -- Utilidad real (ingresos netos - egresos)
    
    -- 📈 Métricas
    vehiculos_vendidos,          -- COUNT(distinct tf.vehiculo_id) en transacciones de ingreso
    repuestos_vendidos,          -- COUNT(distinct tf.repuesto_id) en transacciones de ingreso
    promedio_venta,              -- AVG(monto) de transacciones con categoría = 'INGRESO'
    ratio_ingresos_egresos,      -- total_ingresos / total_egresos (proporción financiera)
    porcentaje_comisiones,       -- % de comisiones sobre ventas
    margen_utilidad_porcentaje   -- % de utilidad real
    
FROM vista_analisis_financiero_mensual
WHERE anio = YEAR(NOW()) AND mes = MONTH(NOW());