import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Select, 
  DatePicker, 
  InputNumber, 
  Switch, 
  message, 
  Divider,
  Steps,
  Row,
  Col,
  Upload,
  Space
} from 'antd';
import { 
  SaveOutlined, 
  ArrowLeftOutlined, 
  PlusOutlined, 
  UploadOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { Loading } from '../../components/Loading';

const { Title, Text } = Typography;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

const NuevoVehiculo = ({ editMode = false }) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(editMode);
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState([]);
  
  // Datos de ejemplo para los selects (en una aplicación real vendrían de la API)
  const marcas = ['Toyota', 'Honda', 'Nissan', 'Mazda', 'Volkswagen', 'Chevrolet'];
  const modelos = ['Corolla', 'Civic', 'Sentra', '3', 'Jetta', 'Aveo'];
  const generaciones = [
    { id: 1, nombre: 'Generación 12 (2020-2023)' },
    { id: 2, nombre: 'Generación 11 (2014-2019)' },
    { id: 3, nombre: 'Generación 10 (2008-2013)' },
  ];
  const colores = ['Blanco', 'Negro', 'Plata', 'Gris', 'Rojo', 'Azul', 'Verde'];
  
  // Cargar datos del vehículo si está en modo edición
  useEffect(() => {
    if (editMode && id) {
      // Simular carga de datos desde la API
      const fetchVehiculo = async () => {
        try {
          setLoading(true);
          // Aquí iría la llamada a la API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Datos de ejemplo
          const vehiculo = {
            marca: 'Toyota',
            modelo: 'Corolla',
            generacion: 1,
            anio: 2021,
            precio: 450000,
            costo: 380000,
            descripcion: 'Vehículo en excelentes condiciones, único dueño, sin choques.',
            kilometraje: 25000,
            color: 'Blanco',
            placa: 'ABC-1234',
            vin: 'JT2BG22K6W0149609',
            fechaIngreso: '2023-01-15',
            estado: 'disponible',
            seguro: true,
            factura: true,
            llaves: 2,
            combustible: 'Gasolina',
            transmision: 'Automática',
            puertas: 4,
            pasajeros: 5,
          };
          
          form.setFieldsValue(vehiculo);
          setLoading(false);
        } catch (error) {
          console.error('Error al cargar el vehículo:', error);
          message.error('No se pudo cargar la información del vehículo');
          setLoading(false);
        }
      };
      
      fetchVehiculo();
    }
  }, [editMode, id, form]);
  
  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      // Preparar los datos para enviar a la API
      const vehiculoData = {
        ...values,
        fechaIngreso: values.fechaIngreso ? values.fechaIngreso.format('YYYY-MM-DD') : null,
        // Asegurarse de que los valores numéricos sean números
        anio: Number(values.anio),
        precio: Number(values.precio),
        costo: Number(values.costo),
        kilometraje: Number(values.kilometraje),
        llaves: Number(values.llaves),
        puertas: Number(values.puertas),
        pasajeros: Number(values.pasajeros),
      };

      // Determinar la URL y el método HTTP según si es una edición o creación
      const url = editMode && id 
        ? `http://localhost:3001/api/vehiculos/${id}`
        : 'http://localhost:3001/api/vehiculos';
      
      const method = editMode && id ? 'PUT' : 'POST';

      // Realizar la petición a la API
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Asumiendo que usas autenticación JWT
        },
        body: JSON.stringify(vehiculoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar el vehículo');
      }
      
      const result = await response.json();
      
      message.success(
        editMode 
          ? 'Vehículo actualizado correctamente' 
          : 'Vehículo creado correctamente'
      );
      
      // Redirigir al listado de vehículos
      navigate('/vehiculos');
    } catch (error) {
      console.error('Error al guardar el vehículo:', error);
      message.error(error.message || 'Ocurrió un error al guardar el vehículo');
      setLoading(false);
    }
  };
  
  const handleNext = () => {
    form.validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch((error) => {
        console.log('Validation Failed:', error);
      });
  };
  
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const steps = [
    {
      title: 'Información Básica',
      content: (
        <>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="marca"
                label="Marca"
                rules={[{ required: true, message: 'Por favor selecciona una marca' }]}
              >
                <Select placeholder="Selecciona una marca" showSearch>
                  {marcas.map((marca, index) => (
                    <Option key={index} value={marca}>{marca}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="modelo"
                label="Modelo"
                rules={[{ required: true, message: 'Por favor selecciona un modelo' }]}
              >
                <Select placeholder="Selecciona un modelo" showSearch>
                  {modelos.map((modelo, index) => (
                    <Option key={index} value={modelo}>{modelo}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="generacion"
                label="Generación"
                rules={[{ required: true, message: 'Por favor selecciona una generación' }]}
              >
                <Select placeholder="Selecciona una generación">
                  {generaciones.map((gen) => (
                    <Option key={gen.id} value={gen.id}>{gen.nombre}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="anio"
                label="Año"
                rules={[{ required: true, message: 'Por favor ingresa el año' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={1900} 
                  max={new Date().getFullYear() + 1}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="color"
                label="Color"
                rules={[{ required: true, message: 'Por favor selecciona un color' }]}
              >
                <Select placeholder="Selecciona un color" showSearch>
                  {colores.map((color, index) => (
                    <Option key={index} value={color}>{color}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="kilometraje"
                label="Kilometraje"
                rules={[{ required: true, message: 'Por favor ingresa el kilometraje' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\s?km|(,*)/g, '')}
                  addonAfter="km"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="descripcion"
            label="Descripción"
          >
            <TextArea rows={4} placeholder="Describe el estado y características del vehículo" />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Información Técnica',
      content: (
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              name="combustible"
              label="Combustible"
              rules={[{ required: true, message: 'Por favor selecciona el tipo de combustible' }]}
            >
              <Select placeholder="Tipo de combustible">
                <Option value="gasolina">Gasolina</Option>
                <Option value="diesel">Diésel</Option>
                <Option value="hibrido">Híbrido</Option>
                <Option value="electrico">Eléctrico</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="transmision"
              label="Transmisión"
              rules={[{ required: true, message: 'Por favor selecciona el tipo de transmisión' }]}
            >
              <Select placeholder="Tipo de transmisión">
                <Option value="automatica">Automática</Option>
                <Option value="mecanica">Mecánica</Option>
                <Option value="semiautomatica">Semiautomática</Option>
                <Option value="cvt">CVT</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="puertas"
              label="Número de puertas"
              rules={[{ required: true, message: 'Por favor ingresa el número de puertas' }]}
            >
              <Select placeholder="Número de puertas">
                <Option value={2}>2 Puertas</Option>
                <Option value={3}>3 Puertas</Option>
                <Option value={4}>4 Puertas</Option>
                <Option value={5}>5 Puertas</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="pasajeros"
              label="Número de pasajeros"
              rules={[{ required: true, message: 'Por favor ingresa el número de pasajeros' }]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={1} 
                max={12} 
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="llantas"
              label="Estado de llantas"
            >
              <Select placeholder="Estado de las llantas">
                <Option value="nuevas">Nuevas</Option>
                <Option value="bueno">Buen estado</Option>
                <Option value="regular">Estado regular</Option>
                <Option value="malo">Necesitan cambio</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="llaves"
              label="Número de llaves"
              rules={[{ required: true, message: 'Por favor ingresa el número de llaves' }]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={0} 
                max={4} 
              />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Información Financiera',
      content: (
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="costo"
              label="Costo de adquisición"
              rules={[{ required: true, message: 'Por favor ingresa el costo' }]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={0}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="precio"
              label="Precio de venta"
              rules={[{ required: true, message: 'Por favor ingresa el precio de venta' }]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={0}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="fechaIngreso"
              label="Fecha de ingreso"
              rules={[{ required: true, message: 'Por favor selecciona la fecha de ingreso' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="estado"
              label="Estado del vehículo"
              rules={[{ required: true, message: 'Por favor selecciona el estado' }]}
            >
              <Select placeholder="Estado del vehículo">
                <Option value="disponible">Disponible</Option>
                <Option value="en_revision">En revisión</Option>
                <Option value="en_reparacion">En reparación</Option>
                <Option value="reservado">Reservado</Option>
                <Option value="vendido">Vendido</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="seguro"
              label="Seguro"
              valuePropName="checked"
            >
              <Switch checkedChildren="Con seguro" unCheckedChildren="Sin seguro" />
            </Form.Item>
            
            <Form.Item
              name="factura"
              label="Factura"
              valuePropName="checked"
            >
              <Switch checkedChildren="Con factura" unCheckedChildren="Sin factura" />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Documentos e Imágenes',
      content: (
        <div>
          <Form.Item
            name="imagenes"
            label="Imágenes del vehículo"
            rules={[{ required: !editMode, message: 'Por favor sube al menos una imagen del vehículo' }]}
          >
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              multiple
            >
              {fileList.length >= 8 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Subir</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          
          <Divider orientation="left">Documentos</Divider>
          
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="documentos"
                label="Documentos del vehículo"
              >
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  fileList={[]}
                >
                  <Button icon={<UploadOutlined />}>Subir documentos</Button>
                </Upload>
                <Text type="secondary">Factura, tarjeta de circulación, etc.</Text>
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
  ];
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/vehiculos')}
          style={{ marginBottom: 16 }}
        >
          Volver al listado
        </Button>
        
        <Title level={3}>
          {editMode ? 'Editar Vehículo' : 'Nuevo Vehículo'}
        </Title>
      </div>
      
      <Card>
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <div style={{ minHeight: '300px' }}>
            {steps[currentStep].content}
          </div>
          
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
            <div>
              {currentStep > 0 && (
                <Button style={{ marginRight: 8 }} onClick={handlePrev}>
                  Anterior
                </Button>
              )}
            </div>
            <div>
              {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={handleNext}>
                  Siguiente
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />}
                  loading={loading}
                >
                  {editMode ? 'Actualizar Vehículo' : 'Guardar Vehículo'}
                </Button>
              )}
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default NuevoVehiculo;
