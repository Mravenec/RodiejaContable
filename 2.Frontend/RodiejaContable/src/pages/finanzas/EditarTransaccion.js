import React from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, InputNumber, Button, Card, Typography, message } from 'antd';

const { Title } = Typography;

const EditarTransaccion = () => {
  const { id } = useParams();
  
  const onFinish = (values) => {
    console.log('Editar transacción:', values);
    message.success('Transacción actualizada correctamente');
  };

  return (
    <div>
      <Title level={2}>Editar Transacción</Title>
      <Card>
        <p>Formulario para editar transacción con ID: {id}</p>
        {/* Implementar formulario de edición */}
      </Card>
    </div>
  );
};

export default EditarTransaccion;
