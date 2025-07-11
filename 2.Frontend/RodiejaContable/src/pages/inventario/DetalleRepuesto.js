import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Descriptions, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const DetalleRepuesto = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Datos de ejemplo - reemplazar con llamada a la API
  const repuesto = {
    id: id,
    nombre: 'Filtro de aceite',
    codigo: 'FL-001',
    stock: 15,
    // ... otros campos
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          style={{ marginRight: 16 }}
        >
          Volver
        </Button>
        <Title level={2} style={{ margin: 0 }}>Detalle del Repuesto</Title>
      </div>
      
      <Card>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{repuesto.id}</Descriptions.Item>
          <Descriptions.Item label="Nombre">{repuesto.nombre}</Descriptions.Item>
          <Descriptions.Item label="Código">{repuesto.codigo}</Descriptions.Item>
          <Descriptions.Item label="Stock">{repuesto.stock}</Descriptions.Item>
          {/* Agregar más detalles según sea necesario */}
        </Descriptions>
      </Card>
    </div>
  );
};

export default DetalleRepuesto;
