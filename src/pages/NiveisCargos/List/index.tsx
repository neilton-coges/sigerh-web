import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  Button, Col, Form, Input, message, PageHeader, Popconfirm, Row, Space, Table,
} from 'antd';

import { IPage, NivelCargo } from '../../../models';
import { api } from '../../../services/api';

type SearchNiveisCargosParams = {
  codigo?: string;
  descricao?: string;
  current?: number;
}

type HandleSearchParams = {
  codigo?: string;
  descricao?: string;
}

export function ListNivelCargo() {
  const navigate = useNavigate();

  const [searchLoading, setSearchLoading] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);

  const [page, setPage] = useState<IPage<NivelCargo>>({} as IPage<NivelCargo>);

  const searchNiveisCargos = useCallback(async ({
    codigo, descricao, current,
  }: SearchNiveisCargosParams) => {
    try {
      setSearchLoading(true);

      const response = await api.get<IPage<NivelCargo>>('/niveis_cargos', {
        params: {
          isPaginate: true,
          codigo,
          descricao,
          current,
        },
      });

      setPage(response.data);
    } catch (err) {
      message.error('Erro ao carregar os registros. Tente novamente');
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async ({ codigo, descricao }: HandleSearchParams) => {
    await searchNiveisCargos({
      codigo,
      descricao,
      current: 1,
    });
  }, []);

  const handlePaginate = useCallback(async (current: number) => {
    await searchNiveisCargos({
      current,
    });
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      setConfirmDeleteLoading(true);

      await api.delete(`/niveis_cargos/${id}`);

      setPage((prevState) => ({
        ...prevState,
        data: prevState.data.filter((item) => item.id !== id),
      }));

      message.success('Registro excluído com sucesso!');
    } catch (error) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, []);

  const handleEdit = useCallback((id: string) => {
    navigate(`/niveis_cargos/${id}`);
  }, []);

  useEffect(() => {
    searchNiveisCargos({
      current: 1,
    });
  }, []);

  return (
    <>
      <PageHeader
        ghost={false}
        title="Niveis Cargos"
        subTitle="Listagem de niveis de cargos"
        extra={[
          <Button
            key="addButton"
            type="primary"
            onClick={() => navigate('/niveis_cargos/create')}
          >
            Adicionar
          </Button>,
        ]}
      />

      <Form layout="vertical" onFinish={handleSearch}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={4}>
            <Form.Item label="Código" name="codigo">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={20}>
            <Form.Item label="Descrição" name="descricao">
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
        <Table.Column width="10%" title="Código" dataIndex="codigo" key="codigo" />
        <Table.Column width="80%" title="Descrição" dataIndex="descricao" key="descricao" />
        <Table.Column
          width="10%"
          align="center"
          dataIndex="id"
          render={(id) => (
            <Space>
              <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(id)} />

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
