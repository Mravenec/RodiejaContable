/*
    =========================================
    CONEXIÓN SUGERIDA (MySQL/MariaDB)
    =========================================
    HOST     : localhost
    PUERTO   : 3306
    USUARIO  : root
    PASSWORD : 123456
    DATABASE : sistema_vehicular

    EJEMPLO DE CONEXIÓN POR CONSOLA:
        mysql -u root -p123456 -h 127.0.0.1 -P 3306

    EJEMPLO EN WORKBENCH:
        Hostname: 127.0.0.1  |  Port: 3306
        Username: root        |  Password: 123456
*/


-- ========================================
-- SISTEMA UNIFICADO DE GESTIÓN VEHICULAR
-- ========================================

-- Crear la base de datos principal
CREATE DATABASE IF NOT EXISTS sistema_vehicular
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE sistema_vehicular;

-- ========================================
-- MÓDULO 1: GESTIÓN DE VEHÍCULOS
-- ========================================

-- Tabla de marcas
CREATE TABLE marcas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




-- Tabla de modelos
CREATE TABLE modelos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    marca_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (marca_id) REFERENCES marcas(id),
    UNIQUE KEY unique_marca_modelo (marca_id, nombre)
);



-- Tabla de generaciones
CREATE TABLE generaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    modelo_id INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200),
    anio_inicio INT NOT NULL,
    anio_fin INT NOT NULL,
    total_inversion DECIMAL(15,2) DEFAULT 0.00,
    total_ingresos DECIMAL(15,2) DEFAULT 0.00,
    total_egresos DECIMAL(15,2) DEFAULT 0.00,
    balance_neto DECIMAL(15,2) DEFAULT 0.00,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (modelo_id) REFERENCES modelos(id),
    UNIQUE KEY unique_modelo_generacion (modelo_id, nombre),
    CHECK (anio_inicio <= anio_fin)
);

-- Tabla principal de vehículos
CREATE TABLE vehiculos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo_vehiculo VARCHAR(20) UNIQUE,
    generacion_id INT NOT NULL,
    anio INT NOT NULL,
    precio_compra DECIMAL(12,2) NOT NULL,
    costo_grua DECIMAL(10,2) DEFAULT 0,
    comisiones DECIMAL(10,2) DEFAULT 0,
    inversion_total DECIMAL(12,2) AS (-(precio_compra + costo_grua + comisiones)) STORED,
    fecha_ingreso DATE NOT NULL,
    estado ENUM('DISPONIBLE', 'VENDIDO', 'DESARMADO', 'REPARACION') DEFAULT 'DISPONIBLE',
    precio_venta DECIMAL(12,2) DEFAULT NULL,
    fecha_venta DATE DEFAULT NULL,
    activo BOOLEAN DEFAULT TRUE,
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (generacion_id) REFERENCES generaciones(id),
    INDEX idx_generacion_activo (generacion_id, activo),
    INDEX idx_fecha_ingreso (fecha_ingreso),
    INDEX idx_estado (estado),
    INDEX idx_anio (anio)
);

-- ========================================
-- MÓDULO 2: INVENTARIO DE REPUESTOS
-- ========================================

-- Tabla de inventario de repuestos
CREATE TABLE inventario_repuestos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo_repuesto VARCHAR(20) UNIQUE,
    vehiculo_origen_id INT DEFAULT NULL,
    anio_registro SMALLINT NOT NULL,
    mes_registro TINYINT NOT NULL,
    codigo_ubicacion VARCHAR(100),
    imagen_url TEXT,
    parte_vehiculo ENUM(
        'MOTOR', 'CHASIS', 'CARROCERIA', 'COMPUTADORA',
        'CAJA DE CAMBIO', 'AIRBAGS O BOLSAS DE AIRE', 'EJES Y DIFERENCIA',
        'SUSPENSION Y AMORTIGUAMIENTO', 'EMBRAGUE', 'SISTEMA DE FRENOS',
        'TANQUE DE GASOLINA', 'DISTRIBUIDOR', 'RADIADOR', 'VENTILADOR',
        'BOMBA DE AGUA', 'BATERIA', 'AROS Y LLANTAS', 'SISTEMA DE DIRECCION',
        'SISTEMA ELECTRICO', 'FUSIBLES', 'ALTERNADOR', 'VÁLVULAS DE ESCAPE', 'TURBO'
    ) NOT NULL,
    descripcion TEXT,
    precio_costo DECIMAL(10,2) DEFAULT 0.00,
    precio_venta DECIMAL(10,2) DEFAULT 0.00,
    precio_mayoreo DECIMAL(10,2) DEFAULT 0.00,
    formula_15 DECIMAL(10,2) AS (precio_costo * 1.15) STORED,
    formula_30 DECIMAL(10,2) AS (precio_costo * 1.30) STORED,
    -- Ubicación física
    bodega ENUM('0-', 'D-', 'C-'),
    ubicado_en_vehiculo_1 ENUM('0-', 'REPUESTO EN VEHICULO'),
    ubicado_en_vehiculo_2 VARCHAR(20),
    zona ENUM('0-', 'Z1-', 'Z2-', 'Z3-', 'Z4-', 'Z5-', 'Z6-'),
    pared ENUM('0-', 'PE-', 'PO-', 'PN-', 'PS-'),
    malla ENUM(
        'V1','V2','V3','V4','V5','V6','V7','V8','V9','V10',
        'V11','V12','V13','V14','V15','V16','V17','V18','V19','V20',
        'V21','V22','V23','V24','V25','V26','V27','V28','V29','V30',
        'V31','V32','V33','V34','V35','V36','V37','V38','V39','V40',
        'V41','V42','V43','V44','V45'
    ),
    estante ENUM('E1', 'E2', 'E3', 'E4', 'E5', 'E6'),
    piso ENUM(
        'P1-','P2-','P3-','P4-','P5-','P6-','P7-','P8-','P9-','P10-',
        'P11-','P12-','P13-','P14-','P15-','P16-','P17-','P18-','P19-'
    ),
    plastica ENUM(
        'CP1-','CP2-','CP3-','CP4-','CP5-','CP6-','CP7-','CP8-','CP9-','CP10-',
        'CP11-','CP12-','CP13-','CP14-','CP15-','CP16-','CP17-','CP18-','CP19-',
        'CP20-','CP21-','CP22-','CP23-','CP24-','CP25-','CP26-','CP27-','CP28-',
        'CP29-','CP30-','CP31-','CP32-','CP33-','CP34-','CP35-','CP36-','CP37-',
        'CP38-','CP39-','CP40-','CP41-','CP42-','CP43-','CP44-','CP45-','CP46-',
        'CP47-','CP48-','CP49-','CP50-','CP51-','CP52-'
    ),
    carton ENUM(
        'MM1-','MM2-','MM3-','MM4-','MM5-','MM6-','MM7-','MM8-','MM9-','MM10-',
        'MM11-','MM12-','MM13-','MM14-','MM15-','MM16-','MM17-','MM18-','MM19-','MM20-',
        'MM21-','MM22-','MM23-','MM24-','MM25-','MM26-','MM27-','MM28-','MM29-','MM30-',
        'MM31-','MM32-','MM33-','MM34-','MM35-','MM36-','MM37-','MM38-','MM39-','MM40-',
        'MM41-','MM42-','MM43-','MM44-','MM45-','MM46-','MM47-','MM48-','MM49-','MM50-',
        'MM51-','MM52-'
    ),
    posicion VARCHAR(10),
    estado ENUM('STOCK', 'VENDIDO', 'AGOTADO', 'DAÑADO', 'USADO_INTERNO') DEFAULT 'STOCK',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehiculo_origen_id) REFERENCES vehiculos(id),
    INDEX idx_vehiculo_origen (vehiculo_origen_id),
    INDEX idx_estado (estado),
    INDEX idx_parte_vehiculo (parte_vehiculo),
    INDEX idx_fecha_registro (anio_registro, mes_registro)
);

