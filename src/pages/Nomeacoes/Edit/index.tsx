import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Button, Col, Form, Input, PageHeader, Row, Select,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import ReactInputMask from 'react-input-mask';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Cargo, CdsFg, Nomeacao, Servidor, Unidade,
} from '../../../models';
import { api } from '../../../services/api';

export function EditNomeacao() {
  const navigate = useNavigate();
  const params = useParams();

  const [nomeacao, setNomeacao] = useState<Nomeacao>();
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [cdsFgs, setCdsFgs] = useState<CdsFg[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);

  useEffect(() => {
    const loadNomeacao = async () => {
      const response = await api.get<Nomeacao>(`/nomeacoes/${params.nomeacaoId}`);

      setNomeacao(response.data);
    };

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

    loadNomeacao();
    loadServidores();
    loadCargos();
    loadCdsFgs();
    loadServidores();
    loadUnidades();
  }, []);

  const handleGoBack = useCallback(() => {
    navigate('/nomeacoes');
  }, []);

  if (!nomeacao) {
    return <div />;
  }

  return (
    <>
      <PageHeader
        ghost={false}
        title="Visualizar Nomeação"
        subTitle="Visualização de nomeação"
        extra={[
          <Button
            key="saveButton"
            type="primary"
            danger
          >
            Exonerar
          </Button>,
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
        initialValues={nomeacao}
      >

        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={12}>
            <Form.Item
              label="Data"
              name="dataFormatada"
            >
              <ReactInputMask mask="99/99/9999" disabled>
                {(inputProps: any) => <Input {...inputProps} disabled />}
              </ReactInputMask>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={12}>
            <Form.Item
              label="DIOF/Processo"
              name="diofProcesso"
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Servidor"
          name="servidorId"
        >
          <Select
            showSearch
            optionFilterProp="children"
            disabled
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
              label="Cargo"
              name="cargoId"
            >
              <Select
                showSearch
                optionFilterProp="children"
                disabled
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
                disabled
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
              label="Unidade"
              name="unidadeId"
            >
              <Select
                showSearch
                optionFilterProp="children"
                disabled
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
          <Input.TextArea disabled />
        </Form.Item>
      </Form>
    </>
  );
}
