import {
  ReactNode, useCallback, useEffect, useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button, Input, message, PageHeader, Form, Card,
} from 'antd';

import { api } from '../../../../services/api';
import { ClasseNivelCargo } from '../../../../models';
import { ListPadraoClasseNivelCargo } from '../PadroesClassesNiveisCargos/List';
import { ListReajusteClasseNivelCargo } from '../ReajustesClassesNiveisCargos/List';

type HandleEditParams = {
  codigo: string;
  descricao: string;
}

const tabList = [
  {
    key: 'tab1',
    tab: 'padrões',
  },
  {
    key: 'tab2',
    tab: 'reajustes',
  },
];

type TabContent = {
  [key: string]: ReactNode
}

const tabContent: TabContent = {
  tab1: <ListPadraoClasseNivelCargo />,
  tab2: <ListReajusteClasseNivelCargo />,
};

export function EditClasseNivelCargo() {
  const navigate = useNavigate();
  const params = useParams();

  const [classeNivelCargo, setClasseNivelCargo] = useState<ClasseNivelCargo>();
  const [editLoading, setEditLoading] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState('tab1');

  useEffect(() => {
    const loadClasseNivelCargo = async () => {
      const response = await api.get<ClasseNivelCargo>(
        `/niveis_cargos/${params.nivelCargoId}/classes/${params.classeNivelCargoId}`,
      );

      setClasseNivelCargo(response.data);
    };

    loadClasseNivelCargo();
  }, []);

  const handleEdit = useCallback(async ({
    codigo,
    descricao,
  }: HandleEditParams) => {
    try {
      setEditLoading(true);

      const response = await api.put<ClasseNivelCargo>(
        `/niveis_cargos/${params.nivelCargoId}/classes/${params.classeNivelCargoId}`,
        {
          codigo,
          descricao,
        },
      );

      setClasseNivelCargo(response.data);

      message.success('Registro salvo com sucesso!');
    } catch (error) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setEditLoading(false);
    }
  }, []);

  const handleTabChange = useCallback((key: string) => {
    setActiveTabKey(key);
  }, []);

  const handleGoBack = useCallback(() => {
    navigate(`/niveis_cargos/${params.nivelCargoId}`);
  }, []);

  const handleAdd = useCallback(() => {
    switch (activeTabKey) {
      case 'tab1':
        navigate('padroes/create');
        break;
      case 'tab2':
        navigate('reajustes/create');
        break;
      default:
        break;
    }
  }, [activeTabKey]);

  if (!classeNivelCargo) {
    return <div />;
  }

  return (
    <>
      <PageHeader
        ghost={false}
        title="Editar Classe"
        subTitle="Edição de classe para nivel cargo"
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
        initialValues={classeNivelCargo}
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
        tabList={tabList}
        activeTabKey={activeTabKey}
        onTabChange={handleTabChange}
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
        {tabContent[activeTabKey]}
      </Card>
    </>
  );
}
