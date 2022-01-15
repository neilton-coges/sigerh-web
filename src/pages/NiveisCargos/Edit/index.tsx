import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftOutlined, PlusOutlined,
} from '@ant-design/icons';
import {
  Button, Card, Form, Input, message, PageHeader, Popconfirm, Space, Table,
} from 'antd';

import { NivelCargo } from '../../../models';
import { api } from '../../../services/api';
import { ListClasseNivelCargo } from '../ClassesNiveisCargos/List';

type HandleSaveParams = {
  codigo: string;
  descricao: string;
}

export function EditNivelCargo() {
  const params = useParams();
  const navigate = useNavigate();

  const [editLoading, setEditLoading] = useState(false);
  const [nivelCargo, setNivelCargo] = useState<NivelCargo>();

  useEffect(() => {
    const loadNivelCargo = async () => {
      const response = await api.get<NivelCargo>(`/niveis_cargos/${params.nivelCargoId}`);

      setNivelCargo(response.data);
    };
    loadNivelCargo();
  }, []);

  const handleEdit = useCallback(async ({
    codigo,
    descricao,
  }: HandleSaveParams) => {
    try {
      setEditLoading(true);

      const response = await api.put<NivelCargo>(`/niveis_cargos/${params.nivelCargoId}`, {
        codigo,
        descricao,
      });

      setNivelCargo(response.data);

      message.success('Registro salvo com sucesso!');
    } catch (error) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setEditLoading(false);
    }
  }, []);

  const handleAdd = useCallback(() => {
    navigate('classes/create');
  }, []);

  const handleGoBack = useCallback(() => {
    navigate('/niveis_cargos');
  }, []);

  if (!nivelCargo) {
    return <div />;
  }

  return (
    <>
      <PageHeader
        ghost={false}
        title="Editar Nível Cargo"
        subTitle="Edição de nivel cargo"
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
        onFinish={handleEdit}
        initialValues={nivelCargo}
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

        <Form.Item>
          <Button loading={editLoading} type="primary" htmlType="submit">
            Salvar
          </Button>
        </Form.Item>
      </Form>

      <Card
        tabList={[{
          key: '1',
          tab: 'classes',
        }]}
        activeTabKey="1"
        tabBarExtraContent={(
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Adicionar
          </Button>
        )}
      >
        <ListClasseNivelCargo />
      </Card>

    </>
  );
}
