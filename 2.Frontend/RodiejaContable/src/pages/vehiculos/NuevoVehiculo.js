import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Select, 
  DatePicker, 
  InputNumber, 
  message, 
  Divider,
  Steps,
  Row,
  Col,
  Upload,
  Spin,
  Alert,
  Space
} from 'antd';
import { 
  SaveOutlined, 
  ArrowLeftOutlined, 
  PlusOutlined, 
  UploadOutlined
} from '@ant-design/icons';
import { Loading } from '../../components/Loading';
import { useMarcas } from '../../hooks/useMarcas';
import { useModelos } from '../../hooks/useModelos';
import { useGeneraciones } from '../../hooks/useGeneraciones';
import { useCreateVehiculo, useUpdateVehiculo, useVehiculo } from '../../hooks/useVehiculos';

const { Title, Text } = Typography;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

const NuevoVehiculo = ({ editMode = false }) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para manejar la selección en cascada
  const [marcaId, setMarcaId] = useState(null);
  const [modeloId, setModeloId] = useState(null);
  
  // Hooks para cargar datos
  const { 
    data: marcas = [], 
    isLoading: isLoadingMarcas,
    error: errorMarcas 
  } = useMarcas();
  
  const { 
    data: modelos = [], 
    isLoading: isLoadingModelos,
    error: errorModelos
  } = useModelos(marcaId);
  
  const { 
    data: generaciones = [], 
    isLoading: isLoadingGeneraciones,
    error: errorGeneraciones 
  } = useGeneraciones(modeloId);
  
  // Mostrar errores si los hay
  useEffect(() => {
    if (errorMarcas) {
      message.error('Error al cargar las marcas: ' + (errorMarcas.message || 'Error desconocido'));
    }
    if (errorModelos) {
      message.error('Error al cargar los modelos: ' + (errorModelos.message || 'Error desconocido'));
    }
    if (errorGeneraciones) {
      message.error('Error al cargar las generaciones: ' + (errorGeneraciones.message || 'Error desconocido'));
    }
  }, [errorMarcas, errorModelos, errorGeneraciones]);
  
  // Cargar datos del vehículo si está en modo edición
  const { data: vehiculo, isLoading: isLoadingVehiculo } = useVehiculo(id, { 
    enabled: editMode,
    onSuccess: (data) => {
      if (data) {
        // Si hay un vehículo, establecer los IDs para cargar los datos relacionados
        setMarcaId(data.marcaId);
        setModeloId(data.modeloId);
        
        const datosFormateados = {
          ...data,
          fechaIngreso: data.fechaIngreso ? moment(data.fechaIngreso) : null,
          marcaId: data.marcaId,
          modeloId: data.modeloId
        };
        form.setFieldsValue(datosFormateados);
      }
    },
    onError: (error) => {
      message.error('Error al cargar los datos del vehículo: ' + (error.message || 'Error desconocido'));
    }
  });
  
  // Resetear modelos y generaciones cuando cambia la marca
  const handleMarcaChange = (value) => {
    setMarcaId(value);
    setModeloId(null);
    form.setFieldsValue({ 
      modeloId: undefined, 
      generacionId: undefined 
    });
  };
  
  // Resetear generaciones cuando cambia el modelo
  const handleModeloChange = (value) => {
    setModeloId(value);
    form.setFieldsValue({ generacionId: undefined });
  };
  
  const createVehiculo = useCreateVehiculo({
    onSuccess: () => {
      message.success('Vehículo creado exitosamente');
      navigate('/vehiculos');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Error al crear el vehículo';
      message.error(errorMessage);
      setError(errorMessage);
    }
  });
  
  const updateVehiculo = useUpdateVehiculo({
    onSuccess: () => {
      message.success('Vehículo actualizado exitosamente');
      navigate('/vehiculos');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Error al actualizar el vehículo';
      message.error(errorMessage);
      setError(errorMessage);
    }
  });
  
  const onFinish = async (values) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const vehiculoData = {
        marcaId: Number(values.marcaId),
        modeloId: Number(values.modeloId),
        generacionId: Number(values.generacionId),
        anio: Number(values.anio),
        precioCompra: Number(values.precioCompra),
        costoGrua: Number(values.costoGrua) || 0,
        comisiones: Number(values.comisiones) || 0,
        imagenUrl: values.imagenUrl || null,
        fechaIngreso: values.fechaIngreso ? values.fechaIngreso.format('YYYY-MM-DD') : null,
        estado: 'DISPONIBLE',
        notas: values.notas || null
      };

      if (editMode && id) {
        await updateVehiculo.mutateAsync({ id, ...vehiculoData });
      } else {
        await createVehiculo.mutateAsync(vehiculoData);
      }
    } catch (error) {
      console.error('Error al procesar el formulario:', error);
      const errorMessage = error.response?.data?.message || 'Ocurrió un error al procesar el formulario';
      message.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
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
            <Col xs={24} md={8}>
              <Form.Item
                name="marcaId"
                label="Marca"
                rules={[{ required: true, message: 'Por favor selecciona una marca' }]}
              >
                <Select 
                  placeholder="Selecciona una marca"
                  loading={isLoadingMarcas}
                  onChange={handleMarcaChange}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {marcas.map((marca) => (
                    <Option key={marca.id} value={marca.id}>
                      {marca.nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="modeloId"
                label="Modelo"
                rules={[{ required: true, message: 'Por favor selecciona un modelo' }]}
              >
                <Select 
                  placeholder="Selecciona un modelo"
                  loading={isLoadingModelos}
                  onChange={handleModeloChange}
                  disabled={!marcaId}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {modelos.map((modelo) => (
                    <Option key={modelo.id} value={modelo.id}>
                      {modelo.nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="generacionId"
                label="Generación"
                rules={[{ required: true, message: 'Por favor selecciona una generación' }]}
              >
                <Select 
                  placeholder="Selecciona una generación"
                  loading={isLoadingGeneraciones}
                  disabled={!modeloId}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {generaciones.map((generacion) => (
                    <Option key={generacion.id} value={generacion.id}>
                      {generacion.nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="anio"
                label="Año"
                rules={[{ 
                  required: true, 
                  message: 'Por favor ingresa el año',
                  type: 'number',
                  min: 1900,
                  max: new Date().getFullYear() + 1
                }]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={1900}
                  max={new Date().getFullYear() + 1}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="notas"
            label="Notas"
          >
            <TextArea 
              rows={4} 
              placeholder="Ingresa notas adicionales sobre el vehículo" 
              maxLength={500}
              showCount
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Información Financiera',
      content: (
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="precioCompra"
              label="Precio de compra"
              rules={[{ 
                required: true, 
                message: 'Por favor ingresa el precio de compra',
                type: 'number',
                min: 0
              }]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={0}
                step={1000}
                formatter={value => `₡ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/[₡\s]|(,*)/g, '')}
                precision={2}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="costoGrua"
              label="Costo de grúa"
              rules={[{ 
                required: false, 
                type: 'number',
                min: 0
              }]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={0}
                step={100}
                formatter={value => `₡ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/[₡\s]|(,*)/g, '')}
                precision={2}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="comisiones"
              label="Comisiones"
              rules={[{ 
                required: false, 
                type: 'number',
                min: 0
              }]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={0}
                step={100}
                formatter={value => `₡ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/[₡\s]|(,*)/g, '')}
                precision={2}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="fechaIngreso"
              label="Fecha de ingreso"
              rules={[{ 
                required: true, 
                message: 'Por favor selecciona la fecha de ingreso' 
              }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="DD/MM/YYYY"
                disabledDate={(current) => {
                  return current && current > moment().endOf('day');
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: 'Imágenes',
      content: (
        <div>
          <Form.Item
            name="imagenUrl"
            label="URL de la imagen principal"
            rules={[{ 
              required: false,
              type: 'url',
              message: 'Por favor ingresa una URL válida'
            }]}
          >
            <Input 
              placeholder="https://ejemplo.com/imagen.jpg" 
              allowClear
            />
          </Form.Item>
          
          <Form.Item
            name="imagenesAdicionales"
            label="Imágenes adicionales"
          >
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              multiple
              accept="image/*"
            >
              {fileList.length >= 5 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Subir</div>
                </div>
              )}
            </Upload>
            <Text type="secondary">Máximo 5 imágenes adicionales</Text>
          </Form.Item>
        </div>
      ),
    },
  ];
  
  // Mostrar loading solo cuando sea necesario
  const isLoading = isLoadingMarcas || (editMode && isLoadingVehiculo);
  
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Card 
      title={
        <Title level={4} style={{ margin: 0 }}>
          {editMode ? 'Editar Vehículo' : 'Nuevo Vehículo'}
        </Title>
      }
      extra={
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/vehiculos')}
          disabled={isSubmitting}
        >
          Volver al listado
        </Button>
      }
    >
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
          <Form.Item>
            <Space>
              {currentStep > 0 && (
                <Button onClick={handlePrev} disabled={isSubmitting}>
                  Anterior
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button 
                  type="primary" 
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  Siguiente
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button 
                  type="primary" 
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={isSubmitting}
                >
                  {editMode ? 'Actualizar' : 'Guardar'}
                </Button>
              )}
            </Space>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
};

export default NuevoVehiculo;
