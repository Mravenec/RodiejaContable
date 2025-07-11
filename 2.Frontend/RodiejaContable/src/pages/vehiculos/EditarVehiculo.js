import React from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';

const { Title } = Typography;

const EditarVehiculo = () => {
  const { id } = useParams();
  
  const onFinish = (values) => {
    console.log('Editar vehículo:', values);
    message.success('Vehículo actualizado correctamente');
  };

  return (
    <div>
      <Title level={2}>Editar Vehículo</Title>
      <Card>
        <p>Formulario para editar vehículo con ID: {id}</p>
        {/* Implementar formulario de edición */}
      </Card>
    </div>
  );
};

export default EditarVehiculo;
