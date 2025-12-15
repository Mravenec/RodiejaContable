-- ========================================
-- SCRIPT DE POBLACIÓN - SISTEMA VEHICULAR COSTA RICA
-- ========================================
USE sistema_vehicular;

-- ========================================
-- 1. POBLAR MARCAS (Marcas populares en Costa Rica)
-- ========================================

INSERT INTO marcas (nombre) VALUES 
('Toyota'),
('Honda'),
('Nissan'),
('Hyundai'),
('Chevrolet'),
('Ford'),
('Mazda'),
('Volkswagen'),
('Kia'),
('Suzuki'),
('Mitsubishi'),
('Subaru'),
('Isuzu'),
('Daihatsu'),
('Peugeot');

-- ========================================
-- 2. POBLAR MODELOS (Modelos populares en CR)
-- ========================================

-- Toyota (marca_id = 1)
INSERT INTO modelos (marca_id, nombre) VALUES
(1, 'Corolla'),
(1, 'Camry'),
(1, 'Yaris'),
(1, 'RAV4'),
(1, 'Prius'),
(1, 'Highlander'),
(1, 'Hilux'),
(1, 'Land Cruiser'),
(1, 'Sienna'),
(1, 'Tacoma');

-- Honda (marca_id = 2)
INSERT INTO modelos (marca_id, nombre) VALUES
(2, 'Civic'),
(2, 'Accord'),
(2, 'CR-V'),
(2, 'Fit'),
(2, 'Pilot'),
(2, 'Odyssey'),
(2, 'HR-V'),
(2, 'Ridgeline');

-- Nissan (marca_id = 3)
INSERT INTO modelos (marca_id, nombre) VALUES
(3, 'Sentra'),
(3, 'Altima'),
(3, 'Versa'),
(3, 'X-Trail'),
(3, 'Pathfinder'),
(3, 'Frontier'),
(3, 'Kicks'),
(3, 'Murano'),
(3, 'Tiida');

-- Hyundai (marca_id = 4)
INSERT INTO modelos (marca_id, nombre) VALUES
(4, 'Elantra'),
(4, 'Accent'),
(4, 'Tucson'),
(4, 'Santa Fe'),
(4, 'Sonata'),
(4, 'Grand i10'),
(4, 'Venue'),
(4, 'Creta');

-- Chevrolet (marca_id = 5)
INSERT INTO modelos (marca_id, nombre) VALUES
(5, 'Spark'),
(5, 'Aveo'),
(5, 'Cruze'),
(5, 'Equinox'),
(5, 'Tahoe'),
(5, 'Silverado'),
(5, 'Traverse'),
(5, 'Malibu');

-- Ford (marca_id = 6)
INSERT INTO modelos (marca_id, nombre) VALUES
(6, 'Focus'),
(6, 'Fiesta'),
(6, 'Escape'),
(6, 'Explorer'),
(6, 'F-150'),
(6, 'Mustang'),
(6, 'Edge'),
(6, 'Ranger');

-- Mazda (marca_id = 7)
INSERT INTO modelos (marca_id, nombre) VALUES
(7, 'Mazda3'),
(7, 'Mazda6'),
(7, 'CX-5'),
(7, 'CX-3'),
(7, 'CX-9'),
(7, 'MX-5'),
(7, 'BT-50');

-- Volkswagen (marca_id = 8)
INSERT INTO modelos (marca_id, nombre) VALUES
(8, 'Jetta'),
(8, 'Golf'),
(8, 'Passat'),
(8, 'Tiguan'),
(8, 'Touareg'),
(8, 'Atlas'),
(8, 'Polo');

-- Kia (marca_id = 9)
INSERT INTO modelos (marca_id, nombre) VALUES
(9, 'Rio'),
(9, 'Forte'),
(9, 'Optima'),
(9, 'Sportage'),
(9, 'Sorento'),
(9, 'Soul'),
(9, 'Stinger'),
(9, 'Picanto');

-- Suzuki (marca_id = 10)
INSERT INTO modelos (marca_id, nombre) VALUES
(10, 'Swift'),
(10, 'Vitara'),
(10, 'Jimny'),
(10, 'Baleno'),
(10, 'Ertiga'),
(10, 'Grand Vitara');

-- ========================================
-- 3. POBLAR GENERACIONES (Años relevantes para CR)
-- ========================================

-- Toyota Corolla (modelo_id = 1)
INSERT INTO generaciones (modelo_id, nombre, descripcion, anio_inicio, anio_fin) VALUES
(1, 'gen10', 'Décima generación E140/E150', 2006, 2013),
(1, 'gen11', 'Undécima generación E160/E170', 2014, 2019),
(1, 'gen12', 'Duodécima generación E210', 2020, 2024);

