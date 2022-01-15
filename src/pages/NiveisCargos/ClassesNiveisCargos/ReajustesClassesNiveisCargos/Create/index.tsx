import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Button, Form, Input, InputNumber, message, PageHeader,
} from 'antd';

import { ReajusteClasseNivelCargo } from '../../../../../models';
import { api } from '../../../../../services/api';

type HandleCreateParams = {
  percentual: number;
  observacao: string;
}

export function CreateReajusteClasseNivelCargo() {
  const params = useParams();
  const navigate = useNavigate();

  const [createLoading, setCreateLoading] = useState(false);

  const handleGoBack = useCallback(() => {
    navigate(
      `/niveis_cargos/${params.nivelCargoId}/classes/${params.classeNivelCargoId}`,
    );
  }, []);

  const handleCreate = useCallback(async ({
    percentual,
    observacao,
  }: HandleCreateParams) => {
    try {
      setCreateLoading(true);

      await api.post<ReajusteClasseNivelCargo>(
        `/niveis_cargos/${params.nivelCargoId}/classes/${params.classeNivelCargoId}/reajustes`,
        {
          percentual,
          observacao,
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
        title="Criar Reajuste"
        subTitle="Criação de reajuste de classe"
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
          label="Percentual (%)"
          name="percentual"
          rules={[{
            required: true, message: 'Informe o percentual.',
          }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            decimalSeparator=","
            precision={2}
            min={0.01}
          />
        </Form.Item>

        <Form.Item
          label="Observação"
          name="observacao"
        >
          <Input.TextArea />
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
