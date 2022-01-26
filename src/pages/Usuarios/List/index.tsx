import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Col, Form, Input, message, PageHeader, Popconfirm, Row, Select, Space, Table,
} from 'antd';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { IPage, Usuario } from '../../../models';
import { api } from '../../../services/api';

type SearchUsuariosParams = {
  login?: string;
  tipo?: string;
  current?: number;
}

type HandleSearchParams = {
  login: string;
  tipo: string;
}

export function ListUsuario() {
  const navigate = useNavigate();

  const [page, setPage] = useState<IPage<Usuario>>({} as IPage<Usuario>);
  const [searchLoading, setSearchLoading] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);

  const searchUsuarios = useCallback(async (
    { current = 1, login, tipo }: SearchUsuariosParams,
  ) => {
    try {
      setSearchLoading(true);

      const response = await api.get<IPage<Usuario>>('/usuarios', {
        params: {
          isPaginate: true,
          current,
          login,
          tipo,
        },
      });

      setPage(response.data);
    } catch (error) {
      message.error('Erro ao carregar os registros. Tente novamente');
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleAdd = useCallback(() => {
    navigate('/usuarios/create');
  }, []);

  const handleSearch = useCallback(async (
    { login, tipo }: HandleSearchParams,
  ) => {
    await searchUsuarios({
      login,
      tipo,
      current: 1,
    });
  }, []);

  const handlePaginate = useCallback(async (current: number) => {
    await searchUsuarios({
      current,
    });
  }, []);

  const handleEdit = useCallback((id: string) => {
    navigate(`/usuarios/${id}`);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      setConfirmDeleteLoading(true);

      await api.delete(`/usuarios/${id}`);

      setPage((prevState) => ({
        ...prevState,
        data: prevState.data
          .filter((item) => item.id !== id),
      }));

      message.success('Registro excluído com sucesso!');
    } catch (error) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, []);

  useEffect(() => {
    searchUsuarios({ current: 1 });
  }, []);

  return (
    <>
      <PageHeader
        ghost={false}
        title="Usuários"
        subTitle="Listagem de Usuários"
        extra={[
          <Button
            key="addButton"
            type="primary"
            onClick={handleAdd}
          >
            Adicionar
          </Button>,
        ]}
      />

      <Form layout="vertical" onFinish={handleSearch}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={4}>
            <Form.Item label="Tipo" name="tipo">
              <Select allowClear>
                <Select.Option value="ADMIN">Administrador</Select.Option>
                <Select.Option value="EDITOR">Editor</Select.Option>
                <Select.Option value="SERVIDOR">Servidor</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={20}>
            <Form.Item label="Login" name="login">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Pesquisar
          </Button>
        </Form.Item>
      </Form>

      <Table
        bordered
        loading={searchLoading}
        rowKey={(record) => record.id}
        dataSource={page.data}
        pagination={{
          pageSize: page.perPage,
          total: page.total,
          onChange: handlePaginate,
        }}
      >
        <Table.Column width="20%" title="Tipo" dataIndex="tipo" key="tipo" />
        <Table.Column width="30%" title="Login" dataIndex="login" key="login" />
        <Table.Column
          width="40%"
          title="Servidor"
          dataIndex="servidor"
          key="servidor"
          render={(servidor) => servidor.nome}
        />
        <Table.Column
          width="10%"
          align="center"
          dataIndex="id"
          render={(id) => (
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => handleEdit(id)}
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
    </>
  );
}
