import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Button, Form, Input, InputNumber, PageHeader, Select, message,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CdsFg } from '../../../models';
import { api } from '../../../services/api';

export function EditCdsFG() {
  const params = useParams();
  const navigate = useNavigate();

  const [editLoading, setEditLoading] = useState(false);
  const [cdsFg, setCdsFg] = useState<CdsFg>();

  useEffect(() => {
    const loadCdsFg = async () => {
      const response = await api.get<CdsFg>(`/cds_fgs/${params.id}`);

      setCdsFg(response.data);
    };

    loadCdsFg();
  }, []);

  const handleSubmit = useCallback(async (data) => {
    try {
      setEditLoading(true);

      const response = await api.put<CdsFg>(`/cds_fgs/${params.id}`, data);

      setCdsFg(response.data);

      message.success('Registro salvo com sucesso!');
    } catch (error) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setEditLoading(false);
    }
  }, []);

  if (!cdsFg) {
    return <div />;
  }

  return (
    <>
      <PageHeader
        ghost={false}
        title="Edição CDS/FG"
        subTitle="Edição de Cargos comissionados e funções gratificadas"
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

      <Form
        layout="vertical"
        initialValues={cdsFg}
        onFinish={handleSubmit}
      >
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

        <Form.Item
          label="Quantidade de nomeados"
        >
          <InputNumber
            style={{ width: '100%' }}
            disabled
            value={cdsFg.quantidadeNomeados}
          />
        </Form.Item>

        <Form.Item>
          <Button
            loading={editLoading}
            type="primary"
            htmlType="submit"
          >
            Salvar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
