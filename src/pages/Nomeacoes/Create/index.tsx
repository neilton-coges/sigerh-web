import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Button, Col, Form, Input, message, PageHeader, Row, Select,
} from 'antd';
import { Moment } from 'moment';
import { useCallback, useEffect, useState } from 'react';
import ReactInputMask from 'react-input-mask';
import { useNavigate } from 'react-router-dom';

import {
  Cargo, CdsFg, Nomeacao, Servidor, Unidade,
} from '../../../models';
import { api } from '../../../services/api';

type HandleCreateParams = {
  cargoId: string;
  cdsFgId: string;
  unidadeId: string;
  servidorId: string;
  data: string;
  diofProcesso: string;
  observacao: string;
}

export function CreateNomeacao() {
  const navigate = useNavigate();

  const [createLoading, setCreateLoading] = useState(false);
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [cdsFgs, setCdsFgs] = useState<CdsFg[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);

  useEffect(() => {
    const loadServidores = async () => {
      const response = await api.get<Servidor[]>('/servidores');
      setServidores(response.data);
    };

    const loadCargos = async () => {
      const response = await api.get<Cargo[]>('/cargos');
      setCargos(response.data);
    };

    const loadCdsFgs = async () => {
      const response = await api.get<CdsFg[]>('/cds_fgs');
      setCdsFgs(response.data);
    };

    const loadUnidades = async () => {
      const response = await api.get<Unidade[]>('/unidades');
      setUnidades(response.data.filter((item) => item.unidadePaiId === null));
    };

    loadServidores();
    loadCargos();
    loadCdsFgs();
    loadServidores();
    loadUnidades();
  }, []);

  const handleGoBack = useCallback(() => {
    navigate('/nomeacoes');
  }, []);

  const handleCreate = useCallback(async ({
    cargoId,
    cdsFgId,
    data,
    diofProcesso,
    observacao,
    servidorId,
    unidadeId,
  }: HandleCreateParams) => {
    try {
      setCreateLoading(true);

      const response = await api.post<Nomeacao>('/nomeacoes', {
        tipo: 'NOMEACAO',
        cargoId,
        cdsFgId,
        data: new Date(Date.parse(data)),
        diofProcesso,
        observacao,
        servidorId,
        unidadeId,
      });

      message.success('Registro criado com sucesso!');

      // navigate(`/nomeacoes/${response.data.id}`);
    } catch (err) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setCreateLoading(false);
    }
  }, []);

  return (
    <>
      <PageHeader
        ghost={false}
        title="Criar Nomeação"
        subTitle="Criação de nomeação"
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
        onFinish={handleCreate}
      >

        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={12}>
            <Form.Item
              required
              label="Data"
              name="data"
              rules={[{ required: true, message: 'Informe a data.' }]}
            >
              <ReactInputMask mask="99/99/9999">
                {(inputProps: any) => <Input autoFocus {...inputProps} />}
              </ReactInputMask>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={12}>
            <Form.Item
              label="DIOF/Processo"
              name="diofProcesso"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          required
          label="Servidor"
          name="servidorId"
          rules={[{
            required: true, message: 'Informe o servidor.',
          }]}
        >
          <Select
            showSearch
            optionFilterProp="children"
          >
            {servidores.map((servidor) => (
              <Select.Option
                key={servidor.id}
                value={servidor.id}
              >
                {`${servidor.cpf} - ${servidor.nome}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Form.Item
              required
              label="Cargo"
              name="cargoId"
              rules={[{
                required: true, message: 'Informe o cargo.',
              }]}
            >
              <Select
                showSearch
                optionFilterProp="children"
              >
                {cargos.map((cargo) => (
                  <Select.Option
                    key={cargo.id}
                    value={cargo.id}
                  >
                    {cargo.descricao}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={8}>
            <Form.Item
              label="CDS/FG"
              name="cdsFgId"
            >
              <Select
                showSearch
                allowClear
                optionFilterProp="children"
              >
                {cdsFgs.map((cdsFg) => (
                  <Select.Option
                    key={cdsFg.id}
                    value={cdsFg.id}
                  >
                    {cdsFg.simbologia}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={8}>
            <Form.Item
              required
              label="Unidade"
              name="unidadeId"
              rules={[{
                required: true, message: 'Informe a unidade.',
              }]}
            >
              <Select
                showSearch
                optionFilterProp="children"
              >
                {unidades.map((unidade) => (
                  <Select.Option
                    key={unidade.id}
                    value={unidade.id}
                  >
                    {unidade.sigla}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Observação"
          name="observacao"
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Button
            loading={createLoading}
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
