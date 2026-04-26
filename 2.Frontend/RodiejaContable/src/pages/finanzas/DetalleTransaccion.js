import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Descriptions, Button, Spin, message, Tag } from 'antd';
import { ArrowLeftOutlined, CarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import finanzaService from '../../api/finanzas';
import { getTiposTransacciones } from '../../api/transacciones';

const { Title } = Typography;

const DetalleTransaccion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaccion, setTransaccion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransaccion = async () => {
      try {
        setLoading(true);
        setError(null);
        // Obtener transacción y tipos en paralelo
        const [transaccionData, tiposData] = await Promise.all([
          finanzaService.getTransaccionById(id),
          getTiposTransacciones()
        ]);
        
        // Enriquecer con tipo de transacción
        const enrichedTransaccion = {
          ...transaccionData,
          tipo_transaccion: tiposData.find(tipo => 
            tipo.id === transaccionData.tipoTransaccionId || 
            tipo.id === transaccionData.tipo_transaccion_id
          )
        };
        
        setTransaccion(enrichedTransaccion);
      } catch (err) {
        console.error('Error fetching transaction:', err);
        setError(err.message || 'Error al cargar la transacción');
        message.error('Error al cargar la transacción');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTransaccion();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !transaccion) {
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
          <p>No se pudo cargar la información de la transacción.</p>
          <Button type="primary" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </Card>
      </div>
    );
  }

  // Format currency with sign
  const formatCurrency = (amount, isIncome = false) => {
    const formattedAmount = new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 2
    }).format(Math.abs(amount || 0));
    
    const cleanAmount = formattedAmount.replace('₡', '').trim();
    const color = isIncome ? '#52c41a' : '#f5222d';
    const sign = isIncome ? '+' : '-';
    
    return (
      <span style={{ color }}>
        {sign} ₡{cleanAmount}
      </span>
    );
  };

  // Format date
  const formatDate = (dateValue) => {
    if (!dateValue) return 'No especificada';
    
    try {
      if (Array.isArray(dateValue)) {
        const [year, month, day] = dateValue;
        return new Date(year, month - 1, day).toLocaleDateString();
      }
      
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? 'Fecha inválida' : date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha inválida';
    }
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
          <Descriptions.Item label="Tipo">
            <Tag color={
              transaccion.tipo_transaccion?.categoria === 'INGRESO' || 
              transaccion.tipo === 'INGRESO' || 
              transaccion.categoria === 'INGRESO' 
                ? 'green' : 'red'
            }>
              {transaccion.tipo_transaccion?.nombre || transaccion.tipo || 'No especificado'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Categoría">
            {transaccion.tipo_transaccion?.categoria || transaccion.categoria || 'No especificado'}
          </Descriptions.Item>
          <Descriptions.Item label="Monto">
            {formatCurrency(
              transaccion.monto, 
              transaccion.tipo_transaccion?.categoria === 'INGRESO' || transaccion.categoria === 'INGRESO'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Fecha">{formatDate(transaccion.fecha)}</Descriptions.Item>
          <Descriptions.Item label="Descripción">
            {transaccion.descripcion || 'Sin descripción'}
          </Descriptions.Item>
          {transaccion.vehiculoId && (
            <Descriptions.Item label="Vehículo">
              <Button 
                type="link" 
                icon={<CarOutlined />}
                onClick={() => navigate(`/vehiculos/${transaccion.vehiculoId}`)}
                style={{ padding: 0 }}
              >
                {transaccion.vehiculoId}
              </Button>
            </Descriptions.Item>
          )}
          {transaccion.repuestoId && (
            <Descriptions.Item label="ID Repuesto">{transaccion.repuestoId}</Descriptions.Item>
          )}
          {transaccion.referencia && (
            <Descriptions.Item label="Referencia">{transaccion.referencia}</Descriptions.Item>
          )}
          {transaccion.codigoTransaccion && (
            <Descriptions.Item label="Código Transacción">{transaccion.codigoTransaccion}</Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </div>
  );
};

export default DetalleTransaccion;