-- Toyota Camry (modelo_id = 2)
INSERT INTO generaciones (modelo_id, nombre, descripcion, anio_inicio, anio_fin) VALUES
(2, 'gen7', 'Séptima generación XV50', 2012, 2017),
(2, 'gen8', 'Octava generación XV70', 2018, 2023);

-- Toyota Yaris (modelo_id = 3)
INSERT INTO generaciones (modelo_id, nombre, descripcion, anio_inicio, anio_fin) VALUES
(3, 'gen3', 'Tercera generación XP130', 2011, 2019),
(3, 'gen4', 'Cuarta generación XP210', 2020, 2024);

-- Honda Civic (modelo_id = 9)
INSERT INTO generaciones (modelo_id, nombre, descripcion, anio_inicio, anio_fin) VALUES
(9, 'gen9', 'Novena generación FB/FG', 2012, 2015),
(9, 'gen10', 'Décima generación FC/FK', 2016, 2021),
(9, 'gen11', 'Undécima generación FE', 2022, 2024);

-- Honda CR-V (modelo_id = 11)
INSERT INTO generaciones (modelo_id, nombre, descripcion, anio_inicio, anio_fin) VALUES
(11, 'gen4', 'Cuarta generación RM', 2012, 2016),
(11, 'gen5', 'Quinta generación RW', 2017, 2022),
(11, 'gen6', 'Sexta generación RT', 2023, 2024);

-- Nissan Sentra (modelo_id = 17)
INSERT INTO generaciones (modelo_id, nombre, descripcion, anio_inicio, anio_fin) VALUES
(17, 'gen7', 'Séptima generación B17', 2013, 2019),
(17, 'gen8', 'Octava generación B18', 2020, 2024);

-- Hyundai Elantra (modelo_id = 26)
INSERT INTO generaciones (modelo_id, nombre, descripcion, anio_inicio, anio_fin) VALUES
(26, 'gen5', 'Quinta generación MD/UD', 2011, 2015),
(26, 'gen6', 'Sexta generación AD', 2016, 2020),
(26, 'gen7', 'Séptima generación CN7', 2021, 2024);

-- Chevrolet Spark (modelo_id = 34)
INSERT INTO generaciones (modelo_id, nombre, descripcion, anio_inicio, anio_fin) VALUES
(34, 'gen3', 'Tercera generación M300', 2010, 2015),
(34, 'gen4', 'Cuarta generación M400', 2016, 2022);

-- Ford Focus (modelo_id = 42)
INSERT INTO generaciones (modelo_id, nombre, descripcion, anio_inicio, anio_fin) VALUES
(42, 'gen3', 'Tercera generación', 2011, 2018),
(42, 'gen4', 'Cuarta generación', 2019, 2022);

-- Mazda3 (modelo_id = 50)
INSERT INTO generaciones (modelo_id, nombre, descripcion, anio_inicio, anio_fin) VALUES
(50, 'gen3', 'Tercera generación BM/BN', 2014, 2018),
(50, 'gen4', 'Cuarta generación BP', 2019, 2024);

-- ========================================
-- 4. POBLAR EMPLEADOS (Nombres comunes en CR)
-- ========================================

INSERT INTO empleados (nombre) VALUES
('JHONATHAN VARGAS'),
('LUIS MIRANDA SOLANO'),
('CACHORRO GONZÁLEZ'),
('ACXEL RODRÍGUEZ'),
('ADRIANA JIMÉNEZ'),
('AMAURIS CASTRO'),
('DIEGO HERNÁNDEZ'),
('NALLELY MORALES'),
('VICTORIA UGALDE'),
('EQUIPO DE VENTAS'),
('CARLOS MÉNDEZ'),
('MARÍA FERNÁNDEZ'),
('JOSÉ RAMÍREZ'),
('ANA PATRICIA VEGA'),
('MIGUEL ÁNGEL ROJAS'),
('STEPHANIE CHACÓN'),
('PABLO ALVARADO'),
('SILVIA MONGE'),
('RICARDO QUESADA'),
('DANIELA TORRES');

-- ========================================
-- 5. POBLAR TIPOS DE TRANSACCIONES (Actualizados)
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


-- ========================================
-- 6. POBLAR VEHÍCULOS (Datos realistas de CR)
-- ========================================

