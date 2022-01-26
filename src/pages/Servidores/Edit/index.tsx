import { useCallback, useEffect, useState } from 'react';
import ReactInputMask from 'react-input-mask';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Collapse,
  Form,
  Input,
  message,
  PageHeader,
  Row,
  Select,
} from 'antd';

import { Servidor } from '../../../models';
import { api } from '../../../services/api';
import { Lotacoes } from './Lotacoes';

type HandleEditParams = {
  nome: string;
  dataNascimento: string;
  telefoneCorporativo: string;
  telefonePessoal: string;
  emailCorporativo: string;
  emailPessoal: string;
  genero: string;
  tipoSanguineo: string;
  corRaca: string;
  nacionalidade: string;
  naturalidadeCidade: string;
  naturalidadeEstado: string;
  estadoCivil: string;
  conjugeNome: string;
  conjugeCpf: string;
  conjugeDataNascimento: string;
  nomeMae: string;
  nomePai: string;
  cpf: string;
  rgNumero: string;
  rgOrgaoEmissor: string;
  rgDataEmissao: string;
  tituloNumero: string;
  tituloSecao: string;
  tituloZona: string;
  pis: string;
}

export function EditServidor() {
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [editLoading, setEditLoading] = useState(false);
  const [servidor, setServidor] = useState<Servidor>();

  useEffect(() => {
    const loadServidor = async () => {
      const response = await api.get<Servidor>(`/servidores/${params.servidorId}`);

      setServidor(response.data);
    };

    loadServidor();
  }, []);

  const handleGoBack = useCallback(() => {
    navigate('/servidores');
  }, []);

  const onSave = useCallback(() => {
    form.submit();
  }, []);

  const handleEdit = useCallback(async (data: HandleEditParams) => {
    try {
      setEditLoading(true);

      const response = await api.put<Servidor>(
        `/servidores/${params.servidorId}`,
        data,
      );

      setServidor(response.data);

      message.success('Registro salvo com sucesso!');
    } catch (err) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setEditLoading(false);
    }
  }, []);

  if (!servidor) {
    return <div />;
  }

  return (
    <>
      <PageHeader
        ghost={false}
        title="Editar Servidor"
        subTitle="Edição de servidor"
        extra={[
          <Button
            key="saveButton"
            type="primary"
            onClick={onSave}
            loading={editLoading}
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

      <Form
        layout="vertical"
        form={form}
        onFinish={handleEdit}
        initialValues={servidor}
      >
        <Collapse defaultActiveKey={['1', '2']}>
          <Collapse.Panel
            key={1}
            header="Dados pessoais"
          >

            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={18}>
                <Form.Item
                  required
                  label="Nome"
                  name="nome"
                  rules={[{
                    required: true, message: 'Informe o nome.',
                  }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  required
                  label="Data nascimento"
                  name="dataNascimento"
                  rules={[{
                    required: true, message: 'Informe a data de nascimento.',
                  }]}
                >
                  <ReactInputMask mask="99/99/9999">
                    {(inputProps: any) => <Input {...inputProps} />}
                  </ReactInputMask>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  required
                  label="Estado civil"
                  name="estadoCivil"
                  rules={[{
                    required: true, message: 'Informe o estado civil.',
                  }]}
                >
                  <Select>
                    <Select.Option value="SOLTEIRO">Solteiro</Select.Option>
                    <Select.Option value="CASADO">Casado</Select.Option>
                    <Select.Option value="SEPARADO">Separado</Select.Option>
                    <Select.Option value="DIVORCIADO">Divorciado</Select.Option>
                    <Select.Option value="VIUVO">Viúvo</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  required
                  label="Gênero"
                  name="genero"
                  rules={[{
                    required: true, message: 'Informe o gênero.',
                  }]}
                >
                  <Select>
                    <Select.Option value="MASCULINO">Masculino</Select.Option>
                    <Select.Option value="FEMININO">Feminino</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  required
                  label="Cor/Raça"
                  name="corRaca"
                  rules={[{
                    required: true, message: 'Informe o cor/raça.',
                  }]}
                >
                  <Select>
                    <Select.Option value="BRANCA">Branca</Select.Option>
                    <Select.Option value="PRETA">Preta</Select.Option>
                    <Select.Option value="PARDA">Parda</Select.Option>
                    <Select.Option value="AMARELA">Amarela</Select.Option>
                    <Select.Option value="INDIGENA">Indígena</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  required
                  label="Tipo sanguíneo"
                  name="tipoSanguineo"
                  rules={[{
                    required: true, message: 'Informe o tipo sanguíneo.',
                  }]}
                >
                  <Select>
                    <Select.Option value="A+">A+</Select.Option>
                    <Select.Option value="A-">A-</Select.Option>
                    <Select.Option value="B+">B+</Select.Option>
                    <Select.Option value="B-">B-</Select.Option>
                    <Select.Option value="AB+">AB+</Select.Option>
                    <Select.Option value="AB-">AB-</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  label="Tel. corporativo"
                  name="telefoneCorporativo"
                >
                  <ReactInputMask mask="(99) 9999-9999">
                    {(inputProps: any) => <Input {...inputProps} />}
                  </ReactInputMask>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  required
                  label="Tel. pessoal"
                  name="telefonePessoal"
                  rules={[{
                    required: true, message: 'Informe o telefone pessoal.',
                  }]}
                >
                  <ReactInputMask mask="(99) 99999-9999">
                    {(inputProps: any) => <Input {...inputProps} />}
                  </ReactInputMask>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  label="E-mail corporativo"
                  name="emailCorporativo"
                >
                  <Input />
                </Form.Item>

              </Col>

              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  required
                  label="E-mail pessoal"
                  name="emailPessoal"
                  rules={[{
                    required: true, message: 'Informe o e-mail pessoal.',
                  }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  required
                  label="Naturalidade cidade"
                  name="naturalidadeCidade"
                  rules={[{
                    required: true, message: 'Informe o naturalidade cidade.',
                  }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  required
                  label="Naturalidade estado"
                  name="naturalidadeEstado"
                  rules={[{
                    required: true, message: 'Informe o naturalidade estado.',
                  }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  required
                  label="Nacionalidade"
                  name="nacionalidade"
                  rules={[{
                    required: true, message: 'Informe a nacionalidade.',
                  }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Collapse.Panel>

          <Collapse.Panel
            key={2}
            header="Documentação"
          >
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  required
                  label="CPF"
                  name="cpf"
                  rules={[{
                    required: true, message: 'Informe o CPF.',
                  }]}
                >
                  <ReactInputMask mask="999.999.999-99">
                    {(inputProps: any) => <Input {...inputProps} />}
                  </ReactInputMask>
                </Form.Item>

              </Col>

              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  required
                  label="RG"
                  name="rgNumero"
                  rules={[{
                    required: true, message: 'Informe o RG.',
                  }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  required
                  label="Orgão emissor"
                  name="rgOrgaoEmissor"
                  rules={[{
                    required: true, message: 'Informe o orgão emissor.',
                  }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  required
                  label="Data emissão"
                  name="rgDataEmissao"
                  rules={[{
                    required: true, message: 'Informe o data emissão.',
                  }]}
                >
                  <ReactInputMask mask="99/99/9999">
                    {(inputProps: any) => <Input {...inputProps} />}
                  </ReactInputMask>
                </Form.Item>
              </Col>

            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  required
                  label="Título eleitor"
                  name="tituloNumero"
                  rules={[{
                    required: true, message: 'Informe o título eleitor.',
                  }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  required
                  label="Seção"
                  name="tituloSecao"
                  rules={[{
                    required: true, message: 'Informe a seção.',
                  }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  required
                  label="Zona"
                  name="tituloZona"
                  rules={[{
                    required: true, message: 'Informe a zona.',
                  }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  required
                  label="PIS"
                  name="pis"
                  rules={[{
                    required: true, message: 'Informe o PIS.',
                  }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

          </Collapse.Panel>

          <Collapse.Panel
            key={3}
            header="Conjuge"
          >
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  label="Nome"
                  name="conjugeNome"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  label="CPF"
                  name="conjugeCpf"
                >
                  <ReactInputMask mask="999.999.999-99">
                    {(inputProps: any) => <Input {...inputProps} />}
                  </ReactInputMask>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  label="Data nascimento"
                  name="conjugeDataNascimento"
                >
                  <ReactInputMask mask="99/99/9999">
                    {(inputProps: any) => <Input {...inputProps} />}
                  </ReactInputMask>
                </Form.Item>
              </Col>
            </Row>
          </Collapse.Panel>

          <Collapse.Panel
            key={4}
            header="Filiação"
          >
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  label="Nome do pai"
                  name="nomePai"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={6}>
                <Form.Item
                  label="Nome da mãe"
                  name="nomeMae"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Collapse.Panel>

          <Collapse.Panel
            key={5}
            header="Lotação"
          >
            <Lotacoes />
          </Collapse.Panel>
        </Collapse>
      </Form>
    </>
  );
}
