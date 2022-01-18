import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftOutlined, DeleteOutlined, EditOutlined, PlusOutlined,
} from '@ant-design/icons';
import {
  Button, PageHeader, Form, Input, Card, Table, Space, Popconfirm, TimePicker,
  message,
} from 'antd';
import moment, { Moment } from 'moment';
import { v4 as uuidV4 } from 'uuid';

import Modal from 'antd/lib/modal/Modal';
import FormItem from 'antd/lib/form/FormItem';
import { Jornada, JornadaHora } from '../../../models';
import { api } from '../../../services/api';

type HandleCreateParams = {
  nome: string;
}

type HandleCreateHourParams = {
  horaInicio: Moment;
  horaFim: Moment;
}

type HandleEditHourParams = {
  id: string;
  horaInicio: Moment;
  horaFim: Moment;
}

type OnSaveHourParams = HandleEditHourParams;

export function CreateJornada() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [createLoading, setCreateLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [jornadasHoras, setJornadasHoras] = useState<JornadaHora[]>([]);

  const handleGoBack = useCallback(() => {
    navigate('/jornadas');
  }, []);

  const handleAddHora = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleCreate = useCallback(async ({ nome }: HandleCreateParams) => {
    try {
      setCreateLoading(true);

      const horas = jornadasHoras.map((item) => ({
        horaInicio: item.horaInicio,
        horaFim: item.horaFim,
      }));

      if (horas.length < 1) {
        message.error('Adicione ao menos 1 registro de hora para continuar.');
        return;
      }

      const response = await api.post<Jornada>('/jornadas', {
        nome,
        horas,
      });

      message.success('Registro criado com sucesso!');

      navigate(`/jornadas/${response.data.id}`);
    } catch (err) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setCreateLoading(false);
    }
  }, [jornadasHoras]);

  const handleCreateHour = useCallback(({ horaInicio, horaFim }: HandleCreateHourParams) => {
    const horaInicioFormatted = horaInicio.format('HH:mm:ss');
    const horaFimFormatted = horaFim.format('HH:mm:ss');

    const newHour: JornadaHora = {
      id: uuidV4(),
      horaInicio: horaInicioFormatted,
      horaFim: horaFimFormatted,
    };

    setJornadasHoras((prevState) => [
      ...prevState,
      newHour,
    ]);

    setIsModalVisible(true);
    form.resetFields();
  }, [form]);

  const handleEditHour = useCallback(({ id, horaInicio, horaFim }: HandleEditHourParams) => {
    const findHour = jornadasHoras.find((item) => item.id === id);

    if (!findHour) {
      return;
    }

    const hour = {
      id,
      horaInicio: horaInicio.format('HH:mm:ss'),
      horaFim: horaFim.format('HH:mm:ss'),
    };

    setJornadasHoras((preState) => preState.map((item) => (item.id === id ? hour : item)));

    setIsModalVisible(true);
    form.resetFields();
  }, [jornadasHoras, form]);

  const handleDeleteHour = useCallback((id: string) => {
    setJornadasHoras((prevState) => prevState.filter((item) => item.id !== id));
  }, []);

  const onSaveHour = useCallback(({
    id,
    horaInicio,
    horaFim,
  }: OnSaveHourParams) => {
    if (id) {
      handleEditHour({
        id,
        horaInicio,
        horaFim,
      });
    } else {
      handleCreateHour({
        horaInicio,
        horaFim,
      });
    }

    setIsModalVisible(false);
    form.resetFields();
  }, [handleEditHour, handleCreateHour, form]);

  const onEditHour = useCallback((id: string) => {
    const findHour = jornadasHoras.find((item) => item.id === id);

    if (!findHour) {
      return;
    }

    const hour = {
      ...findHour,
      horaInicio: moment(findHour.horaInicio, 'HH:mm:ss'),
      horaFim: moment(findHour.horaFim, 'HH:mm:ss'),
    };

    form.setFieldsValue(hour);
    setIsModalVisible(true);
  }, [form, jornadasHoras]);

  const handleCancelModal = useCallback(() => {
    setIsModalVisible(false);
    form.resetFields();
  }, [form]);

  const handleOkModal = useCallback(() => {
    form.submit();
  }, [form]);

  return (
    <>
      <PageHeader
        ghost={false}
        title="Criar Jornada"
        subTitle="Criação de jornada"
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
          label="Descrição"
          name="nome"
          rules={[{
            required: true, message: 'Informe a descrição.',
          }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button loading={createLoading} type="primary" htmlType="submit">
            Salvar
          </Button>
        </Form.Item>
      </Form>

      <Card
        tabList={[{ key: 'tab1', tab: 'horários' }]}
        activeTabKey="tab1"
        tabBarExtraContent={(
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={handleAddHora}
          >
            Adicionar
          </Button>
        )}
      >
        <Table
          bordered
          rowKey={(record) => record.id}
          dataSource={jornadasHoras}
          pagination={false}
        >
          <Table.Column width="45%" title="Hora ínicio" dataIndex="horaInicio" key="horaInicio" />
          <Table.Column width="45%" title="Hora fim" dataIndex="horaFim" key="horaFim" />
          <Table.Column
            width="10%"
            align="center"
            dataIndex="id"
            render={(id) => (
              <Space>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => onEditHour(id)}
                />

                <Popconfirm
                  placement="left"
                  title="Você tem certeza que deseja excluir?"
                  onConfirm={() => handleDeleteHour(id)}
                >
                  <Button type="primary" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            )}
          />
        </Table>
      </Card>

      <Modal
        title="Salvar novo horário"
        visible={isModalVisible}
        okText="Salvar"
        cancelText="Cancelar"
        onCancel={handleCancelModal}
        onOk={handleOkModal}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onSaveHour}
        >
          <FormItem
            name="id"
            hidden
          >
            <Input />
          </FormItem>

          <Form.Item
            required
            label="Hora inicio"
            name="horaInicio"
            rules={[{
              required: true, message: 'Informe a hora inicio.',
            }]}
          >
            <TimePicker
              style={{ width: '100%' }}
              placeholder=""
              showSecond={false}
            />
          </Form.Item>

          <Form.Item
            required
            label="Hora fim"
            name="horaFim"
            rules={[{
              required: true, message: 'Informe a hora fim.',
            }]}
          >
            <TimePicker
              style={{ width: '100%' }}
              placeholder=""
              showSecond={false}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