-- ========================================
-- MÓDULO 3: GESTIÓN FINANCIERA
-- ========================================

-- Tabla de empleados
CREATE TABLE empleados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
/*
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

SELECT * FROM empleados WHERE activo = TRUE;
*/

-- Tabla de tipos de transacciones
CREATE TABLE tipos_transacciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(200),
    categoria ENUM('INGRESO', 'EGRESO') NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla principal de transacciones financieras
CREATE TABLE transacciones_financieras (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo_transaccion VARCHAR(20) UNIQUE,
    fecha DATE NOT NULL,
    dia TINYINT AS (DAY(fecha)) STORED,
    mes TINYINT AS (MONTH(fecha)) STORED,
    anio SMALLINT AS (YEAR(fecha)) STORED,
    tipo_transaccion_id INT NOT NULL,
    empleado_id INT DEFAULT NULL,
    vehiculo_id INT DEFAULT NULL,
    repuesto_id INT DEFAULT NULL,
    generacion_id INT DEFAULT NULL,
    monto DECIMAL(12,2) NOT NULL,
    comision_empleado DECIMAL(12,2) DEFAULT 0.00,
    descripcion TEXT,
    referencia VARCHAR(100),
    estado ENUM('PENDIENTE', 'COMPLETADA', 'CANCELADA') DEFAULT 'COMPLETADA',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_transaccion_id) REFERENCES tipos_transacciones(id),
    FOREIGN KEY (empleado_id) REFERENCES empleados(id),
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id),
    FOREIGN KEY (repuesto_id) REFERENCES inventario_repuestos(id),
    FOREIGN KEY (generacion_id) REFERENCES generaciones(id),
    INDEX idx_fecha (fecha),
    INDEX idx_tipo_transaccion (tipo_transaccion_id),
    INDEX idx_empleado (empleado_id),
    INDEX idx_vehiculo (vehiculo_id),
    INDEX idx_generacion (generacion_id),
    INDEX idx_estado (estado)
);

-- ========================================
-- TRIGGERS PARA AUTOMATIZACIÓN
-- ========================================

-- Trigger para generar código de vehículo
DELIMITER //

CREATE TRIGGER tr_generar_codigo_vehiculo
BEFORE INSERT ON vehiculos
FOR EACH ROW
BEGIN
    DECLARE contador INT;
    DECLARE marca_modelo VARCHAR(5);
    DECLARE codigo_tentativo VARCHAR(20);
    DECLARE intentos INT DEFAULT 0;

    -- Obtener iniciales marca+modelo, máx 5 caracteres (ej: TOCO para Toyota Corolla)
    SELECT UPPER(CONCAT(
        LEFT(REPLACE(m.nombre, ' ', ''), 2),
        LEFT(REPLACE(mo.nombre, ' ', ''), 2)
    )) INTO marca_modelo
    FROM generaciones g
    JOIN modelos mo ON g.modelo_id = mo.id
    JOIN marcas m ON mo.marca_id = m.id
    WHERE g.id = NEW.generacion_id
    LIMIT 1;

    IF marca_modelo IS NULL THEN
        SET marca_modelo = 'GEN';
    END IF;

    -- Busca el máximo correlativo existente y suma 1
    SELECT IFNULL(
        MAX(CAST(SUBSTRING_INDEX(codigo_vehiculo, '-', -1) AS UNSIGNED)),
        0
    ) + 1
    INTO contador
    FROM vehiculos
    WHERE generacion_id = NEW.generacion_id
      AND codigo_vehiculo REGEXP '^[A-Za-z]+-[0-9]+$';

    -- Etiqueta para el bucle WHILE
    cod_loop: WHILE intentos < 100 DO
        SET codigo_tentativo = CONCAT(SUBSTRING(marca_modelo, 1, 5), '-', LPAD(contador + intentos, 3, '0'));
        IF NOT EXISTS (SELECT 1 FROM vehiculos WHERE codigo_vehiculo = codigo_tentativo) THEN
            SET NEW.codigo_vehiculo = codigo_tentativo;
            LEAVE cod_loop;
        END IF;
        SET intentos = intentos + 1;
    END WHILE cod_loop;

    -- Si no logra generar un código único tras 100 intentos, usa UUID
    IF NEW.codigo_vehiculo IS NULL THEN
        SET NEW.codigo_vehiculo = CONCAT(SUBSTRING(marca_modelo, 1, 3), '-', REPLACE(UUID(), '-', ''));
    END IF;

END//

DELIMITER ;


-- Trigger para generar código de repuesto
DELIMITER //
CREATE TRIGGER tr_generar_codigo_repuesto
BEFORE INSERT ON inventario_repuestos
FOR EACH ROW
BEGIN
    DECLARE contador INT;
    SELECT COUNT(*) + 1 INTO contador FROM inventario_repuestos 
    WHERE anio_registro = NEW.anio_registro AND mes_registro = NEW.mes_registro;
    
    SET NEW.codigo_repuesto = CONCAT('REP-', NEW.anio_registro, '-', LPAD(NEW.mes_registro, 2, '0'), '-', LPAD(contador, 4, '0'));
END//
DELIMITER ;

-- Trigger para generar código de ubicación
DELIMITER //
CREATE TRIGGER tr_generar_codigo_ubicacion
BEFORE INSERT ON inventario_repuestos
FOR EACH ROW
BEGIN
    SET NEW.codigo_ubicacion = CONCAT_WS('-', NEW.bodega, NEW.zona, NEW.pared, NEW.malla, NEW.estante, NEW.piso);
END//
DELIMITER ;

-- Trigger para generar código de transacción
DELIMITER //
CREATE TRIGGER tr_generar_codigo_transaccion
BEFORE INSERT ON transacciones_financieras
FOR EACH ROW
BEGIN
    DECLARE contador INT;
    SELECT COUNT(*) + 1 INTO contador FROM transacciones_financieras 
    WHERE YEAR(fecha) = YEAR(NEW.fecha) AND MONTH(fecha) = MONTH(NEW.fecha);
    
    SET NEW.codigo_transaccion = CONCAT('TRX-', YEAR(NEW.fecha), LPAD(MONTH(NEW.fecha), 2, '0'), '-', LPAD(contador, 4, '0'));
END//
DELIMITER ;