-- Obtener IDs de generaciones para usar en los vehículos
-- Toyota Corolla gen11 (2014-2019)
INSERT INTO vehiculos (generacion_id, anio, precio_compra, costo_grua, comisiones, fecha_ingreso, estado, precio_venta, fecha_venta, notas) VALUES
(1, 2015, 3500000.00, 25000.00, 50000.00, '2023-01-15', 'VENDIDO', 4200000.00, '2023-02-20', 'Excelente estado, un solo dueño'),
(1, 2016, 4200000.00, 30000.00, 60000.00, '2023-01-20', 'VENDIDO', 5100000.00, '2023-03-15', 'Automático, full equipo'),
(1, 2017, 4800000.00, 35000.00, 70000.00, '2023-02-10', 'DISPONIBLE', NULL, NULL, 'Mecánico, aire acondicionado'),
(1, 2018, 5500000.00, 40000.00, 80000.00, '2023-02-25', 'VENDIDO', 6300000.00, '2023-04-10', 'Híbrido, excelente consumo'),
(1, 2019, 6200000.00, 45000.00, 90000.00, '2023-03-05', 'DISPONIBLE', NULL, NULL, 'Recién llegado, impecable');

-- Toyota Corolla gen12 (2020-2024)
INSERT INTO vehiculos (generacion_id, anio, precio_compra, costo_grua, comisiones, fecha_ingreso, estado, precio_venta, fecha_venta, notas) VALUES
(3, 2020, 7500000.00, 50000.00, 100000.00, '2023-03-12', 'VENDIDO', 8800000.00, '2023-05-18', 'Modelo nuevo, garantía vigente'),
(3, 2021, 8200000.00, 55000.00, 110000.00, '2023-03-20', 'DISPONIBLE', NULL, NULL, 'Sensores de parqueo, cámara trasera'),
(3, 2022, 9100000.00, 60000.00, 120000.00, '2023-04-01', 'REPARACION', NULL, NULL, 'Necesita cambio de transmisión'),
(3, 2023, 10500000.00, 65000.00, 130000.00, '2023-04-15', 'DISPONIBLE', NULL, NULL, 'Último modelo, cero kilómetros');

-- Honda Civic gen10 (2016-2021)
INSERT INTO vehiculos (generacion_id, anio, precio_compra, costo_grua, comisiones, fecha_ingreso, estado, precio_venta, fecha_venta, notas) VALUES
(4, 2017, 5200000.00, 40000.00, 75000.00, '2023-01-25', 'VENDIDO', 6100000.00, '2023-03-08', 'Turbo, excelente rendimiento'),
(4, 2018, 5800000.00, 45000.00, 85000.00, '2023-02-15', 'VENDIDO', 6900000.00, '2023-04-22', 'Sedán, aire acondicionado'),
(4, 2019, 6400000.00, 50000.00, 95000.00, '2023-03-08', 'DISPONIBLE', NULL, NULL, 'Hatchback, muy deportivo'),
(4, 2020, 7200000.00, 55000.00, 105000.00, '2023-03-25', 'DISPONIBLE', NULL, NULL, 'Sensing, tecnología avanzada'),
(4, 2021, 8000000.00, 60000.00, 115000.00, '2023-04-12', 'DESARMADO', NULL, NULL, 'Accidentado, solo para repuestos');

-- Honda CR-V gen5 (2017-2022)
INSERT INTO vehiculos (generacion_id, anio, precio_compra, costo_grua, comisiones, fecha_ingreso, estado, precio_venta, fecha_venta, notas) VALUES
(6, 2018, 8500000.00, 70000.00, 125000.00, '2023-02-20', 'VENDIDO', 10200000.00, '2023-04-30', 'SUV familiar, 7 pasajeros'),
(6, 2019, 9200000.00, 75000.00, 135000.00, '2023-03-15', 'DISPONIBLE', NULL, NULL, 'Tracción integral, como nueva'),
(6, 2020, 10100000.00, 80000.00, 145000.00, '2023-04-05', 'DISPONIBLE', NULL, NULL, 'Turbo, excelente para familia');

-- Nissan Sentra gen7 (2013-2019)
INSERT INTO vehiculos (generacion_id, anio, precio_compra, costo_grua, comisiones, fecha_ingreso, estado, precio_venta, fecha_venta, notas) VALUES
(7, 2015, 3200000.00, 30000.00, 45000.00, '2023-01-10', 'VENDIDO', 3800000.00, '2023-02-25', 'Económico, ideal para trabajo'),
(7, 2016, 3600000.00, 35000.00, 50000.00, '2023-02-05', 'VENDIDO', 4300000.00, '2023-03-20', 'Automático, muy cómodo'),
(7, 2017, 4000000.00, 40000.00, 55000.00, '2023-02-18', 'DISPONIBLE', NULL, NULL, 'Bajo kilometraje'),
(7, 2018, 4500000.00, 45000.00, 60000.00, '2023-03-10', 'DISPONIBLE', NULL, NULL, 'Recién llegado'),
(7, 2019, 5000000.00, 50000.00, 65000.00, '2023-03-28', 'REPARACION', NULL, NULL, 'Necesita trabajo en motor');

