import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Select, 
  InputNumber,
  DatePicker,
  message,
  Row,
  Col,
  Divider,
  Tabs,
  Alert
} from 'antd';
import { 
  SaveOutlined, 
  ArrowLeftOutlined,
  TransactionOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { useCreateTransaccion } from '../../hooks/useFinanzas';
import { useTiposByCategoria, useVehiculosParaTransacciones, useEmpleados, useRepuestos } from '../../hooks';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const NuevaTransaccion = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [tipoTransaccion, setTipoTransaccion] = useState('INGRESO');
  const [monto, setMonto] = useState(0);
  const [comision, setComision] = useState(0);
  
  // Hooks para cargar datos
  const { data: tiposIngreso, isLoading: loadingTiposIngreso } = useTiposByCategoria('INGRESO');
  const { data: tiposEgreso, isLoading: loadingTiposEgreso } = useTiposByCategoria('EGRESO');
  const { data: empleados = [], isLoading: loadingEmpleados } = useEmpleados();
  const { vehiculos = [], loadingVehiculos, errorVehiculos } = useVehiculosParaTransacciones();
  const { data: repuestos = [], isLoading: loadingRepuestos } = useRepuestos({ estado: 'STOCK' });
  
  // Hook para crear transacción
  const { mutate: crearTransaccion, isLoading: isCreating } = useCreateTransaccion({
    onSuccess: () => {
      message.success('Transacción registrada correctamente');
      navigate('/finanzas');
    },
    onError: (error) => {
      console.error('Error al crear transacción:', error);
      message.error(error.message || 'Error al guardar la transacción');
    }
  });

  // Función para calcular comisión
  const calcularComision = useCallback((monto) => {
    // 5% de comisión para transacciones de ingreso
    return tipoTransaccion === 'INGRESO' ? monto * 0.05 : 0;
  }, [tipoTransaccion]);

  // Efecto para actualizar la comisión cuando cambia el monto o el tipo
  useEffect(() => {
    if (monto > 0 && tipoTransaccion === 'INGRESO') {
      setComision(calcularComision(monto));
    } else {
      setComision(0);
    }
  }, [monto, tipoTransaccion, calcularComision]);

  const onFinish = async (values) => {
    try {
      const esEgreso = tipoTransaccion === 'EGRESO';
      const montoValor = parseFloat(monto) || 0;
      
      if (montoValor <= 0) {
        message.error('El monto debe ser mayor a 0');
        return;
      }
      
      // Preparar el payload base
      const payload = {
        fecha: values.fecha.format('YYYY-MM-DD'),
        tipoTransaccionId: values.tipo,
        monto: esEgreso ? -Math.abs(montoValor) : montoValor,
        descripcion: values.descripcion || null,
        referencia: values.referencia || null,
        estado: 'COMPLETADA'
      };
      
      if (esEgreso) {
        // Agregar campos específicos de egresos
        Object.assign(payload, {
          empleadoId: values.empleado_id || null,
          vehiculoId: null,
          repuestoId: null,
          comisionEmpleado: 0,
          proveedor: values.proveedor || null,
          metodoPago: values.metodo_pago || 'EFECTIVO'
        });
      } else {
        // Para ingresos, validar vehículo
        if (!values.vehiculo_id) {
          message.error('Debe seleccionar un vehículo');
          return;
        }
        
        // Agregar campos específicos de ingresos
        Object.assign(payload, {
          empleadoId: values.empleado_id || null,
          vehiculoId: values.vehiculo_id,
          repuestoId: values.repuesto_id || null,
          comisionEmpleado: parseFloat(comision) || 0
        });
      }
      
      crearTransaccion(payload);
    } catch (error) {
      console.error('Error al preparar los datos:', error);
      message.error(error.response?.data?.message || 'Error al procesar los datos del formulario');
    }
  };

  const handleTipoTransaccionChange = (value) => {
    // Actualizar el tipo de transacción (INGRESO/EGRESO) basado en la selección
    const tipoSeleccionado = [...(tiposIngreso || []), ...(tiposEgreso || [])]
      .find(t => t.id === value);
      
    if (tipoSeleccionado) {
      setTipoTransaccion(tipoSeleccionado.categoria);
      
      // Resetear campos específicos cuando cambia entre ingreso/egreso
      if (tipoSeleccionado.categoria === 'INGRESO') {
        form.setFieldsValue({ 
          vehiculo_id: undefined, 
          repuesto_id: undefined,
          proveedor: undefined,
          metodo_pago: undefined
        });
      } else {
        form.setFieldsValue({ 
          vehiculo_id: undefined,
          repuesto_id: undefined,
          comision: 0
        });
      }
    }
  };


  const handleMontoChange = (value) => {
    const montoNumerico = parseFloat(value) || 0;
    setMonto(montoNumerico);
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
        <TransactionOutlined /> Nueva Transacción
      </Title>
      
      <Card>
        <Tabs 
          defaultActiveKey={tipoTransaccion.toLowerCase()}
          onChange={(key) => setTipoTransaccion(key.toUpperCase())}
        >
          <TabPane 
            tab={
              <span>
                <ArrowUpOutlined style={{ color: '#52c41a' }} />
                Ingreso
              </span>
            } 
            key="ingreso"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                fecha: moment(),
                tipo: 1,
                monto: 0,
                comision: 0
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="fecha"
                    label="Fecha"
                    rules={[{ required: true, message: 'Seleccione la fecha' }]}
                  >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                  
                  <Form.Item
                    name="tipo"
                    label="Tipo de Transacción"
                    rules={[{ required: true, message: 'Seleccione el tipo de transacción' }]}
                  >
                    <Select 
                      placeholder={loadingTiposIngreso ? 'Cargando...' : 'Seleccione el tipo'}
                      onChange={handleTipoTransaccionChange}
                      loading={loadingTiposIngreso}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {tiposIngreso?.map(tipo => (
                        <Option key={tipo.id} value={tipo.id}>
                          {tipo.nombre}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="monto"
                    label="Monto"
                    rules={[{ 
                      required: true, 
                      message: 'Ingrese el monto',
                      validator: (_, value) => {
                        if (!value && value !== 0) {
                          return Promise.reject('Por favor ingrese un monto');
                        }
                        if (parseFloat(value) <= 0) {
                          return Promise.reject('El monto debe ser mayor a 0');
                        }
                        return Promise.resolve();
                      }
                    }]}
                  >
                    <InputNumber 
                      style={{ width: '100%' }} 
                      min={0.01}
                      step={0.01} 
                      precision={2}
                      formatter={value => `₡ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/₡\s?|(,*)/g, '')}
                      onChange={handleMontoChange}
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="comision"
                    label={
                      <span>
                        Comisión <Text type="secondary">(5% para ingresos)</Text>
                      </span>
                    }
                  >
                    <InputNumber 
                      style={{ width: '100%' }} 
                      min={0} 
                      step={0.01} 
                      precision={2}
                      formatter={value => `₡ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/₡\s?|(,*)/g, '')}
                      value={comision}
                      disabled
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    name="empleado_id"
                    label={tipoTransaccion === 'EGRESO' ? 'Empleado Responsable (opcional)' : 'Empleado (opcional)'}
                  >
                    <Select 
                      placeholder={loadingEmpleados ? 'Cargando empleados...' : 
                                 empleados.length === 0 ? 'No hay empleados disponibles' : 
                                 'Seleccione un empleado'}
                      loading={loadingEmpleados}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      notFoundContent={<div>No se encontraron empleados</div>}
                      disabled={empleados.length === 0}
                    >
                      {empleados.map(empleado => (
                        <Option key={empleado.id} value={empleado.id}>
                          {empleado.nombres} {empleado.apellidos}
                        </Option>
                      ))}
                    </Select>
                    {empleados.length === 0 && !loadingEmpleados && (
                      <Text type="warning">No hay empleados disponibles. Por favor, agregue empleados primero.</Text>
                    )}
                  </Form.Item>
                  
                  <Form.Item
                    name="vehiculo_id"
                    label="Vehículo"
                    rules={[{ 
                      required: tipoTransaccion === 'INGRESO', 
                      message: 'Para ingresos, debe seleccionar un vehículo' 
                    }]}
                  >
                    <Select 
                      placeholder={
                        loadingVehiculos ? 'Cargando vehículos...' : 
                        errorVehiculos ? 'Error al cargar vehículos' :
                        vehiculos.length === 0 ? 'No hay vehículos disponibles' : 
                        'Seleccione un vehículo'
                      }
                      loading={loadingVehiculos}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      notFoundContent={
                        <div>
                          {errorVehiculos ? 
                            'Error al cargar los vehículos' : 
                            'No se encontraron vehículos disponibles'}
                        </div>
                      }
                      disabled={loadingVehiculos || errorVehiculos || vehiculos.length === 0}
                    >
                      {vehiculos.map(vehiculo => {
                        // Formatear la información del vehículo según la estructura del backend
                        const codigo = vehiculo.codigoVehiculo || 'SIN_CODIGO';
                        const anio = vehiculo.anio || 'Año N/A';
                        const estado = vehiculo.estado || 'SIN_ESTADO';
                        //const placa = codigo; // Usamos el código del vehículo como placa
                        
                        // Crear el texto de visualización
                        const displayText = `Vehículo ${codigo} (${anio}) - ${estado}`;
                        
                        return (
                          <Option 
                            key={vehiculo.id} 
                            value={vehiculo.id}
                            title={displayText}
                          >
                            {displayText}
                          </Option>
                        );
                      })}
                    </Select>
                    {errorVehiculos && (
                      <Alert 
                        message="Error" 
                        description="No se pudieron cargar los vehículos. Por favor, intente nuevamente." 
                        type="error" 
                        showIcon 
                        className="mt-2"
                      />
                    )}
                    {vehiculos.length === 0 && !loadingVehiculos && !errorVehiculos && (
                      <Text type="warning">No hay vehículos disponibles. Por favor, agregue vehículos primero.</Text>
                    )}
                  </Form.Item>
                  
                  <Form.Item
                    name="repuesto_id"
                    label={tipoTransaccion === 'INGRESO' ? 'Repuesto (opcional)' : 'Repuesto'}
                  >
                    <Select 
                      placeholder="Seleccione el repuesto"
                      showSearch
                      optionFilterProp="children"
                      loading={loadingRepuestos}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {repuestos.map(repuesto => (
                        <Option key={repuesto.id} value={repuesto.id}>
                          {repuesto.descripcion} - {repuesto.codigo} {repuesto.ubicacion ? `(${repuesto.ubicacion})` : ''}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="descripcion"
                    label="Descripción"
                  >
                    <TextArea rows={3} placeholder="Descripción de la transacción" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider />
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />}
                  loading={isCreating}
                  disabled={isCreating}
                >
                  {isCreating ? 'Guardando...' : 'Guardar Transacción'}
                </Button>
                
                <Button 
                  style={{ marginLeft: 8 }}
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <ArrowDownOutlined style={{ color: '#f5222d' }} />
                Egreso
              </span>
            } 
            key="egreso"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                fecha: moment(),
                tipo: 5,
                monto: 0
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="fecha"
                    label="Fecha"
                    rules={[{ required: true, message: 'Seleccione la fecha' }]}
                  >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                  
                  <Form.Item
                    name="tipo"
                    label="Tipo de Egreso"
                    rules={[{ required: true, message: 'Seleccione el tipo de egreso' }]}
                  >
                    <Select 
                      placeholder={loadingTiposEgreso ? 'Cargando...' : 'Seleccione el tipo'}
                      onChange={handleTipoTransaccionChange}
                      loading={loadingTiposEgreso}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {tiposEgreso?.map(tipo => (
                        <Option key={tipo.id} value={tipo.id}>
                          {tipo.nombre}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="monto"
                    label="Monto"
                    rules={[{ 
                      required: true, 
                      message: 'Ingrese el monto',
                      validator: (_, value) => {
                        if (!value && value !== 0) {
                          return Promise.reject('Por favor ingrese un monto');
                        }
                        if (parseFloat(value) <= 0) {
                          return Promise.reject('El monto debe ser mayor a 0');
                        }
                        return Promise.resolve();
                      }
                    }]}
                  >
                    <InputNumber 
                      style={{ width: '100%' }} 
                      min={0.01}
                      step={0.01} 
                      precision={2}
                      formatter={value => `₡ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/₡\s?|(,*)/g, '')}
                      onChange={handleMontoChange}
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="proveedor"
                    label="Proveedor"
                  >
                    <Input placeholder="Nombre del proveedor" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    name="metodo_pago"
                    label="Método de Pago"
                  >
                    <Select placeholder="Seleccione el método de pago">
                      <Option value="EFECTIVO">Efectivo</Option>
                      <Option value="TRANSFERENCIA">Transferencia</Option>
                      <Option value="TARJETA_CREDITO">Tarjeta de Crédito</Option>
                      <Option value="TARJETA_DEBITO">Tarjeta de Débito</Option>
                      <Option value="CHEQUE">Cheque</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="referencia"
                    label="Número de Referencia"
                  >
                    <Input placeholder="Número de factura, transferencia, etc." />
                  </Form.Item>
                  
                  <Form.Item
                    name="descripcion"
                    label="Descripción"
                  >
                    <TextArea rows={4} placeholder="Descripción detallada del egreso" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider />
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />}
                  loading={isCreating}
                >
                  Registrar Egreso
                </Button>
                
                <Button 
                  style={{ marginLeft: 8 }}
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default NuevaTransaccion;