-- Trigger para actualizar totales de generación
DELIMITER //
CREATE TRIGGER tr_actualizar_totales_generacion_insert
AFTER INSERT ON transacciones_financieras
FOR EACH ROW
BEGIN
    IF NEW.generacion_id IS NOT NULL THEN
        UPDATE generaciones g SET
            total_inversion = (
                SELECT COALESCE(SUM(v.inversion_total),0)
                FROM vehiculos v
                WHERE v.generacion_id = NEW.generacion_id AND v.activo = TRUE
            ),
            total_ingresos = (
                SELECT COALESCE(SUM(tf.monto),0)
                FROM transacciones_financieras tf
                JOIN tipos_transacciones tt ON tf.tipo_transaccion_id = tt.id
                WHERE tf.generacion_id = NEW.generacion_id
                  AND tt.categoria = 'INGRESO'
                  AND tf.activo = TRUE
            ),
            total_egresos = (
                SELECT COALESCE(SUM(tf.monto),0)
                FROM transacciones_financieras tf
                JOIN tipos_transacciones tt ON tf.tipo_transaccion_id = tt.id
                WHERE tf.generacion_id = NEW.generacion_id
                  AND tt.categoria = 'EGRESO'
                  AND tf.activo = TRUE
            )
        WHERE g.id = NEW.generacion_id;

        UPDATE generaciones
        SET balance_neto = total_inversion + total_ingresos - total_egresos
        WHERE id = NEW.generacion_id;
    END IF;
END//
DELIMITER ;

-- ========================================
-- TRIGGERS ADICIONALES PARA MAYOR ROBUSTEZ
-- ========================================

DELIMITER //

-- Trigger para UPDATE de transacciones
CREATE TRIGGER tr_actualizar_totales_generacion_update
AFTER UPDATE ON transacciones_financieras
FOR EACH ROW
BEGIN
    -- Actualizar generación anterior si cambió
    IF OLD.generacion_id IS NOT NULL AND OLD.generacion_id != NEW.generacion_id THEN
        UPDATE generaciones g SET
            total_ingresos = (
                SELECT COALESCE(SUM(tf.monto), 0) 
                FROM transacciones_financieras tf 
                JOIN tipos_transacciones tt ON tf.tipo_transaccion_id = tt.id
                WHERE tf.generacion_id = OLD.generacion_id AND tt.categoria = 'INGRESO' AND tf.activo = TRUE
            ),
            total_egresos = (
                SELECT COALESCE(SUM(tf.monto), 0) 
                FROM transacciones_financieras tf 
                JOIN tipos_transacciones tt ON tf.tipo_transaccion_id = tt.id
                WHERE tf.generacion_id = OLD.generacion_id AND tt.categoria = 'EGRESO' AND tf.activo = TRUE
            )
        WHERE g.id = OLD.generacion_id;
        
        UPDATE generaciones SET 
            balance_neto = total_ingresos - total_egresos - total_inversion
        WHERE id = OLD.generacion_id;
    END IF;
    
    -- Actualizar generación nueva
    IF NEW.generacion_id IS NOT NULL THEN
        UPDATE generaciones g SET
            total_ingresos = (
                SELECT COALESCE(SUM(tf.monto), 0) 
                FROM transacciones_financieras tf 
                JOIN tipos_transacciones tt ON tf.tipo_transaccion_id = tt.id
                WHERE tf.generacion_id = NEW.generacion_id AND tt.categoria = 'INGRESO' AND tf.activo = TRUE
            ),
            total_egresos = (
                SELECT COALESCE(SUM(tf.monto), 0) 
                FROM transacciones_financieras tf 
                JOIN tipos_transacciones tt ON tf.tipo_transaccion_id = tt.id
                WHERE tf.generacion_id = NEW.generacion_id AND tt.categoria = 'EGRESO' AND tf.activo = TRUE
            )
        WHERE g.id = NEW.generacion_id;
        
        UPDATE generaciones SET 
            balance_neto = total_ingresos - total_egresos - total_inversion
        WHERE id = NEW.generacion_id;
    END IF;
END//

-- Trigger para DELETE de transacciones
CREATE TRIGGER tr_actualizar_totales_generacion_delete
AFTER DELETE ON transacciones_financieras
FOR EACH ROW
BEGIN
    IF OLD.generacion_id IS NOT NULL THEN
        UPDATE generaciones g SET
            total_ingresos = (
                SELECT COALESCE(SUM(tf.monto), 0) 
                FROM transacciones_financieras tf 
                JOIN tipos_transacciones tt ON tf.tipo_transaccion_id = tt.id
                WHERE tf.generacion_id = OLD.generacion_id AND tt.categoria = 'INGRESO' AND tf.activo = TRUE
            ),
            total_egresos = (
                SELECT COALESCE(SUM(tf.monto), 0) 
                FROM transacciones_financieras tf 
                JOIN tipos_transacciones tt ON tf.tipo_transaccion_id = tt.id
                WHERE tf.generacion_id = OLD.generacion_id AND tt.categoria = 'EGRESO' AND tf.activo = TRUE
            )
        WHERE g.id = OLD.generacion_id;
        
        UPDATE generaciones SET 
            balance_neto = total_ingresos - total_egresos - total_inversion
        WHERE id = OLD.generacion_id;
    END IF;
END//

-- Trigger para actualizar totales cuando se modifica un vehículo
CREATE TRIGGER tr_actualizar_totales_vehiculo_update
AFTER UPDATE ON vehiculos
FOR EACH ROW
BEGIN
    -- Si cambió la generación, actualizar ambas
    IF OLD.generacion_id != NEW.generacion_id THEN
        -- Actualizar generación anterior
        UPDATE generaciones SET
            total_inversion = (
                SELECT COALESCE(SUM(v.inversion_total), 0) 
                FROM vehiculos v 
                WHERE v.generacion_id = OLD.generacion_id AND v.activo = TRUE
            )
        WHERE id = OLD.generacion_id;
        
        UPDATE generaciones SET 
            balance_neto = total_ingresos - total_egresos - total_inversion
        WHERE id = OLD.generacion_id;
    END IF;
    
    -- Actualizar generación nueva/actual
    UPDATE generaciones SET
        total_inversion = (
            SELECT COALESCE(SUM(v.inversion_total), 0) 
            FROM vehiculos v 
            WHERE v.generacion_id = NEW.generacion_id AND v.activo = TRUE
        )
    WHERE id = NEW.generacion_id;
    
    UPDATE generaciones SET 
        balance_neto = total_ingresos - total_egresos - total_inversion
    WHERE id = NEW.generacion_id;
END//

-- Trigger para actualizar totales cuando se agrega un vehículo
CREATE TRIGGER tr_actualizar_totales_vehiculo_insert
AFTER INSERT ON vehiculos
FOR EACH ROW
BEGIN
    UPDATE generaciones SET
        total_inversion = (
            SELECT COALESCE(SUM(v.inversion_total), 0) 
            FROM vehiculos v 
            WHERE v.generacion_id = NEW.generacion_id AND v.activo = TRUE
        )
    WHERE id = NEW.generacion_id;
    
    UPDATE generaciones SET 
        balance_neto = total_ingresos - total_egresos - total_inversion
    WHERE id = NEW.generacion_id;
END//