-- Hyundai Elantra gen6 (2016-2020)
INSERT INTO vehiculos (generacion_id, anio, precio_compra, costo_grua, comisiones, fecha_ingreso, estado, precio_venta, fecha_venta, notas) VALUES
(9, 2017, 4300000.00, 35000.00, 60000.00, '2023-01-30', 'VENDIDO', 5200000.00, '2023-03-12', 'Garantía extendida'),
(9, 2018, 4800000.00, 40000.00, 70000.00, '2023-02-22', 'DISPONIBLE', NULL, NULL, 'Muy bien cuidado'),
(9, 2019, 5300000.00, 45000.00, 75000.00, '2023-03-18', 'DISPONIBLE', NULL, NULL, 'Excelente estado'),
(9, 2020, 5800000.00, 50000.00, 80000.00, '2023-04-08', 'VENDIDO', 6700000.00, '2023-05-25', 'Último año de generación');

-- Chevrolet Spark gen4 (2016-2022)
INSERT INTO vehiculos (generacion_id, anio, precio_compra, costo_grua, comisiones, fecha_ingreso, estado, precio_venta, fecha_venta, notas) VALUES
(10, 2017, 2800000.00, 20000.00, 35000.00, '2023-01-12', 'VENDIDO', 3400000.00, '2023-02-28', 'Ideal para ciudad'),
(10, 2018, 3200000.00, 25000.00, 40000.00, '2023-02-08', 'VENDIDO', 3900000.00, '2023-03-22', 'Automático, muy económico'),
(10, 2019, 3600000.00, 30000.00, 45000.00, '2023-03-02', 'DISPONIBLE', NULL, NULL, 'Bajo consumo de combustible'),
(10, 2020, 4000000.00, 35000.00, 50000.00, '2023-03-20', 'DISPONIBLE', NULL, NULL, 'Perfecto para principiantes');
-- ========================================
-- 7. POBLAR INVENTARIO DE REPUESTOS 
-- ========================================

/* ---------- Toyota Corolla 2015 (vehiculo_id = 1) ---------- */
INSERT INTO inventario_repuestos (
    vehiculo_origen_id, parte_vehiculo, descripcion,
    precio_costo, precio_venta, precio_mayoreo,
    bodega, zona, pared, malla, estante, piso,
    estado, condicion, fecha_creacion
) VALUES
(1,'MOTOR','Motor completo 1.8L 2ZR‑FE',
 580000.00,750000.00,650000.00,
 'D-','Z1-','PE-','V15','E1','P1-',
 'STOCK','50%-','2023-02-15'),
(1,'CAJA DE CAMBIO','Transmisión automática CVT',
 420000.00,580000.00,500000.00,
 'D-','Z1-','PE-','V16','E1','P1-',
 'STOCK','50%-','2023-02-15'),
(1,'COMPUTADORA','ECU módulo motor',
 150000.00,220000.00,180000.00,
 'D-','Z2-','PN-','V5','E2','P2-',
 'STOCK','100%-','2023-02-15'),
(1,'SISTEMA DE FRENOS','Discos de freno delanteros',
 45000.00,75000.00,60000.00,
 'D-','Z2-','PN-','V6','E2','P2-',
 'STOCK','100%-','2023-02-15'),
(1,'SUSPENSION Y AMORTIGUAMIENTO','Amortiguadores delanteros (par)',
 85000.00,125000.00,105000.00,
 'D-','Z2-','PN-','V7','E2','P3-',
 'STOCK','100%-','2023-02-15'),
(1,'CARROCERIA','Puerta delantera derecha',
 120000.00,180000.00,150000.00,
 'C-','Z3-','PO-','V20','E3','P5-',
 'STOCK','100%-','2023-02-15'),
(1,'SISTEMA ELECTRICO','Faros LED principales',
 95000.00,145000.00,120000.00,
 'D-','Z3-','PS-','V25','E3','P6-',
 'STOCK','100%-','2023-02-15'),
(1,'AROS Y LLANTAS','Llantas 205/55R16 (juego)',
 160000.00,240000.00,200000.00,
 'C-','Z4-','PE-','V30','E4','P8-',
 'STOCK','50%-','2023-02-15');

