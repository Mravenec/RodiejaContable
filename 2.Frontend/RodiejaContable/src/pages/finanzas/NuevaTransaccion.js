import React, { useState, useEffect } from 'react';
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
  Switch,
  Tabs
} from 'antd';
import { 
  SaveOutlined, 
  ArrowLeftOutlined,
  TransactionOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const NuevaTransaccion = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tipoTransaccion, setTipoTransaccion] = useState('INGRESO');
  const [monto, setMonto] = useState(0);
  const [comision, setComision] = useState(0);

  const tiposTransacciones = [
    { id: 1, nombre: 'Venta de Vehículo', categoria: 'INGRESO' },
    { id: 2, nombre: 'Venta de Repuesto', categoria: 'INGRESO' },
    { id: 3, nombre: 'Servicio', categoria: 'INGRESO' },
    { id: 4, nombre: 'Otro Ingreso', categoria: 'INGRESO' },
    { id: 5, nombre: 'Compra de Vehículo', categoria: 'EGRESO' },
    { id: 6, nombre: 'Compra de Repuesto', categoria: 'EGRESO' },
    { id: 7, nombre: 'Mantenimiento', categoria: 'EGRESO' },
    { id: 8, nombre: 'Nómina', categoria: 'EGRESO' },
    { id: 9, nombre: 'Servicios Públicos', categoria: 'EGRESO' },
    { id: 10, nombre: 'Otro Egreso', categoria: 'EGRESO' },
  ];

  const empleados = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'María García' },
    { id: 3, nombre: 'Carlos López' },
  ];

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Aquí iría la lógica para guardar la transacción
      console.log('Valores del formulario:', values);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación de llamada a la API
      message.success('Transacción registrada correctamente');
      navigate('/finanzas');
    } catch (error) {
      console.error('Error al guardar la transacción:', error);
      message.error('Error al guardar la transacción');
    } finally {
      setLoading(false);
    }
  };

  const handleTipoTransaccionChange = (value) => {
    const tipo = tiposTransacciones.find(t => t.id === value);
    if (tipo) {
      setTipoTransaccion(tipo.categoria);
    }
  };

  const calcularComision = (monto) => {
    // Ejemplo: 5% de comisión para ventas
    if (tipoTransaccion === 'INGRESO') {
      return monto * 0.05; // 5% de comisión
    }
    return 0;
  };

  const handleMontoChange = (value) => {
    setMonto(value || 0);
    setComision(calcularComision(value || 0));
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
                      placeholder="Seleccione el tipo"
                      onChange={handleTipoTransaccionChange}
                    >
                      {tiposTransacciones
                        .filter(t => t.categoria === 'INGRESO')
                        .map(tipo => (
                          <Option key={tipo.id} value={tipo.id}>
                            {tipo.nombre}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="monto"
                    label="Monto"
                    rules={[{ required: true, message: 'Ingrese el monto' }]}
                  >
                    <InputNumber 
                      style={{ width: '100%' }} 
                      min={0} 
                      step={0.01} 
                      precision={2}
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      onChange={handleMontoChange}
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="comision"
                    label="Comisión"
                  >
                    <InputNumber 
                      style={{ width: '100%' }} 
                      min={0} 
                      step={0.01} 
                      precision={2}
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      value={comision}
                      disabled
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    name="empleado_id"
                    label="Empleado"
                  >
                    <Select placeholder="Seleccione el empleado (opcional)">
                      {empleados.map(empleado => (
                        <Option key={empleado.id} value={empleado.id}>
                          {empleado.nombre}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="vehiculo_id"
                    label="Vehículo (opcional)"
                  >
                    <Select 
                      placeholder="Seleccione el vehículo"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value={1}>Toyota Corolla 2020 - ABC123</Option>
                      <Option value={2}>Honda Civic 2019 - XYZ789</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="repuesto_id"
                    label="Repuesto (opcional)"
                  >
                    <Select 
                      placeholder="Seleccione el repuesto"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value={1}>Frenos delanteros - Toyota Corolla</Option>
                      <Option value={2}>Batería - Honda Civic</Option>
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
                  loading={loading}
                >
                  Guardar Transacción
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
                      placeholder="Seleccione el tipo"
                      onChange={handleTipoTransaccionChange}
                    >
                      {tiposTransacciones
                        .filter(t => t.categoria === 'EGRESO')
                        .map(tipo => (
                          <Option key={tipo.id} value={tipo.id}>
                            {tipo.nombre}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="monto"
                    label="Monto"
                    rules={[{ required: true, message: 'Ingrese el monto' }]}
                  >
                    <InputNumber 
                      style={{ width: '100%' }} 
                      min={0} 
                      step={0.01} 
                      precision={2}
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
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
                  loading={loading}
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
