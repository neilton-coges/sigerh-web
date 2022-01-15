import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Button, Input, PageHeader, Form, message,
} from 'antd';

import { ClasseNivelCargo } from '../../../../models';
import { api } from '../../../../services/api';

type HandleCreateParams = {
  codigo: string;
  descricao: string;
}

export function CreateClasseNivelCargo() {
  const navigate = useNavigate();
  const params = useParams();

  const [createLoading, setCreateLoading] = useState(false);

  const handleCreate = useCallback(async ({
    codigo,
    descricao,
  }: HandleCreateParams) => {
    try {
      setCreateLoading(true);

      const response = await api.post<ClasseNivelCargo>(`/niveis_cargos/${params.nivelCargoId}/classes`, {
        codigo,
        descricao,
      });

      message.success('Registro criado com sucesso!');

      navigate(
        `/niveis_cargos/${params.nivelCargoId}/classes/${params.classeNivelCargoId}/${response.data.id}`,
      );
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
        title="Criar Classe"
        subTitle="Criação de classe para nivel cargo"
        extra={[
          <Button
            key="backButton"
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(`/niveis_cargos/${params.nivelCargoId}`)}
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