/* ---------- Honda Civic 2017 (vehiculo_id = 10) ---------- */
INSERT INTO inventario_repuestos (
    vehiculo_origen_id, parte_vehiculo, descripcion,
    precio_costo, precio_venta, precio_mayoreo,
    bodega, zona, pared, malla, estante, piso,
    estado, condicion, fecha_creacion
) VALUES
(10,'MOTOR','Motor turbo 1.5L L15B7',
 650000.00,850000.00,750000.00,
 'D-','Z1-','PE-','V12','E1','P1-',
 'STOCK','50%-','2023-03-10'),
(10,'CAJA DE CAMBIO','Transmisión CVT',
 380000.00,520000.00,450000.00,
 'D-','Z1-','PE-','V13','E1','P1-',
 'STOCK','50%-','2023-03-10'),
(10,'TURBO','Turbocompresor completo',
 280000.00,420000.00,350000.00,
 'D-','Z2-','PN-','V8','E2','P2-',
 'STOCK','50%-','2023-03-10'),
(10,'COMPUTADORA','PCM Honda Sensing',
 180000.00,280000.00,230000.00,
 'D-','Z2-','PN-','V9','E2','P2-',
 'STOCK','100%-','2023-03-10'),
(10,'SISTEMA DE FRENOS','Calipers de freno Brembo',
 120000.00,180000.00,150000.00,
 'D-','Z2-','PN-','V10','E2','P3-',
 'STOCK','100%-','2023-03-10'),
(10,'CARROCERIA','Capó con entradas de aire',
 85000.00,135000.00,110000.00,
 'C-','Z3-','PO-','V22','E3','P5-',
 'STOCK','100%-','2023-03-10'),
(10,'SISTEMA ELECTRICO','Pantalla touch 7 pulgadas',
 220000.00,320000.00,270000.00,
 'D-','Z3-','PS-','V26','E3','P6-',
 'STOCK','100%-','2023-03-10'),
(10,'AROS Y LLANTAS','Rines deportivos 18"',
 180000.00,280000.00,230000.00,
 'C-','Z4-','PE-','V32','E4','P8-',
 'STOCK','50%-','2023-03-10');

/* ---------- Honda CR‑V 2018 (vehiculo_id = 15) ---------- */
INSERT INTO inventario_repuestos (
    vehiculo_origen_id, parte_vehiculo, descripcion,
    precio_costo, precio_venta, precio_mayoreo,
    bodega, zona, pared, malla, estante, piso,
    estado, condicion, fecha_creacion
) VALUES
(15,'MOTOR','Motor 1.5L turbo K15B',
 720000.00,980000.00,850000.00,
 'D-','Z1-','PE-','V18','E1','P1-',
 'STOCK','50%-','2023-04-01'),
(15,'SISTEMA DE DIRECCION','Dirección asistida eléctrica',
 320000.00,460000.00,390000.00,
 'D-','Z2-','PN-','V11','E2','P2-',
 'STOCK','100%-','2023-04-01'),
(15,'EJES Y DIFERENCIA','Diferencial trasero AWD',
 280000.00,420000.00,350000.00,
 'D-','Z2-','PN-','V12','E2','P3-',
 'STOCK','50%-','2023-04-01'),
(15,'CARROCERIA','Compuerta trasera eléctrica',
 450000.00,650000.00,550000.00,
 'C-','Z3-','PO-','V23','E3','P5-',
 'STOCK','100%-','2023-04-01'),
(15,'AIRBAGS O BOLSAS DE AIRE','Airbags laterales (set)',
 180000.00,280000.00,230000.00,
 'D-','Z3-','PS-','V27','E3','P6-',
 'STOCK','100%-','2023-04-01'),
(15,'SISTEMA ELECTRICO','Cámara 360° completa',
 320000.00,480000.00,400000.00,
 'D-','Z3-','PS-','V28','E3','P6-',
 'STOCK','100%-','2023-04-01');

/* ---------- Nissan Sentra 2015 (vehiculo_id = 18) ---------- */
INSERT INTO inventario_repuestos (
    vehiculo_origen_id, parte_vehiculo, descripcion,
    precio_costo, precio_venta, precio_mayoreo,
    bodega, zona, pared, malla, estante, piso,
    estado, condicion, fecha_creacion
) VALUES
(18,'CARROCERIA','Puerta trasera izquierda',
 95000.00,145000.00,120000.00,
 'C-','Z4-','PE-','V33','E5','P7-',
 'STOCK','100%-','2023-02-20'),
(18,'EMBRAGUE','Kit de embrague completo',
 78000.00,115000.00,95000.00,
 'D-','Z1-','PE-','V17','E1','P1-',
 'STOCK','100%-','2023-02-20'),
