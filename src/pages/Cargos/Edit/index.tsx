import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Button, Form, Input, message, PageHeader, Select,
} from 'antd';

import { Cargo, NivelCargo } from '../../../models';
import { api } from '../../../services/api';

type HandleEditParams = {
  tipo: string;
  descricao: string;
  nivelCargoId: string;
}

export function EditCargo() {
  const navigate = useNavigate();
  const params = useParams();

  const [nivelCargoIdIsRequired, setNivelCargoIdIsRequired] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [niveisCargos, setNiveisCargos] = useState<NivelCargo[]>([]);
  const [cargo, setCargo] = useState<Cargo>();

  useEffect(() => {
    const loadNiveisCargos = async () => {
      const response = await api.get<NivelCargo[]>('/niveis_cargos');

      setNiveisCargos(response.data);
    };

    const loadCargo = async () => {
      const response = await api.get<Cargo>(`/cargos/${params.cargoId}`);

      if (response.data.tipo === 'EFETIVO') {
        setNivelCargoIdIsRequired(true);
      }

      setCargo(response.data);
    };

    loadNiveisCargos();
    loadCargo();
  }, []);

  const handleGoBack = useCallback(() => {
    navigate('/cargos');
  }, []);

  const handleEdit = useCallback(async ({
    tipo,
    descricao,
    nivelCargoId,
  }: HandleEditParams) => {
    try {
      setEditLoading(true);

      const response = await api.put<Cargo>(`/cargos/${params.cargoId}`, {
        tipo,
        descricao,
        nivelCargoId: nivelCargoId || null,
      });

      setCargo(response.data);

      message.success('Registro salvo com sucesso!');
    } catch (error) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setEditLoading(false);
    }
  }, []);

  const handleChangeNivelCargo = useCallback((value: string) => {
    switch (value) {
      case 'EFETIVO':
        setNivelCargoIdIsRequired(true);
        break;
      default:
        setNivelCargoIdIsRequired(false);
        break;
    }
  }, []);

  if (!cargo) {
    return <div />;
  }

  return (
    <>
      <PageHeader
        ghost={false}
        title="Editar Cargo"
        subTitle="Edição de cargo"
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
        initialValues={cargo}
      >
        <Form.Item
          required
          label="Tipo"
          name="tipo"
          rules={[{
            required: true, message: 'Informe o tipo.',
          }]}
        >
          <Select onSelect={(value) => handleChangeNivelCargo(value.toString())}>
            <Select.Option value="EFETIVO">Efetivo</Select.Option>
            <Select.Option value="COMISSAO">Comissão</Select.Option>
            <Select.Option value="FUNCAO_GRATIFICADA">Função Gratificada</Select.Option>
          </Select>
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
          required={nivelCargoIdIsRequired}
          label="Nível"
          name="nivelCargoId"
          rules={[{
            required: nivelCargoIdIsRequired, message: 'Informe o nível.',
          }]}
        >
          <Select allowClear>
            {niveisCargos.map((nivelCargo) => (
              <Select.Option key={nivelCargo.id} value={nivelCargo.id}>
                {`${nivelCargo.codigo} - ${nivelCargo.descricao}`}
              </Select.Option>
            ))}
          </Select>
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
