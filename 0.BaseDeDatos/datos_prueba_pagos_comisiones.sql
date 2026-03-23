-- ========================================
-- DATOS DE PRUEBA PARA PAGOS DE COMISIONES
-- ========================================

-- 1. Insertar empleados de prueba
INSERT IGNORE INTO empleados (id, nombre, cedula, telefono, email, cargo, fecha_contratacion, activo) VALUES
(1, 'Juan Pérez', '123456789', '555-0101', 'juan.perez@email.com', 'Vendedor', '2023-01-15', 1),
(2, 'María García', '987654321', '555-0102', 'maria.garcia@email.com', 'Vendedora', '2023-02-20', 1),
(3, 'Carlos López', '456789123', '555-0103', 'carlos.lopez@email.com', 'Supervisor', '2022-06-10', 1);

-- 2. Insertar tipos de transacciones si no existen
INSERT IGNORE INTO tipos_transacciones (id, categoria, descripcion) VALUES
(1, 'VENTA', 'Venta de vehículos'),
(2, 'EGRESO', 'Egreso de pagos');

-- 3. Insertar transacciones financieras con comisiones (marzo 2026)
INSERT IGNORE INTO transacciones_financieras (
    codigo_transaccion, fecha, dia, mes, anio, 
    tipo_transaccion_id, empleado_id, monto, 
    comision_empleado, descripcion, referencia, 
    estado, activo, fecha_creacion, fecha_actualizacion
) VALUES
-- Transacciones para Juan Pérez (empleado 1)
('VENTA-001', '2026-03-05', 5, 3, 2026, 1, 1, 15000.00, 750.00, 'Venta Toyota Corolla', 'FACT-001', 'COMPLETADA', 1, NOW(), NOW()),
('VENTA-002', '2026-03-12', 12, 3, 2026, 1, 1, 22000.00, 1100.00, 'Venta Honda Civic', 'FACT-002', 'COMPLETADA', 1, NOW(), NOW()),
('VENTA-003', '2026-03-18', 18, 3, 2026, 1, 1, 18500.00, 925.00, 'Venta Nissan Sentra', 'FACT-003', 'COMPLETADA', 1, NOW(), NOW()),

-- Transacciones para María García (empleado 2)
('VENTA-004', '2026-03-08', 8, 3, 2026, 1, 2, 19500.00, 975.00, 'Venta Mazda 3', 'FACT-004', 'COMPLETADA', 1, NOW(), NOW()),
('VENTA-005', '2026-03-15', 15, 3, 2026, 1, 2, 28000.00, 1400.00, 'Venta Ford Focus', 'FACT-005', 'COMPLETADA', 1, NOW(), NOW()),

-- Transacciones para Carlos López (empleado 3)
('VENTA-006', '2026-03-10', 10, 3, 2026, 1, 3, 32000.00, 1600.00, 'Venta Chevrolet Cruze', 'FACT-006', 'COMPLETADA', 1, NOW(), NOW()),
('VENTA-007', '2026-03-22', 22, 3, 2026, 1, 3, 26500.00, 1325.00, 'Venta Volkswagen Jetta', 'FACT-007', 'COMPLETADA', 1, NOW(), NOW());

-- 4. Insertar un pago de comisiones existente para probar duplicados
INSERT IGNORE INTO pagos_comisiones (
    empleado_id, anio, mes, total_comisiones, fecha_pago, 
    estado, referencia_pago, notas, fecha_registro, fecha_actualizacion
) VALUES 
(3, 2026, 2, 1450.00, '2026-02-28', 'PAGADO', 'CHEQUE-123', 'Pago comisiones febrero 2026', NOW(), NOW());

-- ========================================
-- RESUMEN DE DATOS CREADOS:
-- ========================================
-- Empleados: 3 (Juan, María, Carlos)
-- Transacciones marzo 2026: 7 transacciones con comisiones
-- Total comisiones Juan Pérez: 750 + 1100 + 925 = 2775.00
-- Total comisiones María García: 975 + 1400 = 2375.00  
-- Total comisiones Carlos López: 1600 + 1325 = 2925.00
-- Pago existente: Carlos López tiene pago de febrero 2026 (para probar duplicados)

-- ========================================
-- PRUEBAS POSIBLES:
-- ========================================
-- 1. GET /api/pagos-comisiones/pendientes/2026/3
--    Debe mostrar: Juan (2775.00), María (2375.00), Carlos (2925.00)
-- 2. POST /api/pagos-comisiones/registrar para Juan Pérez
--    Debe registrar pago de 2775.00
-- 3. POST /api/pagos-comisiones/registrar para Carlos López (marzo 2026)
--    Debe funcionar (no hay duplicado para marzo)
-- 4. POST /api/pagos-comisiones/registrar para Carlos López (febrero 2026)
--    Debe dar error (Ya existe pago para febrero)
-- 5. GET /api/pagos-comisiones/estado/PAGADO
--    Debe mostrar el pago existente de Carlos López
-- 6. GET /api/pagos-comisiones/resumen/2026/3
--    Debe mostrar resumen completo del período