-- Trigger para actualizar totales cuando se elimina un vehículo
CREATE TRIGGER tr_actualizar_totales_vehiculo_delete
AFTER DELETE ON vehiculos
FOR EACH ROW
BEGIN
    UPDATE generaciones SET
        total_inversion = (
            SELECT COALESCE(SUM(v.inversion_total), 0) 
            FROM vehiculos v 
            WHERE v.generacion_id = OLD.generacion_id AND v.activo = TRUE
        )
    WHERE id = OLD.generacion_id;
    
    UPDATE generaciones SET 
        balance_neto = total_ingresos - total_egresos - total_inversion
    WHERE id = OLD.generacion_id;
END//

DELIMITER ;

-- ========================================
-- VISTAS PRINCIPALES
-- ========================================

-- Vista completa de vehículos
CREATE VIEW vista_vehiculos_completa AS
SELECT 
    v.id,
    v.codigo_vehiculo,
    v.anio,
    v.precio_compra,
    v.costo_grua,
    v.comisiones,
    v.inversion_total,
    v.precio_venta,
    v.fecha_ingreso,
    v.fecha_venta,
    v.estado,
    v.activo,
    v.notas,
    m.nombre AS marca,
    mo.nombre AS modelo,
    g.nombre AS generacion,
    g.descripcion AS generacion_descripcion,
    g.anio_inicio,
    g.anio_fin,
    CONCAT(m.nombre, '-', mo.nombre, '-', g.nombre) AS clave_generacion,
    -- Totales financieros del vehículo
    COALESCE(ingresos.total_ingresos, 0) AS total_ingresos_vehiculo,
    COALESCE(egresos.total_egresos, 0) AS total_egresos_vehiculo,
    (COALESCE(ingresos.total_ingresos, 0) - COALESCE(egresos.total_egresos, 0) - v.inversion_total) AS balance_neto_vehiculo
FROM vehiculos v
JOIN generaciones g ON v.generacion_id = g.id
JOIN modelos mo ON g.modelo_id = mo.id
JOIN marcas m ON mo.marca_id = m.id
LEFT JOIN (
    SELECT 
        vehiculo_id,
        SUM(monto) AS total_ingresos
    FROM transacciones_financieras tf
    JOIN tipos_transacciones tt ON tf.tipo_transaccion_id = tt.id
    WHERE tt.categoria = 'INGRESO' AND tf.activo = TRUE
    GROUP BY vehiculo_id
) ingresos ON v.id = ingresos.vehiculo_id
LEFT JOIN (
    SELECT 
        vehiculo_id,
        SUM(monto) AS total_egresos
    FROM transacciones_financieras tf
    JOIN tipos_transacciones tt ON tf.tipo_transaccion_id = tt.id
    WHERE tt.categoria = 'EGRESO' AND tf.activo = TRUE
    GROUP BY vehiculo_id
) egresos ON v.id = egresos.vehiculo_id;

-- Vista resumen por generación
CREATE VIEW vista_resumen_generaciones AS
SELECT 
    g.id AS generacion_id,
    m.nombre AS marca,
    mo.nombre AS modelo,
    g.nombre AS generacion,
    g.descripcion,
    CONCAT(m.nombre, '-', mo.nombre, '-', g.nombre) AS clave_generacion,
    g.anio_inicio,
    g.anio_fin,
    COUNT(DISTINCT v.id) AS total_vehiculos,
    COUNT(DISTINCT ir.id) AS total_repuestos,
    g.total_inversion,
    g.total_ingresos,
    g.total_egresos,
    g.balance_neto,
    CASE 
        WHEN g.total_inversion > 0 THEN ROUND((g.balance_neto / g.total_inversion) * 100, 2)
        ELSE 0
    END AS porcentaje_retorno
FROM generaciones g
JOIN modelos mo ON g.modelo_id = mo.id
JOIN marcas m ON mo.marca_id = m.id
LEFT JOIN vehiculos v ON g.id = v.generacion_id AND v.activo = TRUE
LEFT JOIN inventario_repuestos ir ON v.id = ir.vehiculo_origen_id AND ir.estado = 'STOCK'
WHERE g.activo = TRUE
GROUP BY g.id, m.nombre, mo.nombre, g.nombre, g.descripcion, g.anio_inicio, g.anio_fin,
         g.total_inversion, g.total_ingresos, g.total_egresos, g.balance_neto;

-- Vista de inventario completo
CREATE VIEW vista_inventario_completo AS
SELECT 
    ir.id,
    ir.codigo_repuesto,
    ir.codigo_ubicacion,
    ir.parte_vehiculo,
    ir.descripcion,
    ir.precio_costo,
    ir.precio_venta,
    ir.precio_mayoreo,
    ir.formula_15,
    ir.formula_30,
    ir.estado,
    ir.anio_registro,
    ir.mes_registro,
    -- Información del vehículo origen
    v.codigo_vehiculo,
    vvc.marca,
    vvc.modelo,
    vvc.generacion,
    vvc.anio AS anio_vehiculo,
    vvc.clave_generacion
FROM inventario_repuestos ir
LEFT JOIN vehiculos v ON ir.vehiculo_origen_id = v.id
LEFT JOIN vista_vehiculos_completa vvc ON v.id = vvc.id;

-- Vista de transacciones completas
CREATE VIEW vista_transacciones_completas AS
SELECT 
    tf.id,
    tf.codigo_transaccion,
    tf.fecha,
    tf.monto,
    tf.comision_empleado,
    tf.descripcion,
    tf.referencia,
    tf.estado,
    tt.nombre AS tipo_transaccion,
    tt.categoria,
    e.nombre AS empleado,
    v.codigo_vehiculo,
    ir.codigo_repuesto,
    vvc.marca,
    vvc.modelo,
    vvc.generacion,
    vvc.clave_generacion
FROM transacciones_financieras tf
JOIN tipos_transacciones tt ON tf.tipo_transaccion_id = tt.id
LEFT JOIN empleados e ON tf.empleado_id = e.id
LEFT JOIN vehiculos v ON tf.vehiculo_id = v.id
LEFT JOIN inventario_repuestos ir ON tf.repuesto_id = ir.id
LEFT JOIN vista_vehiculos_completa vvc ON COALESCE(v.id, ir.vehiculo_origen_id) = vvc.id
WHERE tf.activo = TRUE;
-- ========================================
-- VISTAS ADICIONALES PARA REPORTES ESPECÍFICOS
-- ========================================

-- Vista para dashboard ejecutivo
CREATE VIEW vista_dashboard_ejecutivo AS
SELECT 
    'Resumen General' AS seccion,
    COUNT(DISTINCT v.id) AS total_vehiculos,
    COUNT(DISTINCT CASE WHEN v.estado = 'DISPONIBLE' THEN v.id END) AS vehiculos_disponibles,
    COUNT(DISTINCT CASE WHEN v.estado = 'VENDIDO' THEN v.id END) AS vehiculos_vendidos,
    COUNT(DISTINCT ir.id) AS total_repuestos,
    COUNT(DISTINCT CASE WHEN ir.estado = 'STOCK' THEN ir.id END) AS repuestos_stock,
    SUM(DISTINCT g.total_inversion) AS inversion_total,
    SUM(DISTINCT g.total_ingresos) AS ingresos_totales,
    SUM(DISTINCT g.total_egresos) AS egresos_totales,
    SUM(DISTINCT g.balance_neto) AS balance_neto_total,
    ROUND(AVG(CASE WHEN g.total_inversion > 0 THEN (g.balance_neto / g.total_inversion) * 100 END), 2) AS roi_promedio
