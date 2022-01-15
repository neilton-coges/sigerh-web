import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Button, Input, PageHeader, Form, InputNumber, message,
} from 'antd';

import { PadraoClasseNivelCargo } from '../../../../../models';
import { api } from '../../../../../services/api';

type HandleEditParams = {
  codigo: string;
  descricao: string;
}

export function EditPadraoClasseNivelCargo() {
  const navigate = useNavigate();
  const params = useParams();

  const [editLoading, setEditLoading] = useState(false);
  const [
    padraoClasseNivelCargo,
    setPadraoClasseNivelCargo,
  ] = useState<PadraoClasseNivelCargo>();

  useEffect(() => {
    const loadPadraoClasseNivelCargo = async () => {
      const response = await api.get<PadraoClasseNivelCargo>(
        `/niveis_cargos/${params.nivelCargoId}/classes/${params.classeNivelCargoId}/padroes/${params.padraoClasseNivelCargoId}`,
      );

      setPadraoClasseNivelCargo(response.data);
    };

    loadPadraoClasseNivelCargo();
  }, []);

  const handleGoBack = useCallback(() => {
    navigate(
      `/niveis_cargos/${params.nivelCargoId}/classes/${params.classeNivelCargoId}`,
    );
  }, []);

  const handleEdit = useCallback(async ({ codigo, descricao }: HandleEditParams) => {
    try {
      setEditLoading(true);

      const response = await api.put<PadraoClasseNivelCargo>(
        `/niveis_cargos/${params.nivelCargoId}/classes/${params.classeNivelCargoId}/padroes/${params.padraoClasseNivelCargoId}`,
        {
          codigo,
          descricao,
        },
      );

      setPadraoClasseNivelCargo(response.data);

      message.success('Registro salvo com sucesso!');
    } catch (error) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setEditLoading(false);
    }
  }, []);

  if (!padraoClasseNivelCargo) {
    return <div />;
  }

  return (
    <>
      <PageHeader
        ghost={false}
        title="Editar Padrão"
        subTitle="Edição de padrão de classe"
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
      <Form
        layout="vertical"
        onFinish={handleEdit}
        initialValues={padraoClasseNivelCargo}
      >

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
          label="Valor"
          name="valor"
        >
          <InputNumber
            style={{ width: '100%' }}
            prefix="R$"
            decimalSeparator=","
            precision={2}
            min={1}
            disabled
            readOnly
          />
        </Form.Item>

        <Form.Item>
          <Button loading={editLoading} type="primary" htmlType="submit">
            Salvar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
