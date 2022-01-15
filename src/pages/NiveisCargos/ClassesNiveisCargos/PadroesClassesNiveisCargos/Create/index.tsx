import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Button, Form, Input, InputNumber, message, PageHeader,
} from 'antd';

import { PadraoClasseNivelCargo } from '../../../../../models';
import { api } from '../../../../../services/api';

type HandleCreateParams = {
  codigo: string;
  descricao: string;
  valor: number;
}

export function CreatePadraoClasseNivelCargo() {
  const params = useParams();
  const navigate = useNavigate();

  const [createLoading, setCreateLoading] = useState(false);

  const handleGoBack = useCallback(() => {
    navigate(
      `/niveis_cargos/${params.nivelCargoId}/classes/${params.classeNivelCargoId}`,
    );
  }, []);

  const handleCreate = useCallback(async ({
    codigo,
    descricao,
    valor,
  }: HandleCreateParams) => {
    try {
      setCreateLoading(true);

      await api.post<PadraoClasseNivelCargo>(
        `/niveis_cargos/${params.nivelCargoId}/classes/${params.classeNivelCargoId}/padroes`,
        {
          codigo,
          descricao,
          valor,
        },
      );

      message.success('Registro criado com sucesso!');

      navigate(
        `/niveis_cargos/${params.nivelCargoId}/classes/${params.classeNivelCargoId}`,
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
        title="Criar Padrão"
        subTitle="Criação de padrão de classe"
        extra={[
          <Button
            key="backButton"
            type="link"
            onClick={handleGoBack}
            icon={<ArrowLeftOutlined />}
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

        <Form.Item
          required
          label="Valor"
          name="valor"
          rules={[{
            required: true, message: 'Informe o valor.',
          }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            prefix="R$"
            decimalSeparator=","
            precision={2}
            min={1}
          />
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
