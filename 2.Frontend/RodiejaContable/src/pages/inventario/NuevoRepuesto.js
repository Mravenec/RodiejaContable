import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Select, 
  InputNumber,
  message,
  Row,
  Col,
  Divider,
  Radio
} from 'antd';
import { 
  SaveOutlined, 
  ArrowLeftOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { useMarcas } from '../../hooks/useMarcas';
import { useModelos } from '../../hooks/useModelos';
import { useGeneraciones } from '../../hooks/useGeneraciones';
import { useVehiculos } from '../../hooks/useVehiculos';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const NuevoRepuesto = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tipoRepuesto, setTipoRepuesto] = useState('con_vehiculo');
  
  // Estados para la cadena de selección (solo para repuestos SIN vehículo)
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);
  const [generacionSeleccionada, setGeneracionSeleccionada] = useState(null);

  // Hooks para cargar datos
  const { data: marcas = [], isLoading: loadingMarcas } = useMarcas();
  const { data: modelos = [], isLoading: loadingModelos } = useModelos(marcaSeleccionada, !!marcaSeleccionada && tipoRepuesto === 'sin_vehiculo');
  const { data: generaciones = [], isLoading: loadingGeneraciones } = useGeneraciones(modeloSeleccionado, !!modeloSeleccionado && tipoRepuesto === 'sin_vehiculo');
  
  // Para repuestos CON vehículo: cargar todos los vehículos DESARMADOS
  const { data: vehiculos = [], isLoading: loadingVehiculos } = useVehiculos(
    { estado: 'DESARMADO' },
    { enabled: tipoRepuesto === 'con_vehiculo' }
  );

  // Handlers para los dropdowns (solo para repuestos sin vehículo)
  const onMarcaChange = (marcaId) => {
    setMarcaSeleccionada(marcaId);
    setModeloSeleccionado(null);
    setGeneracionSeleccionada(null);
    form.setFieldsValue({
      modelo_id: undefined,
      generacion_id: undefined
    });
  };

  const onModeloChange = (modeloId) => {
    setModeloSeleccionado(modeloId);
    setGeneracionSeleccionada(null);
    form.setFieldsValue({
      generacion_id: undefined
    });
  };

  const onGeneracionChange = (generacionId) => {
    setGeneracionSeleccionada(generacionId);
  };

  const onTipoRepuestoChange = (e) => {
    const nuevoTipo = e.target.value;
    setTipoRepuesto(nuevoTipo);
    
    if (nuevoTipo === 'con_vehiculo') {
      // Limpiar campos de marca/modelo/generación
      setMarcaSeleccionada(null);
      setModeloSeleccionado(null);
      setGeneracionSeleccionada(null);
      form.setFieldsValue({
        marca_id: undefined,
        modelo_id: undefined,
        generacion_id: undefined,
        vehiculo_origen_id: undefined
      });
    } else {
      // Limpiar campo de vehículo
      form.setFieldsValue({
        vehiculo_origen_id: undefined
      });
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const repuestoData = {
        // Campos obligatorios
        parte_vehiculo: values.parte_vehiculo,
        descripcion: values.descripcion,
        
        // Precios
        precio_costo: values.precio_costo || 0,
        precio_venta: values.precio_venta || 0,
        precio_mayoreo: values.precio_mayoreo || 0,
        
        // Ubicación física
        bodega: values.bodega || '0-',
        zona: values.zona || '0-',
        pared: values.pared || '0-',
        malla: values.malla || '0-',
        horizontal: values.horizontal || '0-',
        estante: values.estante || 'E1',
        nivel: values.nivel || '0-',
        piso: values.piso || 'P1-',
        plastica: values.plastica || null,
        carton: values.carton || null,
        posicion: values.posicion || null,
        
        // Estado y condición
        cantidad: values.cantidad || 1,
        estado: values.estado || 'STOCK',
        condicion: values.condicion || '100%-',
        
        // URL de imagen opcional
        imagen_url: values.imagen_url || null
      };

      console.log('Enviando datos:', repuestoData);

      if (tipoRepuesto === 'con_vehiculo') {
        // ✅ REPUESTO CON VEHÍCULO: solo necesita vehiculo_origen_id
        repuestoData.vehiculo_origen_id = values.vehiculo_origen_id;
        
        const response = await fetch('http://localhost:8080/api/inventario-repuestos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(repuestoData)
        });

        if (!response.ok) {
          throw new Error('Error al crear el repuesto');
        }

      } else {
        // ✅ REPUESTO SIN VEHÍCULO: usar stored procedure con datos de generación
        const marcaNombre = marcas.find(m => m.id === marcaSeleccionada)?.nombre || 'Generic';
        
        const procedureData = {
          generacion_id: generacionSeleccionada,
          marca_nombre: marcaNombre,
          parte_vehiculo: values.parte_vehiculo,
          descripcion: values.descripcion || '',
          precio_costo: values.precio_costo || 0,
          precio_venta: values.precio_venta || 0,
          precio_mayoreo: values.precio_mayoreo || 0,
          bodega: values.bodega || '0-',
          zona: values.zona || '0-',
          pared: values.pared || '0-',
          malla: values.malla || '0-',
          estante: values.estante || 'E1',
          piso: values.piso || 'P1-',
          estado: values.estado || 'STOCK',
          condicion: values.condicion || '100%-'
        };

        // Aquí necesitarías un endpoint específico que llame al stored procedure
        // Por ahora, simulo con el endpoint regular pero sin vehiculo_origen_id
        const response = await fetch('http://localhost:8080/api/inventario-repuestos/sin-vehiculo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(procedureData)
        });

        if (!response.ok) {
          throw new Error('Error al crear el repuesto sin vehículo origen');
        }
      }

      message.success('Repuesto guardado correctamente');
      navigate('/inventario');
      
    } catch (error) {
      console.error('Error al guardar el repuesto:', error);
      message.error('Error al guardar el repuesto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Volver
      </Button>
      
      <Title level={2}>
        <ShoppingCartOutlined /> Nuevo Repuesto
      </Title>
      
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            estado: 'STOCK',
            condicion: '100%-',
            precio_costo: 0,
            precio_venta: 0,
            precio_mayoreo: 0,
            cantidad: 1,
            bodega: '0-',
            zona: '0-',
            pared: '0-',
            malla: '0-',
            horizontal: '0-',
            estante: 'E1',
            nivel: '0-',
            piso: 'P1-'
          }}
        >
          {/* Selector del tipo de repuesto */}
          <Form.Item label="Tipo de Repuesto">
            <Radio.Group value={tipoRepuesto} onChange={onTipoRepuestoChange}>
              <Radio.Button value="con_vehiculo">🚗 Repuesto de Vehículo Específico</Radio.Button>
              <Radio.Button value="sin_vehiculo">📦 Repuesto Genérico/Comprado</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Divider orientation="left">Información del Repuesto</Divider>
              
              {/* Parte del vehículo - Campo obligatorio */}
              <Form.Item
                name="parte_vehiculo"
                label="Parte del Vehículo"
                rules={[{ required: true, message: 'Seleccione la parte del vehículo' }]}
              >
                <Select placeholder="Seleccione la parte del vehículo">
                  <Option value="MOTOR">Motor</Option>
                  <Option value="CHASIS">Chasis</Option>
                  <Option value="CARROCERIA">Carrocería</Option>
                  <Option value="COMPUTADORA">Computadora</Option>
                  <Option value="CAJA DE CAMBIO">Caja de Cambio</Option>
                  <Option value="AIRBAGS O BOLSAS DE AIRE">Airbags o Bolsas de Aire</Option>
                  <Option value="EJES Y DIFERENCIA">Ejes y Diferencia</Option>
                  <Option value="SUSPENSION Y AMORTIGUAMIENTO">Suspensión y Amortiguamiento</Option>
                  <Option value="EMBRAGUE">Embrague</Option>
                  <Option value="SISTEMA DE FRENOS">Sistema de Frenos</Option>
                  <Option value="TANQUE DE GASOLINA">Tanque de Gasolina</Option>
                  <Option value="DISTRIBUIDOR">Distribuidor</Option>
                  <Option value="RADIADOR">Radiador</Option>
                  <Option value="VENTILADOR">Ventilador</Option>
                  <Option value="BOMBA DE AGUA">Bomba de Agua</Option>
                  <Option value="BATERIA">Batería</Option>
                  <Option value="AROS Y LLANTAS">Aros y Llantas</Option>
                  <Option value="SISTEMA DE DIRECCION">Sistema de Dirección</Option>
                  <Option value="SISTEMA ELECTRICO">Sistema Eléctrico</Option>
                  <Option value="FUSIBLES">Fusibles</Option>
                  <Option value="ALTERNADOR">Alternador</Option>
                  <Option value="VÁLVULAS DE ESCAPE">Válvulas de Escape</Option>
                  <Option value="TURBO">Turbo</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="descripcion"
                label="Descripción"
                rules={[{ required: true, message: 'Ingrese una descripción' }]}
              >
                <TextArea rows={3} placeholder="Descripción detallada del repuesto" />
              </Form.Item>

              <Form.Item name="imagen_url" label="URL de Imagen (Opcional)">
                <Input placeholder="https://ejemplo.com/imagen.jpg" />
              </Form.Item>

              {/* ✅ CONDICIONAL: Mostrar selección según el tipo */}
              {tipoRepuesto === 'con_vehiculo' ? (
                // OPCIÓN A: Repuesto de vehículo específico - Solo seleccionar vehículo
                <div style={{ backgroundColor: '#f0f8ff', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <h4 style={{ color: '#1890ff', marginBottom: '12px' }}>🚗 Seleccionar Vehículo de Origen</h4>
                  <Form.Item
                    name="vehiculo_origen_id"
                    label="Vehículo Origen (Solo vehículos desarmados)"
                    rules={[{ required: true, message: 'Seleccione el vehículo de origen' }]}
                  >
                    <Select 
                      placeholder="Seleccione el vehículo origen"
                      loading={loadingVehiculos}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {vehiculos.map(vehiculo => (
                        <Option key={vehiculo.id} value={vehiculo.id}>
                          {vehiculo.codigo_vehiculo} - {vehiculo.anio} 
                          {vehiculo.generacion && ` (${vehiculo.generacion.marca} ${vehiculo.generacion.modelo})`}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              ) : (
                // OPCIÓN B: Repuesto genérico - Seleccionar marca → modelo → generación
                <div style={{ backgroundColor: '#f6ffed', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <h4 style={{ color: '#52c41a', marginBottom: '12px' }}>📦 Clasificar Repuesto Genérico</h4>
                  
                  <Form.Item
                    label="Marca"
                    rules={[{ required: true, message: 'Seleccione una marca' }]}
                  >
                    <Select 
                      placeholder="Seleccione una marca"
                      loading={loadingMarcas}
                      value={marcaSeleccionada}
                      onChange={onMarcaChange}
                    >
                      {marcas.map(marca => (
                        <Option key={marca.id} value={marca.id}>{marca.nombre}</Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Modelo"
                    rules={[{ required: true, message: 'Seleccione un modelo' }]}
                  >
                    <Select 
                      placeholder="Seleccione un modelo"
                      loading={loadingModelos}
                      disabled={!marcaSeleccionada}
                      value={modeloSeleccionado}
                      onChange={onModeloChange}
                    >
                      {modelos.map(modelo => (
                        <Option key={modelo.id} value={modelo.id}>{modelo.nombre}</Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="generacion_id"
                    label="Generación"
                    rules={[{ required: true, message: 'Seleccione una generación' }]}
                  >
                    <Select 
                      placeholder="Seleccione una generación"
                      loading={loadingGeneraciones}
                      disabled={!modeloSeleccionado}
                      value={generacionSeleccionada}
                      onChange={onGeneracionChange}
                    >
                      {generaciones.map(generacion => (
                        <Option key={generacion.id} value={generacion.id}>
                          {generacion.nombre} ({generacion.anio_inicio}-{generacion.anio_fin})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              )}
            </Col>
            
            <Col xs={24} md={12}>
              <Divider orientation="left">Precios</Divider>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="precio_costo"
                    label="Precio de Costo"
                    rules={[{ required: true, message: 'Ingrese el precio de costo' }]}
                  >
                    <InputNumber 
                      style={{ width: '100%' }} 
                      min={0} 
                      step={1000} 
                      precision={2}
                      formatter={value => `₡ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/₡\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="precio_venta"
                    label="Precio de Venta"
                    rules={[{ required: true, message: 'Ingrese el precio de venta' }]}
                  >
                    <InputNumber 
                      style={{ width: '100%' }} 
                      min={0} 
                      step={1000} 
                      precision={2}
                      formatter={value => `₡ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/₡\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item name="precio_mayoreo" label="Precio de Mayoreo">
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={0} 
                  step={1000} 
                  precision={2}
                  formatter={value => `₡ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/₡\s?|(,*)/g, '')}
                />
              </Form.Item>

              <Divider orientation="left">Estado y Stock</Divider>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="cantidad" label="Cantidad">
                    <InputNumber style={{ width: '100%' }} min={1} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="estado" label="Estado" rules={[{ required: true }]}>
                    <Select>
                      <Option value="STOCK">En Stock</Option>
                      <Option value="VENDIDO">Vendido</Option>
                      <Option value="PROCESO">En Proceso</Option>
                      <Option value="AGOTADO">Agotado</Option>
                      <Option value="DAÑADO">Dañado</Option>
                      <Option value="USADO_INTERNO">Usado Interno</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="condicion" label="Condición">
                <Select>
                  <Option value="100%-">100% - Excelente</Option>
                  <Option value="50%-">50% - Regular</Option>
                  <Option value="0%-">0% - Malo</Option>
                </Select>
              </Form.Item>

              <Divider orientation="left">Ubicación Física</Divider>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="bodega" label="Bodega">
                    <Select>
                      <Option value="0-">Sin especificar</Option>
                      <Option value="R-">Bodega R</Option>
                      <Option value="D-">Bodega D</Option>
                      <Option value="C-">Bodega C</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="zona" label="Zona">
                    <Select>
                      <Option value="0-">Sin especificar</Option>
                      {Array.from({length: 22}, (_, i) => (
                        <Option key={`Z${i+1}-`} value={`Z${i+1}-`}>Zona {i+1}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="pared" label="Pared">
                    <Select>
                      <Option value="0-">Sin especificar</Option>
                      <Option value="PE-">Pared Este</Option>
                      <Option value="PO-">Pared Oeste</Option>
                      <Option value="PN-">Pared Norte</Option>
                      <Option value="PS-">Pared Sur</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="estante" label="Estante">
                    <Select>
                      {Array.from({length: 14}, (_, i) => (
                        <Option key={`E${i+1}`} value={`E${i+1}`}>Estante {i+1}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="posicion" label="Posición (Opcional)">
                <Input placeholder="Posición específica" />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider />
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />}
              loading={loading}
            >
              Guardar Repuesto
            </Button>
            
            <Button 
              style={{ marginLeft: 8 }}
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default NuevoRepuesto;