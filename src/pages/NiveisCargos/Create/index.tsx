import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Button, Form, Input, message, PageHeader,
} from 'antd';

import { NivelCargo } from '../../../models';
import { api } from '../../../services/api';

type HandleCreateParams = {
  codigo: string;
  descricao: string;
}

export function CreateNivelCargo() {
  const navigate = useNavigate();
  const [createLoading, setCreateLoading] = useState(false);

  const handleCreate = useCallback(async ({
    codigo,
    descricao,
  }: HandleCreateParams) => {
    try {
      setCreateLoading(true);

      const response = await api.post<NivelCargo>('/niveis_cargos', {
        codigo,
        descricao,
      });

      message.success('Registro criado com sucesso!');

      navigate(`/niveis_cargos/${response.data.id}`);
    } catch (error) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setCreateLoading(false);
    }
  }, []);

  const handleGoBack = useCallback(() => {
    navigate('/niveis_cargos');
  }, []);

  return (
    <>
      <PageHeader
        ghost={false}
        title="Criar Nível Cargo"
        subTitle="Criação de nível cargo"
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

      <Form layout="vertical" onFinish={handleCreate}>

        <Form.Item
          required
          label="Código"
          name="codigo"
          rules={[{
            required: true, message: 'Informe o código.',
          }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          required
          label="Descrição"
          name="descricao"
          rules={[{
            required: true, message: 'Informe a descrição.',
          }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button loading={createLoading} type="primary" htmlType="submit">
            Salvar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