FROM vehiculos v
LEFT JOIN generaciones g ON v.generacion_id = g.id
LEFT JOIN inventario_repuestos ir ON v.id = ir.vehiculo_origen_id
WHERE v.activo = TRUE AND g.activo = TRUE;

-- Vista para análisis de ventas por empleado
CREATE VIEW vista_ventas_por_empleado AS
SELECT 
    e.nombre AS empleado,
    COUNT(DISTINCT tf.id) AS total_transacciones,
    COUNT(DISTINCT CASE WHEN tt.categoria = 'INGRESO' THEN tf.id END) AS transacciones_venta,
    SUM(CASE WHEN tt.categoria = 'INGRESO' THEN tf.monto ELSE 0 END) AS total_ventas,
    SUM(tf.comision_empleado) AS total_comisiones,
    ROUND(AVG(CASE WHEN tt.categoria = 'INGRESO' THEN tf.monto END), 2) AS promedio_venta,
    ROUND(SUM(tf.comision_empleado) / NULLIF(SUM(CASE WHEN tt.categoria = 'INGRESO' THEN tf.monto ELSE 0 END), 0) * 100, 2) AS porcentaje_comision
FROM empleados e
LEFT JOIN transacciones_financieras tf ON e.id = tf.empleado_id
LEFT JOIN tipos_transacciones tt ON tf.tipo_transaccion_id = tt.id
WHERE e.activo = TRUE AND (tf.activo = TRUE OR tf.id IS NULL)
GROUP BY e.id, e.nombre
ORDER BY total_ventas DESC;

-- Vista para análisis de rentabilidad por generación
CREATE VIEW vista_rentabilidad_generaciones AS
SELECT 
    g.id AS generacion_id,
    CONCAT(m.nombre, ' ', mo.nombre, ' ', g.nombre) AS generacion_completa,
    g.anio_inicio,
    g.anio_fin,
    COUNT(DISTINCT v.id) AS total_vehiculos,
    COUNT(DISTINCT CASE WHEN v.estado = 'VENDIDO' THEN v.id END) AS vehiculos_vendidos,
    COUNT(DISTINCT CASE WHEN v.estado = 'DISPONIBLE' THEN v.id END) AS vehiculos_disponibles,
    g.total_inversion,
    g.total_ingresos,
    g.total_egresos,
    g.balance_neto,
    CASE 
        WHEN g.total_inversion > 0 THEN ROUND((g.balance_neto / g.total_inversion) * 100, 2)
        ELSE 0
    END AS roi_porcentaje,
    CASE 
        WHEN COUNT(DISTINCT v.id) > 0 THEN ROUND(g.balance_neto / COUNT(DISTINCT v.id), 2)
        ELSE 0
    END AS utilidad_por_vehiculo,
    ROUND(g.total_ingresos / NULLIF(g.total_inversion, 0), 2) AS multiplicador_inversion,
    CASE
        WHEN g.balance_neto > g.total_inversion * 0.3 THEN 'Excelente'
        WHEN g.balance_neto > g.total_inversion * 0.15 THEN 'Buena'
        WHEN g.balance_neto > 0 THEN 'Positiva'
        ELSE 'Pérdida'
    END AS clasificacion_rentabilidad
FROM generaciones g
JOIN modelos mo ON g.modelo_id = mo.id
JOIN marcas m ON mo.marca_id = m.id
LEFT JOIN vehiculos v ON g.id = v.generacion_id AND v.activo = TRUE
WHERE g.activo = TRUE
GROUP BY g.id, m.nombre, mo.nombre, g.nombre, g.anio_inicio, g.anio_fin,
         g.total_inversion, g.total_ingresos, g.total_egresos, g.balance_neto
ORDER BY roi_porcentaje DESC;

-- Vista para análisis de inventario crítico
CREATE VIEW vista_inventario_critico AS
SELECT 
    ir.codigo_repuesto,
    ir.parte_vehiculo,
    ir.descripcion,
    ir.precio_costo,
    ir.precio_venta,
    ir.precio_mayoreo,
    ir.formula_15,
    ir.formula_30,
    ir.estado,
    ir.codigo_ubicacion,
    CONCAT(vvc.marca, ' ', vvc.modelo, ' ', vvc.generacion) AS vehiculo_origen,
    vvc.anio AS anio_vehiculo,
    ir.anio_registro,
    ir.mes_registro,
    DATEDIFF(CURDATE(), DATE(ir.fecha_creacion)) AS dias_en_inventario,
    CASE 
        WHEN ir.precio_venta > ir.precio_costo * 2 THEN 'Alto Margen'
        WHEN ir.precio_venta > ir.precio_costo * 1.5 THEN 'Margen Medio'
        WHEN ir.precio_venta > ir.precio_costo * 1.2 THEN 'Margen Bajo'
        ELSE 'Sin Margen'
    END AS clasificacion_margen,
    CASE 
        WHEN DATEDIFF(CURDATE(), DATE(ir.fecha_creacion)) > 365 THEN 'Inventario Lento'
        WHEN DATEDIFF(CURDATE(), DATE(ir.fecha_creacion)) > 180 THEN 'Inventario Medio'
        ELSE 'Inventario Rápido'
    END AS clasificacion_rotacion
FROM inventario_repuestos ir
LEFT JOIN vehiculos v ON ir.vehiculo_origen_id = v.id
LEFT JOIN vista_vehiculos_completa vvc ON v.id = vvc.id
WHERE ir.estado = 'STOCK'
ORDER BY dias_en_inventario DESC;

-- Vista para análisis financiero mensual
CREATE VIEW vista_analisis_financiero_mensual AS
SELECT 
    YEAR(tf.fecha) AS anio,
    MONTH(tf.fecha) AS mes,
    MONTHNAME(tf.fecha) AS nombre_mes,
    COUNT(DISTINCT tf.id) AS total_transacciones,
    SUM(CASE WHEN tt.categoria = 'INGRESO' THEN tf.monto ELSE 0 END) AS total_ingresos,
    SUM(CASE WHEN tt.categoria = 'EGRESO' THEN tf.monto ELSE 0 END) AS total_egresos,
    SUM(CASE WHEN tt.categoria = 'INGRESO' THEN tf.monto ELSE -tf.monto END) AS balance_neto,
    SUM(tf.comision_empleado) AS total_comisiones,
    COUNT(DISTINCT CASE WHEN tt.categoria = 'INGRESO' THEN tf.vehiculo_id END) AS vehiculos_vendidos,
    COUNT(DISTINCT CASE WHEN tt.categoria = 'INGRESO' THEN tf.repuesto_id END) AS repuestos_vendidos,
    ROUND(AVG(CASE WHEN tt.categoria = 'INGRESO' THEN tf.monto END), 2) AS promedio_venta,
    ROUND(SUM(CASE WHEN tt.categoria = 'INGRESO' THEN tf.monto ELSE 0 END) / 
          NULLIF(SUM(CASE WHEN tt.categoria = 'EGRESO' THEN tf.monto ELSE 0 END), 0), 2) AS ratio_ingresos_egresos
