import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
  message,
  PageHeader,
} from 'antd';
import {
  ArrowLeftOutlined,
} from '@ant-design/icons';

import { Unidade } from '../../../models';
import { api } from '../../../services/api';
import { Subunidades } from '../Subunidades';

type HandleEditParams = {
  sigla: string;
  descricao: string;
  unidadePaiId: string;
}

export function EditUnidade() {
  const navigate = useNavigate();
  const params = useParams();

  const [unidade, setUnidade] = useState<Unidade>();
  const [subunidades, setSubunidades] = useState<Unidade[]>([]);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const loadUnidade = async () => {
      const response = await api.get<Unidade>(`/unidades/${params.unidadeId}`);

      setUnidade(response.data);
      setSubunidades(response.data.subUnidades);
    };

    loadUnidade();
  }, []);

  const handleGoBack = useCallback(() => {
    navigate('/unidades');
  }, []);

  const handleEdit = useCallback(async ({
    sigla,
    descricao,
    unidadePaiId,
  }: HandleEditParams) => {
    try {
      setEditLoading(true);

      const response = await api.put<Unidade>(`/unidades/${params.unidadeId}`, {
        sigla,
        descricao,
        unidadePaiId,
      });

      setUnidade(response.data);

      message.success('Registro salvo com sucesso!');
    } catch (error) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setEditLoading(false);
    }
  }, []);

  if (!unidade) {
    return <div />;
  }

  return (
    <>
      <PageHeader
        ghost={false}
        title="Editar Unidade"
        subTitle="Edição de unidade"
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
        initialValues={unidade}
      >
        <Form.Item
          hidden
          name="unidadePaiId"
        >
          <Input />
        </Form.Item>

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
          <Button loading={editLoading} type="primary" htmlType="submit">
            Salvar
          </Button>
        </Form.Item>
      </Form>

      <Subunidades subunidades={subunidades} setSubunidades={setSubunidades} />
    </>
  );
}
