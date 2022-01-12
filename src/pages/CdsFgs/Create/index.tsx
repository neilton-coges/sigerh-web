import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Button, PageHeader, Form, Select, Input, InputNumber, message,
} from 'antd';
import { useCallback, useState } from 'react';
import { api } from '../../../services/api';
import { CdsFg } from '../../../models';

export function CreateCdsFg() {
  const navigate = useNavigate();
  const [createLoading, setCreateLoading] = useState(false);

  const handleSubmit = useCallback(async (data) => {
    try {
      setCreateLoading(true);

      const response = await api.post<CdsFg>('/cds_fgs', data);

      message.success('Registro criado com sucesso!');

      navigate(`/cds/${response.data.id}`);
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
        title="Novo CDS/FG"
        subTitle="Criação de Cargos comissionados e funções gratificadas"
        extra={[
          <Button
            key="backButton"
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/cds')}
          >
            Voltar
          </Button>,
        ]}
      />

      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          required
          label="Tipo"
          name="tipo"
          rules={[{
            required: true, message: 'Informe o tipo.',
          }]}
        >
          <Select>
            <Select.Option value="CDS">CDS</Select.Option>
            <Select.Option value="FG">FG</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          required
          label="Simbologia"
          name="simbologia"
          rules={[{
            required: true, message: 'Informe a simbologia.',
          }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          required
          label="Remuneração"
          name="remuneracao"
          rules={[{
            required: true, message: 'Informe a remuneração.',
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

        <Form.Item
          required
          label="Quantidade de vagas"
          name="quantidadeVagas"
          rules={[{
            required: true, message: 'Informe a remuneração.',
          }]}
        >
          <InputNumber
            style={{ width: '100%' }}
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
