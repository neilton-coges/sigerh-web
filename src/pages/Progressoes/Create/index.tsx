import { useNavigate } from 'react-router-dom';
import { Moment } from 'moment';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  PageHeader,
  Row,
  Select,
} from 'antd';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Cargo,
  ClasseNivelCargo,
  PadraoClasseNivelCargo,
  Servidor,
} from '../../../models';
import { api } from '../../../services/api';

type HandleSubmitParams = {
  servidorId: string;
  cargoId: string;
  classeNivelCargoId: string;
  padraoClasseNivelCargoId: string;
  dataProgressao: Moment;
  processo: string;
  observacao: string;
}

export function CreateProgressao() {
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [classes, setClasses] = useState<ClasseNivelCargo[]>([]);
  const [padroes, setPadroes] = useState<PadraoClasseNivelCargo[]>([]);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const servidorSelecionadoId = Form.useWatch('servidorId', form);
  const cargoSelecionadoId = Form.useWatch('cargoId', form);
  const classeSelecionadaId = Form.useWatch('classeNivelCargoId', form);

  useEffect(() => {
    const servidorSelecionado = servidores.find(
      (servidor) => servidor.id === servidorSelecionadoId,
    );

    if (!servidorSelecionado) return;

    const lotacaoEfetiva = servidorSelecionado.lotacoes[0];
    const cargoAtual = lotacaoEfetiva.cargo;
    const classeAtual = lotacaoEfetiva.classeNivelCargo;
    const padraoAtual = lotacaoEfetiva.padraoClasseNivelCargo;

    form.setFieldsValue({
      cargoAtualDescricao: cargoAtual.descricao,
      classeAtualDescricao: `${classeAtual.codigo} - ${classeAtual.descricao}`,
      padraoAtualDescricao: `${padraoAtual.codigo} - ${padraoAtual.descricao}`,
    });
  }, [servidorSelecionadoId, servidores]);

  useEffect(() => {
    const cargoSelecionado = cargos.find((cargo) => cargo.id === cargoSelecionadoId);

    if (!cargoSelecionado) return;

    form.resetFields(['classeNivelCargoId', 'padraoClasseNivelCargoId']);

    const loadClasses = async () => {
      const response = await api.get<ClasseNivelCargo[]>(`/niveis_cargos/${cargoSelecionado.nivelCargoId}/classes`);
      setClasses(response.data);
    };

    loadClasses();
  }, [cargoSelecionadoId, cargos, form]);

  useEffect(() => {
    const classeSelecionada = classes.find((classe) => classe.id === classeSelecionadaId);
    const cargoSelecionado = cargos.find((cargo) => cargo.id === cargoSelecionadoId);

    if (!classeSelecionada || !cargoSelecionado) return;

    form.resetFields(['padraoClasseNivelCargoId']);

    const loadPadroes = async () => {
      const response = await api.get<PadraoClasseNivelCargo[]>(
        `/niveis_cargos/${cargoSelecionado.nivelCargoId}/classes/${classeSelecionada.id}/padroes`,
      );
      setPadroes(response.data);
    };

    loadPadroes();
  }, [classeSelecionadaId, classes, cargos, form]);

  useEffect(() => {
    const loadServidores = async () => {
      const response = await api.get<Servidor[]>('/servidores', {
        params: {
          tipoVinculo: 'EFETIVO',
        },
      });

      setServidores(response.data);
    };

    const loadCargos = async () => {
      const response = await api.get<Cargo[]>('/cargos', {
        params: {
          tipo: 'EFETIVO',
        },
      });

      setCargos(response.data);
    };

    loadServidores();
    loadCargos();
  }, []);

  const handleGoBack = useCallback(() => {
    navigate('/progressoes');
  }, []);

  const onSave = useCallback(() => {
    form.submit();
  }, [form]);

  const handleCreate = useCallback(async (data: HandleSubmitParams) => {
    const response = await api.post('/progressoes', {
      servidorId: data.servidorId,
      cargoId: data.cargoId,
      classeNivelCargoId: data.classeNivelCargoId,
      padraoClasseNivelCargoId: data.padraoClasseNivelCargoId,
      dataProgressao: data.dataProgressao.toDate(),
      processo: data.processo,
      observacao: data.observacao,
    });

    message.success('Registro criado com sucesso!');

    navigate(`/cargos/${response.data.id}`);
  }, []);

  return (
    <>
      <PageHeader
        ghost={false}
        title="Criar Progressão"
        subTitle="Criação de progressão"
        extra={[
          <Button
            key="saveButton"
            type="primary"
            onClick={onSave}
          >
            Salvar
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
      <Form form={form} layout="vertical" onFinish={handleCreate}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={6}>
            <Form.Item
              required
              label="Servidor"
              name="servidorId"
              rules={[{
                required: true, message: 'Informe o servidor.',
              }]}
            >
              <Select showSearch optionFilterProp="children">
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
          </Col>

          <Col xs={24} sm={24} md={24} lg={6}>
            <Form.Item
              label="Cargo atual"
              name="cargoAtualDescricao"
            >
              <Input disabled />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={6}>
            <Form.Item
              label="Classe atual"
              name="classeAtualDescricao"
            >
              <Input disabled />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={6}>
            <Form.Item
              label="Padrão atual"
              name="padraoAtualDescricao"
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Divider dashed />

        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={6}>
            <Form.Item
              required
              label="Cargo a progredir"
              name="cargoId"
              rules={[{
                required: true, message: 'Informe o cargo a progredir.',
              }]}
            >
              <Select showSearch optionFilterProp="children">
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

          <Col xs={24} sm={24} md={24} lg={6}>
            <Form.Item
              required
              label="Classe a progredir"
              name="classeNivelCargoId"
              rules={[{
                required: true, message: 'Informe a classe a progredir.',
              }]}
            >
              <Select showSearch optionFilterProp="children">
                {classes.map((classe) => (
                  <Select.Option
                    key={classe.id}
                    value={classe.id}
                  >
                    {`${classe.codigo} - ${classe.descricao}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={6}>
            <Form.Item
              required
              label="Padrão a progredir"
              name="padraoClasseNivelCargoId"
              rules={[{
                required: true, message: 'Informe o padrão a progredir.',
              }]}
            >
              <Select showSearch optionFilterProp="children">
                {padroes.map((padrao) => (
                  <Select.Option
                    key={padrao.id}
                    value={padrao.id}
                  >
                    {`${padrao.codigo} - ${padrao.descricao}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={3}>
            <Form.Item
              required
              label="Data da progressão"
              name="dataProgressao"
              rules={[{
                required: true, message: 'Informe a data da progressão.',
              }]}
            >
              <DatePicker placeholder="" style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={3}>
            <Form.Item
              required
              label="N° processo"
              name="processo"
              rules={[{
                required: true, message: 'Informe o n° do processo.',
              }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24}>
            <Form.Item
              label="Observação"
              name="observacao"
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </>
  );
}
