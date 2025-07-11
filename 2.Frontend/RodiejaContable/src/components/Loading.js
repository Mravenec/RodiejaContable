import React from 'react';
import { Spin, Typography, Row, Col } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const Loading = ({ tip = 'Cargando...', size = 'large', fullPage = true }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  
  const content = (
    <div style={{ textAlign: 'center' }}>
      <Spin indicator={antIcon} size={size} />
      {tip && (
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">{tip}</Text>
        </div>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <Row 
        type="flex" 
        justify="center" 
        align="middle" 
        style={{ 
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          padding: '24px'
        }}
      >
        <Col>{content}</Col>
      </Row>
    );
  }

  return content;
};

export default Loading;