FROM transacciones_financieras tf
JOIN tipos_transacciones tt ON tf.tipo_transaccion_id = tt.id
WHERE tf.activo = TRUE
GROUP BY YEAR(tf.fecha), MONTH(tf.fecha), MONTHNAME(tf.fecha)
ORDER BY anio DESC, mes DESC;

-- Vista para top de productos más vendidos
CREATE VIEW vista_top_productos_vendidos AS
SELECT 
    'Vehículos' AS tipo_producto,
    CONCAT(vvc.marca, ' ', vvc.modelo, ' ', vvc.generacion) AS producto,
    COUNT(DISTINCT tf.id) AS veces_vendido,
    SUM(tf.monto) AS total_ingresos,
    ROUND(AVG(tf.monto), 2) AS promedio_venta,
    SUM(tf.comision_empleado) AS total_comisiones
FROM transacciones_financieras tf
JOIN tipos_transacciones tt ON tf.tipo_transaccion_id = tt.id
JOIN vehiculos v ON tf.vehiculo_id = v.id
JOIN vista_vehiculos_completa vvc ON v.id = vvc.id
WHERE tt.categoria = 'INGRESO' AND tf.activo = TRUE
GROUP BY vvc.marca, vvc.modelo, vvc.generacion

UNION ALL

SELECT 
    'Repuestos' AS tipo_producto,
    CONCAT(ir.parte_vehiculo, ' - ', COALESCE(ir.descripcion, 'Sin descripción')) AS producto,
    COUNT(DISTINCT tf.id) AS veces_vendido,
    SUM(tf.monto) AS total_ingresos,
    ROUND(AVG(tf.monto), 2) AS promedio_venta,
    SUM(tf.comision_empleado) AS total_comisiones
FROM transacciones_financieras tf
JOIN tipos_transacciones tt ON tf.tipo_transaccion_id = tt.id
JOIN inventario_repuestos ir ON tf.repuesto_id = ir.id
WHERE tt.categoria = 'INGRESO' AND tf.activo = TRUE
GROUP BY ir.parte_vehiculo, ir.descripcion

ORDER BY total_ingresos DESC;

-- ========================================
-- MÓDULO DE AUDITORÍA E HISTÓRICO
-- ========================================

-- Tabla de historial de vehículos
CREATE TABLE historial_vehiculos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vehiculo_id INT NOT NULL,
    accion ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    campo_modificado VARCHAR(50),
    valor_anterior TEXT,
    valor_nuevo TEXT,
    usuario VARCHAR(100),
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_usuario VARCHAR(45),
    observaciones TEXT,
    INDEX idx_vehiculo_fecha (vehiculo_id, fecha_cambio),
    INDEX idx_accion (accion),
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
);

-- Tabla de historial de repuestos
CREATE TABLE historial_repuestos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    repuesto_id INT NOT NULL,
    accion ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    campo_modificado VARCHAR(50),
    valor_anterior TEXT,
    valor_nuevo TEXT,
    usuario VARCHAR(100),
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_usuario VARCHAR(45),
    observaciones TEXT,
    INDEX idx_repuesto_fecha (repuesto_id, fecha_cambio),
    INDEX idx_accion (accion),
    FOREIGN KEY (repuesto_id) REFERENCES inventario_repuestos(id)
);

-- Tabla de historial de transacciones
CREATE TABLE historial_transacciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    transaccion_id INT NOT NULL,
    accion ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    campo_modificado VARCHAR(50),
    valor_anterior TEXT,
    valor_nuevo TEXT,
    usuario VARCHAR(100),
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_usuario VARCHAR(45),
    observaciones TEXT,
    INDEX idx_transaccion_fecha (transaccion_id, fecha_cambio),
    INDEX idx_accion (accion),
    FOREIGN KEY (transaccion_id) REFERENCES transacciones_financieras(id)
);

-- ========================================
-- TRIGGERS PARA AUDITORÍA
-- ========================================

DELIMITER //

-- Trigger para auditar cambios en vehículos
CREATE TRIGGER tr_audit_vehiculos_update
AFTER UPDATE ON vehiculos
FOR EACH ROW
BEGIN
    -- Auditar cambios en precio_compra
    IF OLD.precio_compra != NEW.precio_compra THEN
        INSERT INTO historial_vehiculos (vehiculo_id, accion, campo_modificado, valor_anterior, valor_nuevo, usuario)
        VALUES (NEW.id, 'UPDATE', 'precio_compra', OLD.precio_compra, NEW.precio_compra, USER());
    END IF;
    
    -- Auditar cambios en estado
    IF OLD.estado != NEW.estado THEN
        INSERT INTO historial_vehiculos (vehiculo_id, accion, campo_modificado, valor_anterior, valor_nuevo, usuario)
        VALUES (NEW.id, 'UPDATE', 'estado', OLD.estado, NEW.estado, USER());
    END IF;
    
    -- Auditar cambios en precio_venta
    IF (OLD.precio_venta IS NULL AND NEW.precio_venta IS NOT NULL) OR 
       (OLD.precio_venta IS NOT NULL AND NEW.precio_venta IS NULL) OR
       (OLD.precio_venta != NEW.precio_venta) THEN
        INSERT INTO historial_vehiculos (vehiculo_id, accion, campo_modificado, valor_anterior, valor_nuevo, usuario)
        VALUES (NEW.id, 'UPDATE', 'precio_venta', OLD.precio_venta, NEW.precio_venta, USER());
    END IF;
END//

-- Trigger para auditar cambios en repuestos
CREATE TRIGGER tr_audit_repuestos_update
AFTER UPDATE ON inventario_repuestos
FOR EACH ROW
BEGIN
    -- Auditar cambios en estado
    IF OLD.estado != NEW.estado THEN
        INSERT INTO historial_repuestos (repuesto_id, accion, campo_modificado, valor_anterior, valor_nuevo, usuario)
        VALUES (NEW.id, 'UPDATE', 'estado', OLD.estado, NEW.estado, USER());
    END IF;
    
    -- Auditar cambios en precio_venta
    IF OLD.precio_venta != NEW.precio_venta THEN
        INSERT INTO historial_repuestos (repuesto_id, accion, campo_modificado, valor_anterior, valor_nuevo, usuario)
        VALUES (NEW.id, 'UPDATE', 'precio_venta', OLD.precio_venta, NEW.precio_venta, USER());
    END IF;
END//

-- Trigger para auditar cambios importantes en transacciones
CREATE TRIGGER tr_audit_transacciones_update
AFTER UPDATE ON transacciones_financieras
FOR EACH ROW
BEGIN
    -- Auditar cambios en monto
    IF OLD.monto != NEW.monto THEN
        INSERT INTO historial_transacciones (transaccion_id, accion, campo_modificado, valor_anterior, valor_nuevo, usuario)
        VALUES (NEW.id, 'UPDATE', 'monto', OLD.monto, NEW.monto, USER());
    END IF;
    
    -- Auditar cambios en estado
    IF OLD.estado != NEW.estado THEN
        INSERT INTO historial_transacciones (transaccion_id, accion, campo_modificado, valor_anterior, valor_nuevo, usuario)
        VALUES (NEW.id, 'UPDATE', 'estado', OLD.estado, NEW.estado, USER());
    END IF;
END//

DELIMITER ;

