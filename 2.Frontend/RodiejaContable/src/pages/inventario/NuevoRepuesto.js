import React, { useState } from 'react';
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
  const { data: modelos = [], isLoading: loadingModelos } = useModelos(
    marcaSeleccionada, 
    tipoRepuesto === 'sin_vehiculo' && !!marcaSeleccionada
  );
  const { data: generaciones = [], isLoading: loadingGeneraciones } = useGeneraciones(
    modeloSeleccionado, 
    tipoRepuesto === 'sin_vehiculo' && !!modeloSeleccionado
  );
  
  // Para repuestos CON vehículo: cargar vehículos solo cuando sea necesario
  const { data: todosVehiculos = [], isLoading: loadingVehiculos } = useVehiculos(
    {},
    tipoRepuesto === 'con_vehiculo'
  );

  // Filtrar solo vehículos DESARMADOS
  const vehiculosDesarmados = React.useMemo(() => {
    if (tipoRepuesto !== 'con_vehiculo') return [];
    return todosVehiculos.filter(v => 
      v.estado && v.estado.toUpperCase() === 'DESARMADO'
    );
  }, [todosVehiculos, tipoRepuesto]);

  // Función para obtener texto completo del vehículo
  const getVehiculoDisplayText = (vehiculo) => {
    const codigo = vehiculo.codigoVehiculo || vehiculo.codigo_vehiculo || 'Sin código';
    const anio = vehiculo.anio || '';
    
    let marca = '';
    let modelo = '';
    let generacion = '';
    
    if (vehiculo.generacion) {
      if (typeof vehiculo.generacion === 'object') {
        marca = vehiculo.generacion.marca || '';
        modelo = vehiculo.generacion.modelo || '';
        generacion = vehiculo.generacion.nombre || '';
      }
    }
    
    const partes = [codigo, anio, marca, modelo, generacion].filter(p => p);
    return partes.join(' ');
  };

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
    
    // Resetear todos los campos relevantes
    setMarcaSeleccionada(null);
    setModeloSeleccionado(null);
    setGeneracionSeleccionada(null);
    
    form.setFieldsValue({
      marca_id: undefined,
      modelo_id: undefined,
      generacion_id: undefined,
      vehiculo_origen_id: undefined
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('Valores del formulario:', values);
      console.log('Tipo de repuesto:', tipoRepuesto);

      if (tipoRepuesto === 'con_vehiculo') {
        // ✅ REPUESTO CON VEHÍCULO ORIGEN
        if (!values.vehiculo_origen_id) {
          throw new Error('Debe seleccionar un vehículo de origen');
        }

        const repuestoData = {
          vehiculoOrigenId: values.vehiculo_origen_id,
          parteVehiculo: values.parte_vehiculo,
          descripcion: values.descripcion,
          precioCosto: values.precio_costo || 0,
          precioVenta: values.precio_venta || 0,
          precioMayoreo: values.precio_mayoreo || 0,
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
          cantidad: values.cantidad || 1,
          estado: values.estado || 'STOCK',
          condicion: values.condicion || '100%-',
          imagenUrl: values.imagen_url || null
        };

        console.log('Datos a enviar (con vehículo):', repuestoData);

        const response = await fetch('http://localhost:8080/api/inventario-repuestos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(repuestoData)
        });

        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);

        if (!response.ok) {
          throw new Error(responseData.message || 'Error al crear el repuesto');
        }

        message.success('Repuesto creado correctamente');
        navigate('/inventario');

      } else {
        // ✅ REPUESTO SIN VEHÍCULO ORIGEN
        if (!generacionSeleccionada) {
          throw new Error('Debe seleccionar una generación para el repuesto genérico');
        }

        const marcaNombre = marcas.find(m => m.id === marcaSeleccionada)?.nombre || 'Generic';
        
        // ✅ CRÍTICO: usar los nombres exactos que el Controller espera
        const procedureData = {
          generacionId: generacionSeleccionada,
          marcaNombre: marcaNombre,
          parteVehiculo: values.parte_vehiculo,
          descripcion: values.descripcion || '',
          precioCosto: parseFloat(values.precio_costo) || 0,
          precioVenta: parseFloat(values.precio_venta) || 0,
          precioMayoreo: parseFloat(values.precio_mayoreo) || 0,
          bodega: values.bodega || '0-',
          zona: values.zona || '0-',
          pared: values.pared || '0-',
          malla: values.malla || '0-',
          estante: values.estante || 'E1',
          piso: values.piso || 'P1-',
          estado: values.estado || 'STOCK',
          condicion: values.condicion || '100%-',
          imagenUrl: values.imagen_url || null
        };

        console.log('Datos a enviar (sin vehículo):', procedureData);

        const response = await fetch('http://localhost:8080/api/inventario-repuestos/sin-vehiculo', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(procedureData)
        });

        console.log('Status de respuesta:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error del servidor:', errorText);
          throw new Error(errorText || 'Error al crear el repuesto sin vehículo origen');
        }

        const responseText = await response.text();
        console.log('Respuesta del servidor:', responseText);

        message.success('Repuesto genérico creado correctamente');
        navigate('/inventario');
      }
      
    } catch (error) {
      console.error('Error completo:', error);
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
              <Radio.Button value="con_vehiculo">Repuesto de Vehículo Específico</Radio.Button>
              <Radio.Button value="sin_vehiculo">Repuesto Genérico/Comprado</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Divider orientation="left">Información del Repuesto</Divider>
              
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

              {/* Selección según el tipo de repuesto */}
              {tipoRepuesto === 'con_vehiculo' ? (
                <div style={{ backgroundColor: '#f0f8ff', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <h4 style={{ color: '#1890ff', marginBottom: '12px' }}>Seleccionar Vehículo de Origen</h4>
                  
                  {loadingVehiculos ? (
                    <p>Cargando vehículos...</p>
                  ) : vehiculosDesarmados.length === 0 ? (
                    <p style={{ color: '#ff4d4f' }}>No hay vehículos desarmados disponibles</p>
                  ) : (
                    <Form.Item
                      name="vehiculo_origen_id"
                      label="Vehículo Origen (Solo vehículos desarmados)"
                      rules={[{ required: true, message: 'Seleccione el vehículo de origen' }]}
                    >
                      <Select 
                        placeholder="Buscar por código, marca, modelo o generación"
                        showSearch
                        filterOption={(input, option) => {
                          const searchText = getVehiculoDisplayText(option.vehiculo);
                          return searchText.toLowerCase().includes(input.toLowerCase());
                        }}
                        optionLabelProp="label"
                      >
                        {vehiculosDesarmados.map(vehiculo => {
                          const codigo = vehiculo.codigoVehiculo || vehiculo.codigo_vehiculo || 'Sin código';
                          const anio = vehiculo.anio || '';
                          let marca = '';
                          let modelo = '';
                          let generacion = '';
                          
                          if (vehiculo.generacion) {
                            if (typeof vehiculo.generacion === 'object') {
                              marca = vehiculo.generacion.marca || '';
                              modelo = vehiculo.generacion.modelo || '';
                              generacion = vehiculo.generacion.nombre || '';
                            }
                          }
                          
                          const label = `${codigo} - ${anio}${marca ? ` ${marca}` : ''}${modelo ? ` ${modelo}` : ''}${generacion ? ` ${generacion}` : ''}`;
                          
                          return (
                            <Option 
                              key={vehiculo.id} 
                              value={vehiculo.id}
                              label={label}
                              vehiculo={vehiculo}
                            >
                              <div>
                                <div style={{ fontWeight: 'bold' }}>{codigo}</div>
                                <div style={{ fontSize: '0.9em', color: '#666' }}>
                                  {anio}{marca ? ` | ${marca}` : ''}{modelo ? ` ${modelo}` : ''}{generacion ? ` (${generacion})` : ''}
                                </div>
                              </div>
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  )}
                </div>
              ) : (
                <div style={{ backgroundColor: '#f6ffed', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <h4 style={{ color: '#52c41a', marginBottom: '12px' }}>Clasificar Repuesto Genérico</h4>
                  
                  <Form.Item
                    name="marca_id"
                    label="Marca"
                    rules={[{ required: true, message: 'Seleccione una marca' }]}
                  >
                    <Select 
                      placeholder="Seleccione una marca"
                      loading={loadingMarcas}
                      onChange={onMarcaChange}
                      value={marcaSeleccionada}
                    >
                      {marcas.map(marca => (
                        <Option key={marca.id} value={marca.id}>{marca.nombre}</Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="modelo_id"
                    label="Modelo"
                    rules={[{ required: true, message: 'Seleccione un modelo' }]}
                  >
                    <Select 
                      placeholder="Seleccione un modelo"
                      loading={loadingModelos}
                      disabled={!marcaSeleccionada}
                      onChange={onModeloChange}
                      value={modeloSeleccionado}
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
                      onChange={onGeneracionChange}
                      value={generacionSeleccionada}
                    >
                      {generaciones.map(generacion => (
                        <Option key={generacion.id} value={generacion.id}>
                          {generacion.nombre} ({generacion.anioInicio || generacion.anio_inicio}-{generacion.anioFin || generacion.anio_fin})
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