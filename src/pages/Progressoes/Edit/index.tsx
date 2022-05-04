import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Button, Col, Form, Input, PageHeader, Row,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Progressao } from '../../../models';
import { api } from '../../../services/api';

export function EditProgressao() {
  const navigate = useNavigate();
  const params = useParams();

  const [progressao, setProgressao] = useState<Progressao>();

  useEffect(() => {
    const loadProgressao = async () => {
      const response = await api.get<Progressao>(`/progressoes/${params.progressaoId}`);
      setProgressao(response.data);
    };

    loadProgressao();
  }, []);

  const handleGoBack = useCallback(() => {
    navigate('/progressoes');
  }, []);

  if (!progressao) {
    return <div />;
  }

  return (
    <>
      <PageHeader
        ghost={false}
        title="Visualizar Progressão"
        subTitle="Visualização de progressão"
        extra={[
          <Button
            key="backButton"
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
          >
            Voltar
          </Button>,
        ]}
      />

      <Form layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Form.Item label="Servidor">
              <Input disabled value={progressao.servidor.nome} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={8}>
            <Form.Item label="Data progressão">
              <Input disabled value={progressao.dataProgressaoFormatada} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={8}>
            <Form.Item label="Processo">
              <Input disabled value={progressao.processo} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Form.Item label="Cargo">
              <Input disabled value={progressao.cargo.descricao} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={8}>
            <Form.Item label="Classe">
              <Input disabled value={`${progressao.classeNivelCargo.codigo} - ${progressao.classeNivelCargo.descricao}`} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={8}>
            <Form.Item label="Padrão">
              <Input disabled value={`${progressao.padraoClasseNivelCargo.codigo} - ${progressao.padraoClasseNivelCargo.descricao}`} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Form.Item label="Observação">
              <Input.TextArea disabled rows={4} value={progressao.observacao} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}
