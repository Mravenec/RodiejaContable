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
  Steps,
  Row,
  Col,
  Upload,
  Space
} from 'antd';
import { 
  SaveOutlined, 
  ArrowLeftOutlined, 
  PlusOutlined
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
  const [, setError] = useState(null);
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
  const { isLoading: isLoadingVehiculo } = useVehiculo(id, { 
    enabled: editMode,
    onSuccess: (data) => {
      console.log('Datos del vehículo cargados:', data);
      
      // Establecer los IDs para cargar los datos relacionados
      setMarcaId(data.marcaId);
      setModeloId(data.modeloId);
      
      // Crear objeto con los datos formateados para el formulario
      const datosFormateados = {
        ...data,
        fechaIngreso: data.fechaIngreso ? moment(data.fechaIngreso) : null,
        marcaId: data.marcaId,
        modeloId: data.modeloId,
        generacionId: data.generacionId
      };
      
      console.log('Datos formateados para el formulario:', datosFormateados);
      
      // Establecer los valores del formulario
      form.setFieldsValue(datosFormateados);
      
      // Si hay un error de generación, mostrarlo
      if (errorGeneraciones) {
        console.error('Error al cargar generaciones:', errorGeneraciones);
        message.error('Error al cargar las generaciones. Por favor, intente nuevamente.');
      }
    },
    onError: (error) => {
      console.error('Error al cargar el vehículo:', error);
      message.error('Error al cargar los datos del vehículo: ' + (error.message || 'Error desconocido'));
    }
  });
  
  // Manejar cambios en los valores del formulario
  const handleFormValuesChange = (changedValues, allValues) => {
    console.log('Cambio en el formulario:', { changedValues, allValues });
    
    // Si cambia la marca, limpiar modelo y generación
    if ('marcaId' in changedValues) {
      handleMarcaChange(changedValues.marcaId);
    }
    
    // Si cambia el modelo, limpiar generación
    if ('modeloId' in changedValues) {
      handleModeloChange(changedValues.modeloId);
    }
  };
  
  // Resetear modelos y generaciones cuando cambia la marca
  const handleMarcaChange = (value) => {
    console.log('Marca seleccionada:', value);
    setMarcaId(value);
    setModeloId(null);
    
    // Limpiar los campos de modelo y generación
    form.setFieldsValue({ 
      modeloId: undefined, 
      generacionId: undefined 
    });
    
    // Forzar la validación del formulario
    form.validateFields(['modeloId', 'generacionId']).catch(() => {});
  };
  
  // Resetear generaciones cuando cambia el modelo
  const handleModeloChange = (value) => {
    console.log('Modelo seleccionado:', value, 'Tipo:', typeof value);
    setModeloId(value);
    
    // Limpiar el campo de generación
    form.setFieldsValue({ generacionId: undefined });
    
    // Forzar la validación del campo generación
    form.validateFields(['generacionId']).catch(() => {});
  };
  
  // No necesitamos handleGeneracionChange ya que Ant Design maneja el valor automáticamente
  
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
  
  // Reglas de validación para los campos del formulario
  const formRules = {
    marcaId: [
      { required: true, message: 'Por favor seleccione una marca' }
    ],
    modeloId: [
      { required: true, message: 'Por favor seleccione un modelo' }
    ],
    generacionId: [
      { required: true, message: 'Por favor seleccione una generación' }
    ],
    anio: [
      { required: true, message: 'Por favor ingrese el año' },
      {
        validator: (_, value) => {
          const anio = Number(value);
          if (isNaN(anio) || anio < 1900 || anio > new Date().getFullYear() + 1) {
            return Promise.reject(`El año debe estar entre 1900 y ${new Date().getFullYear() + 1}`);
          }
          return Promise.resolve();
        }
      }
    ]
  };

  const onFinish = async (values) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      console.log('=== DEPURACIÓN DEL FORMULARIO ===');
      console.log('Valores del formulario:', values);
      
      // Validar que se haya seleccionado una generación
      if (!values.generacionId) {
        console.error('Error: No se ha seleccionado ninguna generación');
        message.error('Debe seleccionar una generación');
        setIsSubmitting(false);
        return;
      }
      
      // Validar que se haya ingresado un año
      if (!values.anio) {
        console.error('Error: No se ha especificado el año');
        message.error('El año es requerido');
        setIsSubmitting(false);
        return;
      }
      
      // Validar que el año sea un número válido
      const anio = Number(values.anio);
      if (isNaN(anio) || anio < 1900 || anio > new Date().getFullYear() + 1) {
        message.error('El año debe ser un valor entre 1900 y ' + (new Date().getFullYear() + 1));
        setIsSubmitting(false);
        return;
      }
      
      // Obtener la generación seleccionada
      const generacionId = Number(values.generacionId);
      const generacionSeleccionada = generaciones.find(g => g.id === generacionId);
      
      if (!generacionSeleccionada) {
        console.error('No se encontró la generación con ID:', generacionId);
        console.log('Generaciones disponibles:', generaciones);
        message.error('La generación seleccionada no es válida');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Generación seleccionada:', generacionSeleccionada);
      
      // Preparar los datos para enviar
      const vehiculoData = {
        generacionId: generacionSeleccionada.id,
        modeloId: generacionSeleccionada.modeloId, // Asegurarse de incluir el modeloId
        anio: anio,
        precioCompra: values.precioCompra ? Number(values.precioCompra) : 0,
        costoGrua: values.costoGrua ? Number(values.costoGrua) : 0,
        comisiones: values.comisiones ? Number(values.comisiones) : 0,
        imagenUrl: values.imagenUrl || null,
        fechaIngreso: values.fechaIngreso ? values.fechaIngreso.format('YYYY-MM-DD') : new Date().toISOString().split('T')[0],
        estado: values.estado || 'DISPONIBLE',
        precioVenta: null,
        fechaVenta: null,
        notas: values.notas || null
      };
      
      console.log('Datos a enviar al servidor:', vehiculoData);
      
      // Llamar a la API para crear o actualizar el vehículo
      try {
        if (editMode && id) {
          await updateVehiculo.mutateAsync({ id, ...vehiculoData });
          message.success('Vehículo actualizado exitosamente');
        } else {
          await createVehiculo.mutateAsync(vehiculoData);
          message.success('Vehículo creado exitosamente');
        }
        navigate('/vehiculos');
      } catch (mutationError) {
        console.error('Error en la operación:', mutationError);
        const errorMessage = mutationError.response?.data?.message || 
                           (mutationError.response?.data?.error || 'Error al guardar el vehículo');
        
        // Mostrar errores de validación específicos si existen
        if (mutationError.response?.data?.errors) {
          const validationErrors = Object.entries(mutationError.response.data.errors)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n');
          message.error(validationErrors);
          setError(validationErrors);
        } else {
          message.error(errorMessage);
          setError(errorMessage);
        }
        
        throw mutationError; // Relanzar para que React Query lo maneje
      }
    } catch (error) {
      console.error('Error al procesar el formulario:', error);
      // Mostrar mensaje de error solo si no es un error de validación del backend
      if (!error.response?.data?.errors) {
        const errorMessage = error.message || 'Ocurrió un error inesperado al procesar el formulario';
        message.error(errorMessage);
        setError(errorMessage);
      }
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
                label="Marca"
                name="marcaId"
                rules={formRules.marcaId}
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
                label="Modelo"
                name="modeloId"
                rules={formRules.modeloId}
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
                label="Generación"
                name="generacionId"
                rules={formRules.generacionId}
              >
                <Select 
                  placeholder="Selecciona una generación"
                  loading={isLoadingGeneraciones}
                  disabled={!modeloId}
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) => {
                    if (!option || !option.label) return false;
                    return option.label.toLowerCase().includes(input.toLowerCase());
                  }}
                  popupMatchSelectWidth={false}
                  style={{ width: '100%' }}
                  dropdownStyle={{ minWidth: '600px' }}
                >
                  {generaciones.map((generacion) => {
                    const startYear = generacion.anioInicio || 'N/A';
                    const endYear = generacion.anioFin || 'Actual';
                    const label = `${generacion.nombre} (${startYear}-${endYear})`;
                    
                    return (
                      <Option 
                        key={generacion.id}
                        value={generacion.id}
                        label={label}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 0',
                          gap: '16px'
                        }}>
                          <div style={{ flex: '0 0 150px', fontWeight: '500' }}>
                            {generacion.nombre}
                          </div>
                          <div style={{ flex: '1 1 auto', color: '#666', fontSize: '0.95em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {generacion.descripcion || 'Sin descripción'}
                          </div>
                          <div style={{ flex: '0 0 150px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <span style={{ color: '#666' }}>{startYear}</span>
                            <span style={{ color: '#999' }}>—</span>
                            <span style={{ color: '#666' }}>{endYear}</span>
                          </div>
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="anio"
                label="Año"
                rules={[ 
                  { required: true, message: 'Por favor ingresa el año' },
                  { 
                    type: 'number',
                    min: 1900,
                    max: new Date().getFullYear() + 1,
                    message: `El año debe estar entre 1900 y ${new Date().getFullYear() + 1}`
                  }
                ]}
                normalize={value => value ? Number(value) : null}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={1900}
                  max={new Date().getFullYear() + 1}
                  placeholder="Ej: 2023"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="estado"
                label="Estado del vehículo"
                initialValue="DISPONIBLE"
                rules={[{ required: true, message: 'Por favor selecciona el estado del vehículo' }]}
              >
                <Select 
                  placeholder="Selecciona el estado"
                  style={{ width: '100%' }}
                >
                  <Option value="DISPONIBLE">Disponible</Option>
                  <Option value="EN_REPARACION">En reparación</Option>
                  <Option value="DESARMADO">Desarmado</Option>
                  <Option value="VENDIDO">Vendido</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
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
            </Col>
          </Row>
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
        onValuesChange={handleFormValuesChange}
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
