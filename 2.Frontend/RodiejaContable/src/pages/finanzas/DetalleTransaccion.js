import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Descriptions, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const DetalleTransaccion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Datos de ejemplo - reemplazar con llamada a la API
  const transaccion = {
    id: id,
    tipo: 'VENTA',
    monto: 1500.00,
    fecha: '2023-06-15',
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
        <Title level={2} style={{ margin: 0 }}>Detalle de la Transacción</Title>
      </div>
      
      <Card>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{transaccion.id}</Descriptions.Item>
          <Descriptions.Item label="Tipo">{transaccion.tipo}</Descriptions.Item>
          <Descriptions.Item label="Monto">${transaccion.monto.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="Fecha">{transaccion.fecha}</Descriptions.Item>
          {/* Agregar más detalles según sea necesario */}
        </Descriptions>
      </Card>
    </div>
  );
};

export default DetalleTransaccion;
