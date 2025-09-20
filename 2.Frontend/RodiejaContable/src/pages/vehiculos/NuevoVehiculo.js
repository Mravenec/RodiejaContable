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
  Alert
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
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para manejar la selección en cascada
  const [marcaId, setMarcaId] = useState(null);
  const [modeloId, setModeloId] = useState(null);
  const [selectedGeneracionId, setSelectedGeneracionId] = useState(null);
  
  // Estados para manejar valores del formulario manualmente
  const [anioValue, setAnioValue] = useState(new Date().getFullYear());
  
  // Estado para los años disponibles
  const [aniosDisponibles, setAniosDisponibles] = useState([]);
  const [estadoValue, setEstadoValue] = useState('DISPONIBLE');
  const [notasValue, setNotasValue] = useState('');
  const [precioCompraValue, setPrecioCompraValue] = useState(null);
  
  // DEBUG: Estado para mostrar información
  const [debugInfo, setDebugInfo] = useState('');
  
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
  
  // Efecto para actualizar los años disponibles cuando cambia la generación seleccionada
  useEffect(() => {
    if (!selectedGeneracionId || !generaciones || generaciones.length === 0) {
      setAniosDisponibles([]);
      return;
    }
    
    // Buscar la generación seleccionada
    const generacionSeleccionada = generaciones.find(g => g.id === selectedGeneracionId);
    if (!generacionSeleccionada) {
      setAniosDisponibles([]);
      return;
    }
    
    const anioInicio = generacionSeleccionada.anioInicio || new Date().getFullYear();
    const anioFin = generacionSeleccionada.anioFin || new Date().getFullYear();
    
    const anios = [];
    for (let i = anioInicio; i <= anioFin; i++) {
      anios.push(i);
    }
    
    setAniosDisponibles(anios.sort((a, b) => b - a)); // Orden descendente
  }, [selectedGeneracionId, generaciones]);
  
  // DEBUG: Efecto para mostrar información de estado
  useEffect(() => {
    const formValues = form.getFieldsValue();
    const info = `
      📊 Estado del formulario:
      - MarcaId: ${marcaId}
      - ModeloId: ${modeloId}
      - SelectedGeneracionId: ${selectedGeneracionId}
      - Generaciones disponibles: ${generaciones.length}
      - Cargando generaciones: ${isLoadingGeneraciones}
      - Error generaciones: ${errorGeneraciones ? 'SÍ' : 'NO'}
      - Año en formulario: ${formValues.anio} (${typeof formValues.anio})
      - Año en estado: ${anioValue} (${typeof anioValue})
      - Precio en formulario: ${formValues.precioCompra} (${typeof formValues.precioCompra})
      - Precio en estado: ${precioCompraValue} (${typeof precioCompraValue})
      - Estado en formulario: ${formValues.estado}
      - Estado en estado: ${estadoValue}
      - Fecha en formulario: ${formValues.fechaIngreso ? 'SÍ' : 'NO'}
      - Notas en estado: ${notasValue ? 'SÍ' : 'NO'}
    `;
    setDebugInfo(info);
  }, [marcaId, modeloId, selectedGeneracionId, generaciones, isLoadingGeneraciones, errorGeneraciones, form, anioValue, estadoValue, notasValue, precioCompraValue]);
  
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
      console.log('✅ Datos del vehículo cargados:', data);
      
      // Establecer los IDs para cargar los datos relacionados
      setMarcaId(data.marcaId);
      setModeloId(data.modeloId);
      setSelectedGeneracionId(data.generacionId);
      
      // Crear objeto con los datos formateados para el formulario
      const datosFormateados = {
        ...data,
        fechaIngreso: data.fechaIngreso ? moment(data.fechaIngreso) : moment(),
        marcaId: data.marcaId,
        modeloId: data.modeloId,
        generacionId: data.generacionId
      };
      
      console.log('📋 Datos formateados para el formulario:', datosFormateados);
      
      // Establecer los valores del formulario después de un delay
      setTimeout(() => {
        form.setFieldsValue(datosFormateados);
        console.log('✏️ Valores establecidos en el formulario');
      }, 1000);
    },
    onError: (error) => {
      console.error('❌ Error al cargar el vehículo:', error);
      message.error('Error al cargar los datos del vehículo: ' + (error.message || 'Error desconocido'));
    }
  });
  
  // Efecto para establecer valores iniciales en modo creación
  useEffect(() => {
    if (!editMode) {
      const defaultValues = {
        estado: 'DISPONIBLE',
        fechaIngreso: moment(),
        anio: new Date().getFullYear()
      };
      
      setEstadoValue('DISPONIBLE');
      setAnioValue(new Date().getFullYear());
      
      form.setFieldsValue(defaultValues);
      console.log('🆕 Valores iniciales establecidos para nuevo vehículo');
    }
  }, [form, editMode]);
  
  // Manejar cambios en los valores del formulario
  const handleFormValuesChange = (changedValues, allValues) => {
    console.log('🔄 Cambio en el formulario:', { changedValues, allValues });
    
    // Si cambia la marca, limpiar modelo y generación
    if ('marcaId' in changedValues) {
      handleMarcaChange(changedValues.marcaId);
    }
    
    // Si cambia el modelo, limpiar generación
    if ('modeloId' in changedValues) {
      handleModeloChange(changedValues.modeloId);
    }
    
    // Si cambia la generación, actualizarla
    if ('generacionId' in changedValues) {
      console.log('🎯 Generación seleccionada:', changedValues.generacionId);
      setSelectedGeneracionId(changedValues.generacionId);
    }
  };
  
  // Resetear modelos y generaciones cuando cambia la marca
  const handleMarcaChange = (value) => {
    console.log('🏷️ Marca seleccionada:', value);
    setMarcaId(value);
    setModeloId(null);
    setSelectedGeneracionId(null);
    
    // Limpiar los campos de modelo y generación
    form.setFieldsValue({ 
      modeloId: undefined, 
      generacionId: undefined 
    });
    
    console.log('🧹 Campos limpiados por cambio de marca');
  };
  
  // Resetear generaciones cuando cambia el modelo
  const handleModeloChange = (value) => {
    console.log('🚗 Modelo seleccionado:', value);
    setModeloId(value);
    setSelectedGeneracionId(null);
    
    // Limpiar el campo de generación
    form.setFieldsValue({ generacionId: undefined });
    
    console.log('🧹 Campo generación limpiado por cambio de modelo');
  };
  
  const createVehiculo = useCreateVehiculo({
    onSuccess: () => {
      message.success('Vehículo guardado exitosamente');
      // Usar window.location para asegurar la recarga completa de la página
      window.location.href = '/vehiculos';
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Error al guardar el vehículo';
      console.error('❌ Error al guardar:', error);
      message.error(errorMessage);
      setError(errorMessage);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });
  
  const updateVehiculo = useUpdateVehiculo({
    onSuccess: () => {
      message.success('Vehículo actualizado exitosamente');
      // Usar window.location para asegurar la recarga completa de la página
      window.location.href = '/vehiculos';
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Error al actualizar el vehículo';
      console.error('❌ Error al actualizar:', error);
      message.error(errorMessage);
      setError(errorMessage);
    },
    onSettled: () => {
      setIsSubmitting(false);
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
    precioCompra: [
      { required: true, message: 'Por favor ingrese el precio de compra' }
    ],
    fechaIngreso: [
      { required: true, message: 'Por favor seleccione la fecha de ingreso' }
    ]
  };

  const onFinish = async (values) => {
    console.log('🚀 === INICIANDO ENVÍO DEL FORMULARIO ===');
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Usar valores del estado como respaldo para los campos del formulario
      const formData = {
        ...values,
        anio: values.anio ? parseInt(values.anio) : parseInt(anioValue || new Date().getFullYear()),
        estado: values.estado || estadoValue || 'DISPONIBLE',
        notas: values.notas || notasValue || null,
        precioCompra: values.precioCompra ? parseFloat(values.precioCompra) : parseFloat(precioCompraValue || 0),
        generacionId: values.generacionId ? parseInt(values.generacionId) : parseInt(selectedGeneracionId || 0),
        marcaId: values.marcaId ? parseInt(values.marcaId) : parseInt(marcaId || 0),
        modeloId: values.modeloId ? parseInt(values.modeloId) : parseInt(modeloId || 0),
        // Asegurar que los campos numéricos tengan el tipo correcto
        costoGrua: values.costoGrua ? parseFloat(values.costoGrua) : 0,
        comisiones: values.comisiones ? parseFloat(values.comisiones) : 0,
        // Formatear la fecha correctamente
        fechaIngreso: values.fechaIngreso ? values.fechaIngreso.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
      };
      
      console.log('📝 Datos del formulario (combinados con estado):', formData);
      
      // Validar que se haya seleccionado una generación
      if (!formData.generacionId || isNaN(formData.generacionId) || formData.generacionId <= 0) {
        const errorMsg = 'Debe seleccionar una generación válida';
        console.error('❌', errorMsg);
        message.error(errorMsg);
        setIsSubmitting(false);
        return;
      }
      
      // Validar año
      if (!formData.anio || isNaN(formData.anio) || formData.anio < 1900 || formData.anio > new Date().getFullYear() + 1) {
        const errorMsg = `El año debe estar entre 1900 y ${new Date().getFullYear() + 1}`;
        console.error('❌', errorMsg);
        message.error(errorMsg);
        setIsSubmitting(false);
        return;
      }
      
      // Validar precio de compra
      if (formData.precioCompra === undefined || formData.precioCompra === null || isNaN(formData.precioCompra) || formData.precioCompra <= 0) {
        const errorMsg = 'El precio de compra es requerido y debe ser mayor a 0';
        console.error('❌', errorMsg);
        message.error(errorMsg);
        setIsSubmitting(false);
        return;
      }
      
      // Buscar la generación seleccionada para verificar que existe
      const generacionSeleccionada = generaciones.find(g => g.id === formData.generacionId);
      
      if (!generacionSeleccionada) {
        const errorMsg = 'La generación seleccionada no es válida';
        console.error('❌', errorMsg, 'ID:', formData.generacionId);
        console.error('🏗️ Generaciones disponibles:', generaciones.map(g => ({ id: g.id, nombre: g.nombre })));
        message.error(errorMsg);
        setIsSubmitting(false);
        return;
      }
      
      console.log('✅ Generación encontrada:', generacionSeleccionada);
      
      // Preparar los datos para enviar al backend
      const vehiculoData = {
        generacionId: formData.generacionId,
        anio: formData.anio,
        precioCompra: formData.precioCompra,
        costoGrua: formData.costoGrua,
        comisiones: formData.comisiones,
        imagenUrl: formData.imagenUrl || null,
        fechaIngreso: formData.fechaIngreso,
        estado: formData.estado,
        notas: formData.notas
      };
    
      console.log('📤 Datos finales a enviar:', vehiculoData);
      
      // Validar estructura antes de enviar
      const requiredFields = ['generacionId', 'anio', 'precioCompra', 'fechaIngreso', 'estado'];
      const missingFields = requiredFields.filter(field => 
        vehiculoData[field] === null || vehiculoData[field] === undefined
      );
      
      if (missingFields.length > 0) {
        const errorMsg = `Faltan campos requeridos: ${missingFields.join(', ')}`;
        console.error('❌', errorMsg);
        message.error(errorMsg);
        setIsSubmitting(false);
        return;
      }
      
      console.log('✅ Todos los campos requeridos están presentes');
      
      // Llamar a la API para crear o actualizar el vehículo
      if (editMode && id) {
        console.log('🔄 Actualizando vehículo existente...');
        await updateVehiculo.mutateAsync({ id, ...vehiculoData });
      } else {
        console.log('🆕 Creando nuevo vehículo...');
        console.log('📤 Datos que se enviarán:', vehiculoData);
        await createVehiculo.mutateAsync(vehiculoData);
      }
    } catch (error) {
      console.error('❌ Error al procesar el formulario:', error);
      
      // Manejo detallado de errores
      let errorMessage = 'Error al procesar el formulario';
      
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        if (error.response.data) {
          if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          } else if (error.response.status === 400) {
            errorMessage = 'Datos inválidos. Por favor verifique la información ingresada.';
          } else if (error.response.status === 401 || error.response.status === 403) {
            errorMessage = 'No tiene permisos para realizar esta acción';
          } else if (error.response.status === 404) {
            errorMessage = 'Recurso no encontrado';
          } else if (error.response.status >= 500) {
            errorMessage = 'Error en el servidor. Por favor intente más tarde.';
          }
        }
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        errorMessage = 'No se recibió respuesta del servidor. Verifique su conexión a internet.';
      } else if (error.message) {
        // Algo sucedió en la configuración de la solicitud
        errorMessage = error.message;
      }
      
      console.error('📌 Detalles del error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        request: error.request
      });
      
      message.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleNext = async () => {
    try {
      console.log('🔄 Iniciando proceso de siguiente paso...');
      
      // PASO 1: Obtener valores actuales del formulario
      const currentValues = form.getFieldsValue();
      console.log('📋 Valores actuales en formulario:', currentValues);
      
      // PASO 2: Forzar que se mantengan los valores en el formulario
      if (currentStep === 0) {
        console.log('💾 Guardando valores del paso 1...');
        
        // Usar valores de estado como respaldo
        const paso1Values = {
          marcaId: currentValues.marcaId || marcaId,
          modeloId: currentValues.modeloId || modeloId, 
          generacionId: currentValues.generacionId || selectedGeneracionId,
          anio: currentValues.anio || anioValue,
          estado: currentValues.estado || estadoValue,
          notas: currentValues.notas || notasValue
        };
        
        console.log('📝 Valores a persistir:', paso1Values);
        
        // Forzar que los valores se mantengan en el formulario
        form.setFieldsValue(paso1Values);
        
        // Esperar un momento para que se actualice
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Verificar que se guardaron correctamente
        const valoresVerificacion = form.getFieldsValue();
        console.log('✅ Verificación post-guardado:', valoresVerificacion);
        
        // Validaciones manuales críticas
        if (!paso1Values.anio) {
          message.error('Por favor ingrese el año del vehículo antes de continuar');
          return;
        }
        
        if (!paso1Values.generacionId) {
          message.error('Por favor seleccione una generación antes de continuar');
          return;
        }
        
        console.log('✅ Validaciones manuales pasaron correctamente');
      }
      
      // PASO 3: Validar campos usando Ant Design
      let fieldsToValidate = [];
      
      if (currentStep === 0) {
        fieldsToValidate = ['marcaId', 'modeloId', 'generacionId', 'anio', 'estado'];
      } else if (currentStep === 1) {
        fieldsToValidate = ['precioCompra', 'fechaIngreso'];
      }
      
      console.log('🔍 Validando campos con Ant Design:', fieldsToValidate);
      
      try {
        const validatedValues = await form.validateFields(fieldsToValidate);
        console.log('✅ Validación Ant Design exitosa:', validatedValues);
        
        // Verificación final específica para el año
        if (currentStep === 0 && !validatedValues.anio) {
          throw new Error('El año no está presente después de la validación');
        }
        
      } catch (validationError) {
        console.error('❌ Error en validación Ant Design:', validationError);
        
        if (validationError.errorFields && validationError.errorFields.length > 0) {
          const errorMessages = validationError.errorFields.map(field => 
            `${field.name[0]}: ${field.errors[0]}`
          );
          message.error(`Faltan campos: ${errorMessages.join(', ')}`);
        } else {
          message.error('Por favor complete todos los campos requeridos');
        }
        return;
      }
      
      // PASO 4: Avanzar al siguiente paso
      console.log('🎉 Todo validado correctamente, avanzando al paso:', currentStep + 1);
      setCurrentStep(currentStep + 1);
      
    } catch (error) {
      console.error('❌ Error general en handleNext:', error);
      message.error('Error inesperado: ' + error.message);
    }
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
                  disabled={!modeloId || isLoadingGeneraciones}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    return option.children.toLowerCase().includes(input.toLowerCase());
                  }}
                  style={{ width: '100%' }}
                  value={selectedGeneracionId}
                  onChange={(value) => {
                    console.log('🎯 Generación seleccionada en onChange:', value);
                    setSelectedGeneracionId(value);
                    form.setFieldsValue({ generacionId: value });
                  }}
                >
                  {generaciones.map((generacion) => {
                    const startYear = generacion.anioInicio || 'N/A';
                    const endYear = generacion.anioFin || 'Actual';
                    const displayText = `${generacion.nombre} (${startYear}-${endYear})`;
                    
                    return (
                      <Option 
                        key={generacion.id}
                        value={generacion.id}
                      >
                        {displayText}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="anio"
                label="Año"
                rules={[
                  { required: true, message: 'Por favor seleccione el año' }
                ]}
                preserve={true}
              >
                <Select 
                  showSearch
                  style={{ width: '100%' }}
                  placeholder={aniosDisponibles.length > 0 ? "Seleccione el año" : "Seleccione una generación primero"}
                  optionFilterProp="children"
                  value={anioValue}
                  disabled={!selectedGeneracionId || aniosDisponibles.length === 0}
                  onChange={(value) => {
                    console.log('📅 Año seleccionado:', value, 'Tipo:', typeof value);
                    setAnioValue(value);
                    form.setFieldsValue({ anio: value });
                  }}
                  filterOption={(input, option) =>
                    option.children.toString().toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {aniosDisponibles.map(anio => (
                    <Option key={anio} value={anio}>
                      {anio}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="estado"
                label="Estado del vehículo"
                rules={[{ required: true, message: 'Por favor selecciona el estado del vehículo' }]}
                preserve={true}
              >
                <Select 
                  placeholder="Selecciona el estado"
                  style={{ width: '100%' }}
                  value={estadoValue}
                  onChange={(value) => {
                    console.log('📋 Estado cambiado:', value);
                    setEstadoValue(value);
                    form.setFieldsValue({ estado: value });
                  }}
                >
                  <Option value="DISPONIBLE">Disponible</Option>
                  <Option value="REPARACION">En reparación</Option>
                  <Option value="DESARMADO">Desarmado</Option>
                  <Option value="VENDIDO">Vendido</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="notas"
                label="Notas"
                preserve={true}
              >
                <TextArea 
                  rows={4} 
                  placeholder="Ingresa notas adicionales sobre el vehículo" 
                  maxLength={500}
                  showCount
                  value={notasValue}
                  onChange={(e) => {
                    console.log('📝 Notas cambiadas:', e.target.value);
                    setNotasValue(e.target.value);
                    form.setFieldsValue({ notas: e.target.value });
                  }}
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
              rules={formRules.precioCompra}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={0}
                step={1000}
                formatter={value => `₡ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/[₡\s,]/g, '')}
                precision={2}
                placeholder="0.00"
                value={precioCompraValue}
                onChange={(value) => {
                  console.log('💰 Precio de compra cambiado:', value, 'Tipo:', typeof value);
                  setPrecioCompraValue(value);
                  form.setFieldsValue({ precioCompra: value });
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="costoGrua"
              label="Costo de grúa"
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={0}
                step={100}
                formatter={value => `₡ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/[₡\s,]/g, '')}
                precision={2}
                placeholder="0.00"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="comisiones"
              label="Comisiones"
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={0}
                step={100}
                formatter={value => `₡ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/[₡\s,]/g, '')}
                precision={2}
                placeholder="0.00"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="fechaIngreso"
              label="Fecha de ingreso"
              rules={formRules.fechaIngreso}
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
            <div>
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
            </div>
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
    <div>
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
        {/* Panel de debug */}
        <Alert
          message="Información de Debug"
          description={<pre style={{ fontSize: '12px', margin: 0 }}>{debugInfo}</pre>}
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
          closable
        />
        
        <Steps current={currentStep} style={{ marginBottom: '24px' }}>
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
          
          <div style={{ marginTop: '24px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                {currentStep > 0 && (
                  <Button 
                    onClick={handlePrev} 
                    disabled={isSubmitting}
                  >
                    Anterior
                  </Button>
                )}
              </div>
              <div>
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
              </div>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default NuevoVehiculo;