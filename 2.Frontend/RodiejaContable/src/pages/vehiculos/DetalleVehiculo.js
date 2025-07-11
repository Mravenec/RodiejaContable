import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Descriptions, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const DetalleVehiculo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Datos de ejemplo - reemplazar con llamada a la API
  const vehiculo = {
    id: id,
    marca: 'Toyota',
    modelo: 'Corolla',
    anio: 2020,
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
        <Title level={2} style={{ margin: 0 }}>Detalle del Vehículo</Title>
      </div>
      
      <Card>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{vehiculo.id}</Descriptions.Item>
          <Descriptions.Item label="Marca">{vehiculo.marca}</Descriptions.Item>
          <Descriptions.Item label="Modelo">{vehiculo.modelo}</Descriptions.Item>
          <Descriptions.Item label="Año">{vehiculo.anio}</Descriptions.Item>
          {/* Agregar más detalles según sea necesario */}
        </Descriptions>
      </Card>
    </div>
  );
};

export default DetalleVehiculo;
