import React, { useState } from 'react';
import { Card, Table, Button, Space, Typography, Input, Select, Tag, Spin, message, Row, Col } from 'antd';
import { SearchOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useVehiculos } from '../../hooks/useVehiculos';
import './vehiculos.css';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const Vehiculos = () => {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState({});
  const { data, isLoading, isError, refetch } = useVehiculos(filtros);
  
  // Asegurarse de que los datos sean un array
  const tableData = data?.data && Array.isArray(data.data) ? data.data : [];
  
  const handleSearch = (value) => {
    setFiltros(prev => ({
      ...prev,
      busqueda: value
    }));
  };

  const handleEstadoChange = (value) => {
    setFiltros(prev => ({
      ...prev,
      estado: value
    }));
  };

  const handleRefresh = () => {
    refetch();
  };
  
  const columns = [
    {
      title: 'Marca',
      dataIndex: ['generacion', 'modelo', 'marca', 'nombre'],
      key: 'marca',
      width: 150,
      ellipsis: true,
      render: (text) => <span style={{ whiteSpace: 'nowrap' }}>{text || '-'}</span>,
    },
    {
      title: 'Modelo',
      dataIndex: ['generacion', 'modelo', 'nombre'],
      key: 'modelo',
      width: 150,
      ellipsis: true,
      render: (text) => <span style={{ whiteSpace: 'nowrap' }}>{text || '-'}</span>,
    },
    {
      title: 'Año',
      dataIndex: 'anio',
      key: 'anio',
      width: 100,
      align: 'center',
      render: (text) => text || '-',
    },
    {
      title: 'Precio de Compra',
      dataIndex: 'precio_compra',
      key: 'precio_compra',
      width: 150,
      align: 'right',
      render: (precio) => precio ? `$${precio.toLocaleString()}` : '-',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 140,
      render: (estado) => (
        <Tag 
          color={
            estado === 'DISPONIBLE' ? 'green' : 
            estado === 'VENDIDO' ? 'red' : 
            estado === 'EN_REPARACION' ? 'orange' : 'default'
          }
          style={{ 
            margin: 0,
            textTransform: 'capitalize',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            minWidth: '100px',
            display: 'inline-flex',
            justifyContent: 'center'
          }}
        >
          {estado?.toLowerCase()?.replace('_', ' ') || '-'}
        </Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            onClick={() => navigate(`/vehiculos/${record.id}`)}
            style={{ padding: '4px 0' }}
          >
            Ver
          </Button>
        </Space>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="vehiculos-container" style={{ textAlign: 'center', padding: '20px' }}>
        <Title level={2}>Error al cargar los vehículos</Title>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
          style={{ marginTop: '16px' }}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  const estados = [
    { value: 'DISPONIBLE', label: 'Disponible' },
    { value: 'RESERVADO', label: 'Reservado' },
    { value: 'VENDIDO', label: 'Vendido' },
    { value: 'EN_REPARACION', label: 'En Reparación' },
  ];

  return (
    <div className="vehiculos-container" style={{ padding: '16px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ marginBottom: '8px' }}>Gestión de Vehículos</Title>
        <Text type="secondary">Administra el inventario de vehículos disponibles</Text>
      </div>
      
      <Card 
        title={
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: '16px',
            rowGap: '16px'
          }}>
            <span style={{ whiteSpace: 'nowrap' }}>Lista de Vehículos</span>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => navigate('/vehiculos/nuevo')}
              style={{ flexShrink: 0 }}
            >
              Agregar Vehículo
            </Button>
          </div>
        }
        style={{ marginBottom: '24px', overflow: 'hidden' }}
        bodyStyle={{ padding: '16px' }}
      >
        <div style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Buscar por marca, modelo, año..."
                allowClear
                enterButton={<SearchOutlined />}
                onSearch={handleSearch}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Filtrar por estado"
                style={{ width: '100%' }}
                allowClear
                onChange={handleEstadoChange}
              >
                <Option value="DISPONIBLE">Disponible</Option>
                <Option value="VENDIDO">Vendido</Option>
                <Option value="EN_REPARACION">En reparación</Option>
                <Option value="RESERVADO">Reservado</Option>
              </Select>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleRefresh}
                style={{ width: { xs: '100%', md: 'auto' } }}
              >
                Actualizar
              </Button>
            </Col>
          </Row>
        </div>
        
        <div style={{ 
          width: '100%',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: '-ms-autohiding-scrollbar',
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          marginTop: '16px'
        }}>
          <Spin spinning={isLoading}>
            <Table 
              columns={columns} 
              dataSource={tableData} 
              rowKey="id"
              scroll={{ x: 'max-content' }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `Mostrando ${range[0]}-${range[1]} de ${total} vehículos`,
                showQuickJumper: true,
                total: data?.total || 0,
                responsive: true,
                size: 'small',
                style: { 
                  margin: '16px 16px 0',
                  paddingBottom: '16px'
                }
              }}
              locale={{
                emptyText: (
                  <div style={{ 
                    padding: '40px 0',
                    color: 'rgba(0, 0, 0, 0.45)'
                  }}>
                    No se encontraron vehículos que coincidan con los criterios de búsqueda
                  </div>
                )
              }}
              style={{ 
                minWidth: '800px',
                border: 'none'
              }}
              className="custom-table"
            />
          </Spin>
        </div>
      </Card>
    </div>
  );
};

export default Vehiculos;
