import React, { useState } from 'react';
import { 
  Tabs, 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  Switch, 
  Avatar, 
  Upload, 
  message, 
  Divider, 
  Row, 
  Col, 
  List, 
  Typography, 
  Modal,
  Space,
  Tag,
  InputNumber,
  Descriptions,
  Progress
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  BellOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  SettingOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  DownloadOutlined,
  ApiOutlined,
  KeyOutlined,
  MessageOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const Configuracion = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('perfil');
  const [avatarFile, setAvatarFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  
  // Datos de ejemplo
  const usuario = {
    nombre: 'Juan Pérez',
    email: 'juan.perez@empresa.com',
    telefono: '+52 1 55 1234 5678',
    rol: 'Administrador',
    puesto: 'Gerente de Ventas',
    departamento: 'Ventas',
    fechaRegistro: '15/03/2020',
    ultimoAcceso: 'Hoy, 14:30',
    direccion: 'Av. Insurgentes Sur 1234, Col. Condesa, CDMX',
    notificaciones: {
      email: true,
      sms: false,
      push: true,
      recordatorios: true,
      ofertas: false,
    },
    temas: 'claro',
    idioma: 'es',
    zonaHoraria: 'America/Mexico_City',
  };
  
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Solo puedes subir archivos JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('La imagen debe ser menor a 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  
  const handleChange = (info) => {
    if (info.file.status === 'done') {
      setAvatarFile(info.file.originFileObj);
      message.success(`${info.file.name} subido correctamente`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} falló al subir.`);
    }
  };
  
  const handleSaveProfile = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Datos guardados:', values);
        message.success('Perfil actualizado correctamente');
        setIsEditing(false);
      })
      .catch((info) => {
        console.log('Error al validar:', info);
      });
  };
  
  const handleChangePassword = () => {
    message.success('Contraseña actualizada correctamente');
    setIsChangePasswordModalVisible(false);
  };
  
  return (
    <div className="configuracion-container">
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        tabPosition="left"
        className="configuracion-tabs"
      >
        <TabPane
          tab={
            <span>
              <UserOutlined />
              Perfil
            </span>
          }
          key="perfil"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card title="Foto de Perfil">
                <div style={{ textAlign: 'center' }}>
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                  >
                    {avatarFile ? (
                      <Avatar 
                        src={URL.createObjectURL(avatarFile)} 
                        size={150} 
                        icon={<UserOutlined />} 
                      />
                    ) : (
                      <Avatar 
                        size={150} 
                        icon={<UserOutlined />} 
                        style={{ fontSize: '64px' }}
                      />
                    )}
                  </Upload>
                  <div style={{ marginTop: 16 }}>
                    <Text type="secondary">Haz clic para cambiar la foto</Text>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={16}>
              <Card 
                title="Información Personal"
                extra={
                  isEditing ? (
                    <Space>
                      <Button onClick={() => setIsEditing(false)}>Cancelar</Button>
                      <Button type="primary" onClick={handleSaveProfile}>
                        Guardar Cambios
                      </Button>
                    </Space>
                  ) : (
                    <Button 
                      type="primary" 
                      icon={<EditOutlined />} 
                      onClick={() => setIsEditing(true)}
                    >
                      Editar Perfil
                    </Button>
                  )
                }
              >
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={{
                    nombre: usuario.nombre,
                    email: usuario.email,
                    telefono: usuario.telefono,
                    direccion: usuario.direccion,
                    puesto: usuario.puesto,
                    departamento: usuario.departamento,
                  }}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="nombre"
                        label="Nombre Completo"
                        rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}
                      >
                        <Input 
                          prefix={<UserOutlined />} 
                          placeholder="Nombre Completo" 
                          disabled={!isEditing}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label="Correo Electrónico"
                        rules={[
                          { required: true, message: 'Por favor ingresa tu correo' },
                          { type: 'email', message: 'Ingresa un correo válido' },
                        ]}
                      >
                        <Input 
                          prefix={<MailOutlined />} 
                          placeholder="correo@ejemplo.com" 
                          disabled={!isEditing}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="telefono"
                        label="Teléfono"
                      >
                        <Input 
                          prefix={<PhoneOutlined />} 
                          placeholder="+52 1 55 1234 5678" 
                          disabled={!isEditing}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="puesto"
                        label="Puesto"
                      >
                        <Input 
                          placeholder="Ej: Gerente de Ventas" 
                          disabled={!isEditing}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="direccion"
                    label="Dirección"
                  >
                    <Input 
                      prefix={<EnvironmentOutlined />} 
                      placeholder="Dirección completa" 
                      disabled={!isEditing}
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="departamento"
                    label="Departamento"
                  >
                    <Input 
                      placeholder="Departamento" 
                      disabled={!isEditing}
                    />
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <TeamOutlined />
              Usuarios
            </span>
          }
          key="usuarios"
        >
          <Card
            title="Gestión de Usuarios"
            extra={
              <Button type="primary" icon={<PlusOutlined />}>
                Nuevo Usuario
              </Button>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={[
                { 
                  id: 1, 
                  nombre: 'Ana García', 
                  email: 'ana.garcia@empresa.com', 
                  rol: 'Vendedor', 
                  activo: true,
                  ultimoAcceso: 'Hoy, 10:15',
                },
                { 
                  id: 2, 
                  nombre: 'Carlos López', 
                  email: 'carlos.lopez@empresa.com', 
                  rol: 'Vendedor', 
                  activo: true,
                  ultimoAcceso: 'Ayer, 16:45',
                },
                { 
                  id: 3, 
                  nombre: 'María Rodríguez', 
                  email: 'maria.rodriguez@empresa.com', 
                  rol: 'Inventario', 
                  activo: false,
                  ultimoAcceso: 'Hace 3 días',
                },
              ]}
              renderItem={(user) => (
                <List.Item
                  actions={[
                    <Button type="link" icon={<EditOutlined />} />,
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => console.log('Eliminar usuario:', user.id)}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ backgroundColor: user.activo ? '#52c41a' : '#f52222' }}
                        icon={<UserOutlined />} 
                      />
                    }
                    title={
                      <Space>
                        <Text>{user.nombre}</Text>
                        <Tag color={user.activo ? 'success' : 'error'}>
                          {user.activo ? 'Activo' : 'Inactivo'}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">{user.email}</Text>
                        <Text type="secondary">Rol: {user.rol}</Text>
                        <Text type="secondary">Último acceso: {user.ultimoAcceso}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <SettingOutlined />
              Sistema
            </span>
          }
          key="sistema"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card title="Información del Sistema">
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Versión de la Aplicación">1.0.0</Descriptions.Item>
                  <Descriptions.Item label="Última Actualización">07/07/2023</Descriptions.Item>
                  <Descriptions.Item label="Base de Datos">MySQL 8.0</Descriptions.Item>
                  <Descriptions.Item label="Servidor">Node.js 16.14.0</Descriptions.Item>
                  <Descriptions.Item label="Frontend">React 18.2.0</Descriptions.Item>
                </Descriptions>
                
                <Divider>Estado del Servidor</Divider>
                
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text>Uso de CPU</Text>
                    <Text strong>24%</Text>
                  </div>
                  <Progress percent={24} status="active" />
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text>Uso de Memoria</Text>
                    <Text strong>1.8 GB / 4 GB</Text>
                  </div>
                  <Progress percent={45} status="normal" />
                </div>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text>Almacenamiento</Text>
                    <Text strong>125 GB / 500 GB</Text>
                  </div>
                  <Progress percent={25} status="success" />
                </div>
              </Card>
            </Col>
            
            <Col xs={24} md={12}>
              <Card title="Copia de Seguridad">
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <FileTextOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                  <Title level={4} style={{ marginBottom: '8px' }}>Copia de Seguridad</Title>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
                    Realiza una copia de seguridad de todos tus datos para prevenir pérdidas de información.
                  </Text>
                  
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button type="primary" block icon={<DownloadOutlined />}>
                      Descargar Copia de Seguridad
                    </Button>
                    <Button block icon={<UploadOutlined />}>
                      Restaurar desde Archivo
                    </Button>
                  </Space>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
      
      {/* Modal para cambiar contraseña */}
      <Modal
        title="Cambiar Contraseña"
        open={isChangePasswordModalVisible}
        onOk={handleChangePassword}
        onCancel={() => setIsChangePasswordModalVisible(false)}
        okText="Guardar Cambios"
        cancelText="Cancelar"
      >
        <Form layout="vertical">
          <Form.Item
            label="Contraseña Actual"
            name="currentPassword"
            rules={[{ required: true, message: 'Por favor ingresa tu contraseña actual' }]}
          >
            <Input.Password placeholder="Ingresa tu contraseña actual" />
          </Form.Item>
          <Form.Item
            label="Nueva Contraseña"
            name="newPassword"
            rules={[{ required: true, message: 'Por favor ingresa una nueva contraseña' }]}
          >
            <Input.Password placeholder="Ingresa tu nueva contraseña" />
          </Form.Item>
          <Form.Item
            label="Confirmar Nueva Contraseña"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Por favor confirma tu nueva contraseña' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Las contraseñas no coinciden'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirma tu nueva contraseña" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Configuracion;
