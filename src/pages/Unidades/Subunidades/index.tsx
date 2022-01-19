import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button, Card, Form, Input, message, Modal, Popconfirm, Space, Table,
} from 'antd';

import { Unidade } from '../../../models';
import { api } from '../../../services/api';

type SubunidadesProps = {
  subunidades: Unidade[];
  setSubunidades: React.Dispatch<React.SetStateAction<Unidade[]>>
}

type OnSaveParams = {
  id: string;
  sigla: string;
  descricao: string;
}

type HandleEditParams = OnSaveParams;

type HandleCreateParams = Omit<OnSaveParams, 'id'>;

export function Subunidades({ subunidades = [], setSubunidades }: SubunidadesProps) {
  const [form] = Form.useForm();
  const params = useParams();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);

  const onAdd = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const onCancelModal = useCallback(() => {
    setIsModalVisible(false);
    form.resetFields();
  }, [form]);

  const onOkModal = useCallback(() => {
    setIsModalVisible(false);
    form.submit();
  }, [form]);

  const onEdit = useCallback((id: string) => {
    const findSubunidade = subunidades?.find((item) => item.id === id);

    if (!findSubunidade) {
      return;
    }

    form.setFieldsValue(findSubunidade);
    setIsModalVisible(true);
  }, [subunidades, form]);

  const handleEdit = useCallback(async ({
    id,
    sigla,
    descricao,
  }: HandleEditParams) => {
    try {
      setSaveLoading(true);

      const response = await api.put<Unidade>(`/unidades/${id}`, {
        sigla,
        descricao,
        unidadePaiId: params.unidadeId,
      });

      setSubunidades((prevState) => prevState.map(
        (item) => (item.id === id ? response.data : item),
      ));

      message.success('Registro salvo com sucesso!');
    } catch (err) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setSaveLoading(false);
    }
  }, []);

  const handleCreate = useCallback(async ({
    sigla,
    descricao,
  }: HandleCreateParams) => {
    try {
      setSaveLoading(true);

      const response = await api.post<Unidade>('/unidades', {
        sigla,
        descricao,
        unidadePaiId: params.unidadeId,
      });

      setSubunidades((prevState) => [...prevState, response.data]);

      message.success('Registro criado com sucesso!');
    } catch (err) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setSaveLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      setConfirmDeleteLoading(true);

      await api.delete(`/unidades/${id}`);

      setSubunidades((prevState) => (prevState.filter((item) => item.id !== id)));

      message.success('Registro excluído com sucesso!');
    } catch (error) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, []);

  const onSave = useCallback(({
    id,
    sigla,
    descricao,
  }: OnSaveParams) => {
    if (id) {
      handleEdit({
        id,
        descricao,
        sigla,
      });
    } else {
      handleCreate({
        sigla,
        descricao,
      });
    }

    setIsModalVisible(false);
    form.resetFields();
  }, [form]);

  return (
    <>
      <Card
        tabList={[{ key: 'tab1', tab: 'subunidades' }]}
        activeTabKey="tab1"
        tabBarExtraContent={(
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={onAdd}
          >
            Adicionar
          </Button>
        )}
      >
        <Table
          bordered
          rowKey={(record) => record.id}
          dataSource={subunidades}
          pagination={false}
        >
          <Table.Column width="20%" title="Sigla" dataIndex="sigla" key="sigla" />
          <Table.Column width="70%" title="Descrição" dataIndex="descricao" key="descricao" />
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

                <Popconfirm
                  placement="left"
                  title="Você tem certeza que deseja excluir?"
                  onConfirm={() => handleDelete(id)}
                  okButtonProps={{
                    loading: confirmDeleteLoading,
                  }}
                >
                  <Button type="primary" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            )}
          />
        </Table>
      </Card>

      <Modal
        title="Salvar nova subunidade"
        okText="Salvar"
        okButtonProps={{
          loading: saveLoading,
        }}
        cancelText="Cancelar"
        visible={isModalVisible}
        onCancel={onCancelModal}
        onOk={onOkModal}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onSave}
        >
          <Form.Item
            name="id"
            hidden
          >
            <Input />
          </Form.Item>

          <Form.Item
            required
            label="Sigla"
            name="sigla"
            rules={[{
              required: true, message: 'Informe a sigla.',
            }]}
          >
            <Input />
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
        </Form>
      </Modal>
    </>
  );
}