-- ========================================
-- VISTA DE AUDITORÍA COMPLETA
-- ========================================

CREATE VIEW vista_auditoria_completa AS
SELECT 
    'Vehículo' AS tipo_entidad,
    CONCAT('ID: ', hv.vehiculo_id) AS entidad_id,
    vvc.codigo_vehiculo AS codigo_entidad,
    CONCAT(vvc.marca, ' ', vvc.modelo, ' ', vvc.generacion) AS descripcion_entidad,
    hv.accion,
    hv.campo_modificado,
    hv.valor_anterior,
    hv.valor_nuevo,
    hv.usuario,
    hv.fecha_cambio,
    hv.observaciones
FROM historial_vehiculos hv
LEFT JOIN vista_vehiculos_completa vvc ON hv.vehiculo_id = vvc.id

UNION ALL

SELECT 
    'Repuesto' AS tipo_entidad,
    CONCAT('ID: ', hr.repuesto_id) AS entidad_id,
    vic.codigo_repuesto AS codigo_entidad,
    CONCAT(vic.parte_vehiculo, ' - ', COALESCE(vic.descripcion, 'Sin desc.')) AS descripcion_entidad,
    hr.accion,
    hr.campo_modificado,
    hr.valor_anterior,
    hr.valor_nuevo,
    hr.usuario,
    hr.fecha_cambio,
    hr.observaciones
FROM historial_repuestos hr
LEFT JOIN vista_inventario_completo vic ON hr.repuesto_id = vic.id

UNION ALL

SELECT 
    'Transacción' AS tipo_entidad,
    CONCAT('ID: ', ht.transaccion_id) AS entidad_id,
    vtc.codigo_transaccion AS codigo_entidad,
    CONCAT(vtc.tipo_transaccion, ' - $', vtc.monto) AS descripcion_entidad,
    ht.accion,
    ht.campo_modificado,
    ht.valor_anterior,
    ht.valor_nuevo,
    ht.usuario,
    ht.fecha_cambio,
    ht.observaciones
FROM historial_transacciones ht
LEFT JOIN vista_transacciones_completas vtc ON ht.transaccion_id = vtc.id

ORDER BY fecha_cambio DESC;

-- ========================================
-- PROCEDIMIENTOS PARA AUDITORÍA
-- ========================================

DELIMITER //

-- Procedimiento para consultar historial de un vehículo específico
CREATE PROCEDURE sp_historial_vehiculo(IN p_vehiculo_id INT)
BEGIN
    SELECT 
        hv.*,
        vvc.codigo_vehiculo,
        CONCAT(vvc.marca, ' ', vvc.modelo, ' ', vvc.generacion) AS vehiculo_descripcion
    FROM historial_vehiculos hv
    LEFT JOIN vista_vehiculos_completa vvc ON hv.vehiculo_id = vvc.id
    WHERE hv.vehiculo_id = p_vehiculo_id
    ORDER BY hv.fecha_cambio DESC;
END//

-- Procedimiento para consultar actividad de auditoría por fecha
CREATE PROCEDURE sp_actividad_auditoria_fecha(IN p_fecha_inicio DATE, IN p_fecha_fin DATE)
BEGIN
    SELECT 
        DATE(fecha_cambio) AS fecha,
        tipo_entidad,
        accion,
        COUNT(*) AS total_cambios,
        COUNT(DISTINCT usuario) AS usuarios_activos
    FROM vista_auditoria_completa
    WHERE DATE(fecha_cambio) BETWEEN p_fecha_inicio AND p_fecha_fin
    GROUP BY DATE(fecha_cambio), tipo_entidad, accion
    ORDER BY fecha DESC, tipo_entidad, accion;
END//

DELIMITER ;

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

-- Repuestos del Toyota Corolla 2015 (vehiculo_id = 1)
INSERT INTO inventario_repuestos (vehiculo_origen_id, anio_registro, mes_registro, parte_vehiculo, descripcion, precio_costo, precio_venta, precio_mayoreo, bodega, zona, pared, malla, estante, piso, estado) VALUES
(1, 2023, 2, 'MOTOR', 'Motor completo 1.8L 2ZR-FE', 580000.00, 750000.00, 650000.00, 'D-', 'Z1-', 'PE-', 'V15', 'E1', 'P1-', 'STOCK'),
(1, 2023, 2, 'CAJA DE CAMBIO', 'Transmisión automática CVT', 420000.00, 580000.00, 500000.00, 'D-', 'Z1-', 'PE-', 'V16', 'E1', 'P1-', 'STOCK'),
(1, 2023, 2, 'COMPUTADORA', 'ECU módulo motor', 150000.00, 220000.00, 180000.00, 'D-', 'Z2-', 'PN-', 'V5', 'E2', 'P2-', 'STOCK'),
(1, 2023, 2, 'SISTEMA DE FRENOS', 'Discos de freno delanteros', 45000.00, 75000.00, 60000.00, 'D-', 'Z2-', 'PN-', 'V6', 'E2', 'P2-', 'STOCK'),
(1, 2023, 2, 'SUSPENSION Y AMORTIGUAMIENTO', 'Amortiguadores delanteros (par)', 85000.00, 125000.00, 105000.00, 'D-', 'Z2-', 'PN-', 'V7', 'E2', 'P3-', 'STOCK'),
(1, 2023, 2, 'CARROCERIA', 'Puerta delantera derecha', 120000.00, 180000.00, 150000.00, 'C-', 'Z3-', 'PO-', 'V20', 'E3', 'P5-', 'STOCK'),
(1, 2023, 2, 'SISTEMA ELECTRICO', 'Faros LED principales', 95000.00, 145000.00, 120000.00, 'D-', 'Z3-', 'PS-', 'V25', 'E3', 'P6-', 'STOCK'),
(1, 2023, 2, 'AROS Y LLANTAS', 'Llantas 205/55R16 (juego)', 160000.00, 240000.00, 200000.00, 'C-', 'Z4-', 'PE-', 'V30', 'E4', 'P8-', 'STOCK');

-- Repuestos del Honda Civic 2017 (vehiculo_id = 10)
INSERT INTO inventario_repuestos (vehiculo_origen_id, anio_registro, mes_registro, parte_vehiculo, descripcion, precio_costo, precio_venta, precio_mayoreo, bodega, zona, pared, malla, estante, piso, estado) VALUES
(10, 2023, 3, 'MOTOR', 'Motor turbo 1.5L L15B7', 650000.00, 850000.00, 750000.00, 'D-', 'Z1-', 'PE-', 'V12', 'E1', 'P1-', 'STOCK'),
(10, 2023, 3, 'CAJA DE CAMBIO', 'Transmisión CVT', 380000.00, 520000.00, 450000.00, 'D-', 'Z1-', 'PE-', 'V13', 'E1', 'P1-', 'STOCK'),
(10, 2023, 3, 'TURBO', 'Turbocompresor completo', 280000.00, 420000.00, 350000.00, 'D-', 'Z2-', 'PN-', 'V8', 'E2', 'P2-', 'STOCK'),
(10, 2023, 3, 'COMPUTADORA', 'PCM Honda Sensing', 180000.00, 280000.00, 230000.00, 'D-', 'Z2-', 'PN-', 'V9', 'E2', 'P2-', 'STOCK'),
(10, 2023, 3, 'SISTEMA DE FRENOS', 'Calipers de freno Brembo', 120000.00, 180000.00, 150000.00, 'D-', 'Z2-', 'PN-', 'V10', 'E2', 'P3-', 'STOCK'),
(10, 2023, 3, 'CARROCERIA', 'Capó con entradas de aire', 85000.00, 135000.00, 110000.00, 'C-', 'Z3-', 'PO-', 'V22', 'E3', 'P5-', 'STOCK'),
(10, 2023, 3, 'SISTEMA ELECTRICO', 'Pantalla touch 7 pulgadas', 220000.00, 320000.00, 270000.00, 'D-', 'Z3-', 'PS-', 'V26', 'E3', 'P6-', 'STOCK'),
(10, 2023, 3, 'AROS Y LLANTAS', 'Rines deportivos 18"', 180000.00, 280000.00, 230000.00, 'C-', 'Z4-', 'PE-', 'V32', 'E4', 'P8-', 'STOCK');

