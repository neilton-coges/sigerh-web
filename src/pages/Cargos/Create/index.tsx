import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Button, Form, Input, message, PageHeader, Select,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Cargo, NivelCargo } from '../../../models';
import { api } from '../../../services/api';

type HandleCreateParams = {
  tipo: string;
  descricao: string;
  nivelCargoId: string;
}

export function CreateCargo() {
  const navigate = useNavigate();

  const [nivelCargoIdIsRequired, setNivelCargoIdIsRequired] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [niveisCargos, setNiveisCargos] = useState<NivelCargo[]>([]);

  const handleGoBack = useCallback(() => {
    navigate('/cargos');
  }, []);

  const handleCreate = useCallback(async ({
    tipo,
    descricao,
    nivelCargoId,
  }: HandleCreateParams) => {
    try {
      setCreateLoading(true);

      const response = await api.post<Cargo>('/cargos', {
        tipo,
        descricao,
        nivelCargoId,
      });

      message.success('Registro criado com sucesso!');

      navigate(`/cargos/${response.data.id}`);
    } catch (error) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setCreateLoading(false);
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

  useEffect(() => {
    const loadNiveisCargos = async () => {
      const response = await api.get<NivelCargo[]>('/niveis_cargos');

      setNiveisCargos(response.data);
    };

    loadNiveisCargos();
  }, []);

  return (
    <>
      <PageHeader
        ghost={false}
        title="Criar Cargo"
        subTitle="Criação de cargo"
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
          label="Tipo"
          name="tipo"
          rules={[{
            required: true, message: 'Informe o tipo.',
          }]}
        >
          <Select onSelect={(value: string) => handleChangeNivelCargo(value)}>
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
          <Select>
            {niveisCargos.map((nivelCargo) => (
              <Select.Option key={nivelCargo.id} value={nivelCargo.id}>
                {`${nivelCargo.codigo} - ${nivelCargo.descricao}`}
              </Select.Option>

            ))}
          </Select>
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
