import { useCallback, useEffect, useState } from 'react';
import ReactInputMask from 'react-input-mask';
import { useParams } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
} from 'antd';

import { Jornada, Lotacao, Unidade } from '../../../../models';
import { api } from '../../../../services/api';

type HandleEditParams = {
  id: string;
  matricula: string;
  dataAdmissao: string;
  jornadaId: string;
  subUnidadeId: string;
  observacao: string;
}

export function Lotacoes() {
  const params = useParams();
  const [form] = Form.useForm();

  const [lotacoes, setLotacoes] = useState<Lotacao[]>([]);
  const [jornadas, setJornadas] = useState<Jornada[]>([]);
  const [subunidades, setSubunidades] = useState<Unidade[]>([]);

  const [editLoading, setEditLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const loadLotacoes = useCallback(async () => {
    const response = await api.get<Lotacao[]>(
      `/servidores/${params.servidorId}/lotacoes`,
    );

    setLotacoes(response.data);
  }, []);

  useEffect(() => {
    const loadJornadas = async () => {
      const response = await api.get<Jornada[]>('/jornadas');

      setJornadas(response.data);
    };

    const loadSubunidades = async () => {
      const response = await api.get<Unidade[]>('/unidades');

      setSubunidades(response.data);
    };

    loadLotacoes();
    loadJornadas();
    loadSubunidades();
  }, []);

  const onCancelModal = useCallback(() => {
    setIsModalVisible(false);
    form.resetFields();
  }, [form]);

  const onOkModal = useCallback(() => {
    form.submit();
  }, [form]);

  const onEdit = useCallback((id: string) => {
    const lotacao = lotacoes.find((item) => item.id === id);

    if (!lotacao) {
      return;
    }

    form.setFieldsValue(lotacao);
    setIsModalVisible(true);
  }, [lotacoes, form]);

  const handleEdit = useCallback(async ({
    id,
    matricula,
    dataAdmissao,
    jornadaId,
    subUnidadeId,
    observacao,
  }: HandleEditParams) => {
    try {
      setEditLoading(true);

      await api.put<Lotacao>(
        `/servidores/${params.servidorId}/lotacoes/${id}`,
        {
          matricula,
          dataAdmissao,
          jornadaId: jornadaId || null,
          subUnidadeId: subUnidadeId || null,
          observacao,
        },
      );

      await loadLotacoes();
      setIsModalVisible(false);
      message.success('Registro salvo com sucesso!');
    } catch (err) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setEditLoading(false);
    }
  }, [loadLotacoes]);

  return (
    <>
      <Table
        bordered
        rowKey={(record) => record.id}
        dataSource={lotacoes}
        pagination={false}
      >
        <Table.Column width="10%" title="Matricula" dataIndex="matricula" key="matricula" />
        <Table.Column width="20%" title="Cargo" dataIndex="cargo" key="cargo" render={(cargo) => cargo.descricao} />
        <Table.Column width="20%" title="CDS/FG" dataIndex="cdsFg" key="cdsFg" render={(cdsFg) => cdsFg?.simbologia} />
        <Table.Column width="20%" title="Unidade" dataIndex="unidade" key="unidade" render={(unidade) => unidade.sigla} />
        <Table.Column width="20%" title="Subunidade" dataIndex="subUnidade" key="subUnidade" render={(subUnidade) => subUnidade?.sigla} />
        <Table.Column
          width="10%"
          align="center"
          dataIndex="id"
          render={(id) => (
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => onEdit(id)}
              />
            </Space>
          )}
        />
      </Table>

      <Modal
        title="Editar lotação"
        okText="Salvar"
        okButtonProps={{
          loading: editLoading,
        }}
        cancelText="Cancelar"
        visible={isModalVisible}
        onCancel={onCancelModal}
        onOk={onOkModal}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleEdit}
        >
          <Form.Item
            name="id"
            hidden
          >
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={12}>
              <Form.Item
                label="Matrícula"
                name="matricula"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12}>
              <Form.Item
                label="Data admissão"
                name="dataAdmissao"
              >
                <ReactInputMask mask="99/99/9999">
                  {(inputProps: any) => <Input {...inputProps} />}
                </ReactInputMask>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={12}>
              <Form.Item
                label="Jornada"
                name="jornadaId"
              >
                <Select allowClear>
                  {jornadas.map((jornada) => (
                    <Select.Option
                      key={jornada.id}
                      value={jornada.id}
                    >
                      {jornada.descricao}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12}>
              <Form.Item
                label="Subunidade"
                name="subUnidadeId"
              >
                <Select allowClear>
                  {subunidades.map((subunidade) => (
                    <Select.Option
                      key={subunidade.id}
                      value={subunidade.id}
                    >
                      {subunidade.sigla}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="observacao"
            label="Obesrvação"
          >
            <Input.TextArea />
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
}