-- Repuestos del Honda CR-V 2018 (vehiculo_id = 15)
INSERT INTO inventario_repuestos (vehiculo_origen_id, anio_registro, mes_registro, parte_vehiculo, descripcion, precio_costo, precio_venta, precio_mayoreo, bodega, zona, pared, malla, estante, piso, estado) VALUES
(15, 2023, 4, 'MOTOR', 'Motor 1.5L turbo K15B', 720000.00, 980000.00, 850000.00, 'D-', 'Z1-', 'PE-', 'V18', 'E1', 'P1-', 'STOCK'),
(15, 2023, 4, 'SISTEMA DE DIRECCION', 'Dirección asistida eléctrica', 320000.00, 460000.00, 390000.00, 'D-', 'Z2-', 'PN-', 'V11', 'E2', 'P2-', 'STOCK'),
(15, 2023, 4, 'EJES Y DIFERENCIA', 'Diferencial trasero AWD', 280000.00, 420000.00, 350000.00, 'D-', 'Z2-', 'PN-', 'V12', 'E2', 'P3-', 'STOCK'),
(15, 2023, 4, 'CARROCERIA', 'Compuerta trasera eléctrica', 450000.00, 650000.00, 550000.00, 'C-', 'Z3-', 'PO-', 'V23', 'E3', 'P5-', 'STOCK'),
(15, 2023, 4, 'AIRBAGS O BOLSAS DE AIRE', 'Airbags laterales (set)', 180000.00, 280000.00, 230000.00, 'D-', 'Z3-', 'PS-', 'V27', 'E3', 'P6-', 'STOCK'),
(15, 2023, 4, 'SISTEMA ELECTRICO', 'Cámara 360° completa', 320000.00, 480000.00, 400000.00, 'D-', 'Z3-', 'PS-', 'V28', 'E3', 'P6-', 'STOCK');

-- Nissan Sentra 2015 (vehiculo_id = 18, continuación)
INSERT INTO inventario_repuestos (vehiculo_origen_id, anio_registro, mes_registro, parte_vehiculo, descripcion, precio_costo, precio_venta, precio_mayoreo, bodega, zona, pared, malla, estante, piso, estado) VALUES
(18, 2023, 2, 'CARROCERIA', 'Puerta trasera izquierda', 95000.00, 145000.00, 120000.00, 'C-', 'Z4-', 'PE-', 'V33', 'E5', 'P7-', 'STOCK'),
(18, 2023, 2, 'EMBRAGUE', 'Kit de embrague completo', 78000.00, 115000.00, 95000.00, 'D-', 'Z1-', 'PE-', 'V17', 'E1', 'P1-', 'STOCK'),
(18, 2023, 2, 'AROS Y LLANTAS', 'Juegos de aros originales', 180000.00, 255000.00, 210000.00, 'D-', 'Z2-', 'PN-', 'V13', 'E2', 'P3-', 'STOCK');

-- Hyundai Elantra 2019 (vehiculo_id = 23)
INSERT INTO inventario_repuestos (vehiculo_origen_id, anio_registro, mes_registro, parte_vehiculo, descripcion, precio_costo, precio_venta, precio_mayoreo, bodega, zona, pared, malla, estante, piso, estado) VALUES
(23, 2023, 3, 'MOTOR', 'Motor 2.0L Nu', 540000.00, 720000.00, 630000.00, 'C-', 'Z2-', 'PN-', 'V19', 'E2', 'P3-', 'STOCK'),
(23, 2023, 3, 'COMPUTADORA', 'ECU principal', 132000.00, 195000.00, 165000.00, 'C-', 'Z2-', 'PN-', 'V21', 'E2', 'P3-', 'STOCK'),
(23, 2023, 3, 'SUSPENSION Y AMORTIGUAMIENTO', 'Amortiguadores traseros', 70000.00, 110000.00, 90000.00, 'C-', 'Z2-', 'PN-', 'V24', 'E2', 'P4-', 'STOCK');

-- Chevrolet Spark 2019 (vehiculo_id = 27)
INSERT INTO inventario_repuestos (vehiculo_origen_id, anio_registro, mes_registro, parte_vehiculo, descripcion, precio_costo, precio_venta, precio_mayoreo, bodega, zona, pared, malla, estante, piso, estado) VALUES
(27, 2023, 2, 'MOTOR', 'Motor 1.2L S-TEC II', 310000.00, 420000.00, 350000.00, 'C-', 'Z3-', 'PO-', 'V20', 'E3', 'P6-', 'STOCK'),
(27, 2023, 2, 'CARROCERIA', 'Parachoques delantero', 50000.00, 78000.00, 65000.00, 'C-', 'Z3-', 'PO-', 'V28', 'E3', 'P6-', 'STOCK'),
(27, 2023, 2, 'SISTEMA ELECTRICO', 'Tablero principal', 74000.00, 110000.00, 90000.00, 'C-', 'Z3-', 'PO-', 'V29', 'E3', 'P6-', 'STOCK'),
(27, 2023, 2, 'TANQUE DE GASOLINA', 'Tanque completo', 53000.00, 80000.00, 66000.00, 'C-', 'Z4-', 'PE-', 'V34', 'E5', 'P7-', 'STOCK');

-- Repuestos extra (sin vehículo de origen, compra directa)
INSERT INTO inventario_repuestos (vehiculo_origen_id, anio_registro, mes_registro, parte_vehiculo, descripcion, precio_costo, precio_venta, precio_mayoreo, bodega, zona, pared, malla, estante, piso, estado) VALUES
(NULL, 2023, 5, 'BATERIA', 'Batería nueva 12V 45Ah', 35000.00, 55000.00, 45000.00, 'C-', 'Z4-', 'PE-', 'V35', 'E6', 'P9-', 'STOCK'),
(NULL, 2023, 5, 'ALTERNADOR', 'Alternador Bosch universal', 55000.00, 80000.00, 67000.00, 'C-', 'Z4-', 'PE-', 'V36', 'E6', 'P10-', 'STOCK'),
(NULL, 2023, 5, 'FUSIBLES', 'Set de fusibles (10 unidades)', 8000.00, 15000.00, 12000.00, 'C-', 'Z4-', 'PE-', 'V37', 'E6', 'P11-', 'STOCK');

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

