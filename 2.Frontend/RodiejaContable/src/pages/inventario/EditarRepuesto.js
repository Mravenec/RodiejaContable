import React from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, InputNumber, Button, Card, Typography, message } from 'antd';

const { Title } = Typography;

const EditarRepuesto = () => {
  const { id } = useParams();
  
  const onFinish = (values) => {
    console.log('Editar repuesto:', values);
    message.success('Repuesto actualizado correctamente');
  };

  return (
    <div>
      <Title level={2}>Editar Repuesto</Title>
      <Card>
        <p>Formulario para editar repuesto con ID: {id}</p>
        {/* Implementar formulario de edición */}
      </Card>
    </div>
  );
};

export default EditarRepuesto;
