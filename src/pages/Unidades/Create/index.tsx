import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Form, Input, message, PageHeader,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { api } from '../../../services/api';
import { Unidade } from '../../../models';

type HandleCreateParams = {
  sigla: string;
  descricao: string;
}

export function CreateUnidade() {
  const navigate = useNavigate();

  const [createLoading, setCreateLoading] = useState(false);

  const handleGoBack = useCallback(() => {
    navigate('/unidades');
  }, []);

  const handleCreate = useCallback(async ({
    sigla,
    descricao,
  }: HandleCreateParams) => {
    try {
      setCreateLoading(true);

      const response = await api.post<Unidade>('/unidades', {
        sigla,
        descricao,
      });

      message.success('Registro criado com sucesso!');

      navigate(`/unidades/${response.data.id}`);
    } catch (error) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setCreateLoading(false);
    }
  }, []);

  return (
    <>
      <PageHeader
        ghost={false}
        title="Criar Unidade"
        subTitle="Criação de unidade"
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

      <Form
        layout="vertical"
        onFinish={handleCreate}
      >
        <Form.Item
          required
          label="Sigla"
          name="sigla"
          rules={[{
            required: true, message: 'Informe a sigla.',
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
          <Button
            loading={createLoading}
            type="primary"
            htmlType="submit"
          >
            Salvar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
