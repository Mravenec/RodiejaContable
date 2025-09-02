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
  DatePicker,
  message,
  Row,
  Col,
  Divider
} from 'antd';
import { 
  SaveOutlined, 
  ArrowLeftOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const NuevoRepuesto = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Aquí iría la lógica para guardar el repuesto
      console.log('Valores del formulario:', values);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación de llamada a la API
      message.success('Repuesto guardado correctamente');
      navigate('/inventario');
    } catch (error) {
      console.error('Error al guardar el repuesto:', error);
      message.error('Error al guardar el repuesto');
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
            precio_costo: 0,
            precio_venta: 0,
            precio_mayoreo: 0,
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="parte_vehiculo"
                label="Parte del Vehículo"
                rules={[{ required: true, message: 'Por favor seleccione la parte del vehículo' }]}
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
                </Select>
              </Form.Item>
              
              <Form.Item
                name="descripcion"
                label="Descripción"
                rules={[{ required: true, message: 'Por favor ingrese una descripción' }]}
              >
                <TextArea rows={3} placeholder="Descripción detallada del repuesto" />
              </Form.Item>
              
              <Form.Item
                name="estado"
                label="Estado"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="STOCK">En Stock</Option>
                  <Option value="VENDIDO">Vendido</Option>
                  <Option value="AGOTADO">Agotado</Option>
                  <Option value="DAÑADO">Dañado</Option>
                  <Option value="USADO_INTERNO">Usado Interno</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Divider orientation="left">Información de Precios</Divider>
              
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
                      precision={0}
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
                      precision={0}
                      formatter={value => `₡ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/₡\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="precio_mayoreo"
                label="Precio de Mayoreo"
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={0} 
                  step={1000} 
                  precision={0}
                  formatter={value => `₡ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/₡\s?|(,*)/g, '')}
                />
              </Form.Item>
              
              <Divider />
              
              <Form.Item
                name="fecha_ingreso"
                label="Fecha de Ingreso"
                rules={[{ required: true, message: 'Seleccione la fecha de ingreso' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
              
              <Form.Item
                name="notas"
                label="Notas Adicionales"
              >
                <TextArea rows={3} placeholder="Notas adicionales sobre el repuesto" />
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