(18,'AROS Y LLANTAS','Juegos de aros originales',
 180000.00,255000.00,210000.00,
 'D-','Z2-','PN-','V13','E2','P3-',
 'STOCK','50%-','2023-02-20');

/* ---------- Hyundai Elantra 2019 (vehiculo_id = 23) ---------- */
INSERT INTO inventario_repuestos (
    vehiculo_origen_id, parte_vehiculo, descripcion,
    precio_costo, precio_venta, precio_mayoreo,
    bodega, zona, pared, malla, estante, piso,
    estado, condicion, fecha_creacion
) VALUES
(23,'MOTOR','Motor 2.0L Nu',
 540000.00,720000.00,630000.00,
 'C-','Z2-','PN-','V19','E2','P3-',
 'STOCK','50%-','2023-03-22'),
(23,'COMPUTADORA','ECU principal',
 132000.00,195000.00,165000.00,
 'C-','Z2-','PN-','V21','E2','P3-',
 'STOCK','100%-','2023-03-22'),
(23,'SUSPENSION Y AMORTIGUAMIENTO','Amortiguadores traseros',
 70000.00,110000.00,90000.00,
 'C-','Z2-','PN-','V24','E2','P4-',
 'STOCK','100%-','2023-03-22');

/* ---------- Chevrolet Spark 2019 (vehiculo_id = 27) ---------- */
INSERT INTO inventario_repuestos (
    vehiculo_origen_id, parte_vehiculo, descripcion,
    precio_costo, precio_venta, precio_mayoreo,
    bodega, zona, pared, malla, estante, piso,
    estado, condicion, fecha_creacion
) VALUES
(27,'MOTOR','Motor 1.2L S‑TEC II',
 310000.00,420000.00,350000.00,
 'C-','Z3-','PO-','V20','E3','P6-',
 'STOCK','50%-','2023-02-10'),
(27,'CARROCERIA','Parachoques delantero',
 50000.00,78000.00,65000.00,
 'C-','Z3-','PO-','V28','E3','P6-',
 'STOCK','100%-','2023-02-10'),
(27,'SISTEMA ELECTRICO','Tablero principal',
 74000.00,110000.00,90000.00,
 'C-','Z3-','PO-','V29','E3','P6-',
 'STOCK','100%-','2023-02-10'),
(27,'TANQUE DE GASOLINA','Tanque completo',
 53000.00,80000.00,66000.00,
 'C-','Z4-','PE-','V34','E5','P7-',
 'STOCK','100%-','2023-02-10');

/* ---------- Repuestos sueltos (sin vehículo de origen) ---------- */
CALL sp_insertar_repuesto_con_generacion_sin_vehiculo(
    3, 'Toyota',  -- generación_id, marca_nombre
    'BATERIA',
    'Batería nueva 12V 45Ah',
    35000.00, 55000.00, 45000.00,
    'C-', 'Z4-', 'PE-', 'V35', 'E6', 'P9-',
    'STOCK', '100%-', null
);

CALL sp_insertar_repuesto_con_generacion_sin_vehiculo(
    3, 'Toyota',
    'ALTERNADOR',
    'Alternador Bosch universal',
    55000.00, 80000.00, 67000.00,
    'C-', 'Z4-', 'PE-', 'V36', 'E6', 'P10-',
    'STOCK', '100%-', null
);

CALL sp_insertar_repuesto_con_generacion_sin_vehiculo(
    3, 'Toyota',
    'FUSIBLES',
    'Set de fusibles (10 unidades)',
    8000.00, 15000.00, 12000.00,
    'C-', 'Z4-', 'PE-', 'V37', 'E6', 'P11-',
    'STOCK', '100%-', null
);

-- ========================================
-- 8. POBLAR TRANSACCIONES FINANCIERAS (orden lógico y correlativo)
-- ========================================

-- PRIMERO: Compras de vehículos (el negocio adquiere los autos)
INSERT INTO transacciones_financieras (fecha, tipo_transaccion_id, empleado_id, vehiculo_id, monto, descripcion, referencia, estado) VALUES
('2023-01-10', 6, 1, 1, 3500000.00, 'Compra Corolla 2015', 'COMPRA-001', 'COMPLETADA'),
('2023-01-20', 6, 2, 2, 4200000.00, 'Compra Corolla 2016', 'COMPRA-002', 'COMPLETADA'),
('2023-01-25', 6, 3, 6, 5200000.00, 'Compra Civic 2017', 'COMPRA-003', 'COMPLETADA'),
('2023-02-20', 6, 4, 11, 8500000.00, 'Compra CR-V 2018', 'COMPRA-004', 'COMPLETADA'),
('2023-03-18', 6, 5, 18, 3200000.00, 'Compra Sentra 2015', 'COMPRA-005', 'COMPLETADA'),
('2023-02-08', 6, 6, 23, 4300000.00, 'Compra Elantra 2017', 'COMPRA-006', 'COMPLETADA'),
('2023-01-12', 6, 7, 27, 2800000.00, 'Compra Spark 2017', 'COMPRA-007', 'COMPLETADA');

