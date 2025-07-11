import React from 'react';
import { Card, Table, Button, Space, Typography, Input, Select, DatePicker } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const Vehiculos = () => {
  const navigate = useNavigate();
  
  // Datos de ejemplo (serán reemplazados con datos reales)
  const dataSource = [];
  
  const columns = [
    {
      title: 'Marca',
      dataIndex: 'marca',
      key: 'marca',
    },
    {
      title: 'Modelo',
      dataIndex: 'modelo',
      key: 'modelo',
    },
    {
      title: 'Año',
      dataIndex: 'anio',
      key: 'anio',
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/vehiculos/${record.id}`)}>Ver</Button>
          <Button type="link" onClick={() => navigate(`/vehiculos/editar/${record.id}`)}>Editar</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Vehículos</Title>
      
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <Space size="middle" wrap>
            <Search 
              placeholder="Buscar vehículos..." 
              style={{ width: 250 }} 
              enterButton={<SearchOutlined />} 
            />
            <Select placeholder="Filtrar por estado" style={{ width: 180 }} allowClear>
              <Option value="disponible">Disponible</Option>
              <Option value="vendido">Vendido</Option>
              <Option value="en_reparacion">En reparación</Option>
            </Select>
            <DatePicker.RangePicker style={{ width: 250 }} />
          </Space>
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/vehiculos/nuevo')}
          >
            Nuevo Vehículo
          </Button>
        </div>
        
        <Table 
          dataSource={dataSource} 
          columns={columns} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: 'No hay vehículos registrados' }}
        />
      </Card>
    </div>
  );
};

export default Vehiculos;