-- SEGUNDO: Ventas de vehículos (lógica: solo autos previamente comprados, fechas posteriores a compra)
INSERT INTO transacciones_financieras (fecha, tipo_transaccion_id, empleado_id, vehiculo_id, monto, comision_empleado, descripcion, referencia) VALUES
('2023-02-20', 1, 1, 1, 4200000.00, 40000.00, 'Venta Toyota Corolla 2015', 'FACT-001'),
('2023-03-15', 1, 2, 2, 5100000.00, 50000.00, 'Venta Toyota Corolla 2016', 'FACT-002'),
('2023-04-10', 1, 3, 4, 6300000.00, 55000.00, 'Venta Toyota Corolla 2018', 'FACT-003'),
('2023-05-18', 1, 4, 7, 8800000.00, 80000.00, 'Venta Toyota Corolla 2020', 'FACT-004'),
('2023-03-08', 1, 5, 6, 6100000.00, 60000.00, 'Venta Honda Civic 2017', 'FACT-005'),
('2023-04-22', 1, 6, 7, 6900000.00, 65000.00, 'Venta Honda Civic 2018', 'FACT-006'),
('2023-04-30', 1, 7, 11, 10200000.00, 120000.00, 'Venta Honda CR-V 2018', 'FACT-007'),
('2023-02-25', 1, 8, 18, 3800000.00, 32000.00, 'Venta Nissan Sentra 2015', 'FACT-008'),
('2023-03-12', 1, 9, 23, 5200000.00, 44000.00, 'Venta Hyundai Elantra 2017', 'FACT-009'),
('2023-02-28', 1, 10, 27, 3400000.00, 30000.00, 'Venta Chevrolet Spark 2017', 'FACT-010');

-- TERCERO: Ventas de repuestos (solo repuestos que existen, fechas posteriores a su compra o registro)
INSERT INTO transacciones_financieras (fecha, tipo_transaccion_id, empleado_id, repuesto_id, monto, comision_empleado, descripcion, referencia) VALUES
('2023-03-12', 2, 1, 1, 750000.00, 10000.00, 'Venta Motor Corolla', 'FACT-011'),
('2023-03-12', 2, 2, 2, 580000.00, 8000.00, 'Venta Transmisión Corolla', 'FACT-012'),
('2023-04-01', 2, 3, 9, 850000.00, 12000.00, 'Venta Motor Civic', 'FACT-013'),
('2023-04-05', 2, 4, 17, 580000.00, 8500.00, 'Venta Motor Sentra', 'FACT-014'),
('2023-04-22', 2, 5, 21, 720000.00, 10000.00, 'Venta Motor Elantra', 'FACT-015'),
('2023-04-22', 2, 6, 29, 420000.00, 7000.00, 'Venta Motor Spark', 'FACT-016');

-- CUARTO: Compras de repuestos directos (sin relación a vehículo, usando IDs correctos)
INSERT INTO transacciones_financieras (fecha, tipo_transaccion_id, empleado_id, repuesto_id, monto, descripcion, referencia, estado) VALUES
('2023-05-05', 7, 5, 33, 35000.00, 'Compra Batería nueva', 'COMP-REP-001', 'COMPLETADA'),
('2023-05-05', 7, 6, 34, 55000.00, 'Compra Alternador nuevo', 'COMP-REP-002', 'COMPLETADA'),
('2023-05-05', 7, 7, 35, 8000.00, 'Compra Fusibles', 'COMP-REP-003', 'COMPLETADA');

-- QUINTO: Gastos operativos varios (sin vehículo ni repuesto)
INSERT INTO transacciones_financieras (fecha, tipo_transaccion_id, empleado_id, monto, descripcion, referencia, estado) VALUES
('2023-03-05', 11, 8, 25000.00, 'Pago servicio grúa', 'GRUA-001', 'COMPLETADA'),
('2023-03-20', 12, 9, 18000.00, 'Transporte de vehículo', 'TRANS-001', 'COMPLETADA'),
('2023-04-02', 13, 10, 22000.00, 'Combustible unidad 5', 'GAS-001', 'COMPLETADA'),
('2023-04-05', 14, 11, 40000.00, 'Pago electricidad marzo', 'ELEC-001', 'COMPLETADA'),
('2023-04-10', 15, 12, 27000.00, 'Pago municipalidad', 'IMP-001', 'COMPLETADA');

-- SEXTO: Otros ingresos diversos (sin vehículo ni repuesto)
INSERT INTO transacciones_financieras (fecha, tipo_transaccion_id, empleado_id, monto, descripcion, referencia, estado) VALUES
('2023-04-15', 16, 13, 55000.00, 'Otros ingresos por alquiler', 'OTR-INC-001', 'COMPLETADA');


-- ========================================
-- 9. EJEMPLOS DE REGISTROS EN HISTORIAL DE AUDITORÍA
-- ========================================

-- Auditoría de cambio de estado de vehículo (ejemplo)
INSERT INTO historial_vehiculos (vehiculo_id, accion, campo_modificado, valor_anterior, valor_nuevo, usuario, observaciones) VALUES
(1, 'UPDATE', 'estado', 'DISPONIBLE', 'VENDIDO', 'admin', 'Cambio por venta directa');

-- Auditoría de precio de venta modificado
INSERT INTO historial_vehiculos (vehiculo_id, accion, campo_modificado, valor_anterior, valor_nuevo, usuario, observaciones) VALUES
(2, 'UPDATE', 'precio_venta', '4900000.00', '5100000.00', 'lmiranda', 'Ajuste por negociación final');

-- Auditoría de repuesto vendido
INSERT INTO historial_repuestos (repuesto_id, accion, campo_modificado, valor_anterior, valor_nuevo, usuario, observaciones) VALUES
(2, 'UPDATE', 'estado', 'STOCK', 'VENDIDO', 'jvargas', 'Venta a cliente mayorista');

-- Auditoría de transacción cancelada
INSERT INTO historial_transacciones (transaccion_id, accion, campo_modificado, valor_anterior, valor_nuevo, usuario, observaciones) VALUES
(18, 'UPDATE', 'estado', 'COMPLETADA', 'CANCELADA', 'admin', 'Error en registro de pago');

-- ========================================
-- 10. DATOS PARA DEMOSTRACIÓN DE VISTAS Y REPORTES
-- ========================================

-- Venta mayoreo y servicios mecánicos
INSERT INTO transacciones_financieras (fecha, tipo_transaccion_id, empleado_id, monto, descripcion, referencia, estado) VALUES
('2023-05-18', 3, 8, 2000000.00, 'Venta mayoreo de repuestos a taller XYZ', 'FACT-MAY-01', 'COMPLETADA'),
('2023-05-22', 4, 9, 135000.00, 'Servicio mecánico cambio de motor', 'SERV-MEC-01', 'COMPLETADA');

-- Repuestos vendidos después de estar en inventario >3 meses (para vista_inventario_critico)
INSERT INTO transacciones_financieras (fecha, tipo_transaccion_id, empleado_id, repuesto_id, monto, descripcion, referencia, estado) VALUES
('2023-06-05', 2, 3, 3, 220000.00, 'Venta de ECU tras 4 meses en inventario', 'FACT-ECU-01', 'COMPLETADA');

-- Prueba de inventario agotado
UPDATE inventario_repuestos SET estado = 'AGOTADO' WHERE id = 3;

-- Prueba de repuesto vendido
UPDATE inventario_repuestos SET estado = 'VENDIDO' WHERE id IN (2, 10, 18, 21, 29);

-- ========================================
-- FIN DEL SCRIPT DE POBLACIÓN
-- ========================================


SELECT * FROM vista_auditoria_completa;
SELECT * FROM vista_auditoria_completa WHERE tipo_entidad = 'Vehículo';
CALL sp_historial_vehiculo(1);
CALL sp_actividad_auditoria_fecha('2023-02-01', '2023-04-30');



SELECT * FROM vista_analisis_financiero_mensual;
SELECT * FROM vista_auditoria_completa;
SELECT * FROM vista_dashboard_ejecutivo;
SELECT * FROM vista_inventario_completo;
SELECT * FROM vista_inventario_critico;
SELECT * FROM vista_rentabilidad_generaciones;
SELECT * FROM vista_resumen_generaciones;
SELECT * FROM vista_top_productos_vendidos;
SELECT * FROM vista_transacciones_completas;
SELECT * FROM vista_vehiculos_completa;
SELECT * FROM vista_ventas_por_empleado;
SELECT * FROM vista_ventas_empleado_mensual;
