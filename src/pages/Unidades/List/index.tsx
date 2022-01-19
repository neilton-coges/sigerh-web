import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Col, Form, Input, message, PageHeader, Popconfirm, Row, Space, Table,
} from 'antd';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { IPage, Unidade } from '../../../models';
import { api } from '../../../services/api';

type SearchUnidadesParams = {
  sigla?: string;
  descricao?: string;
  current?: number;
}

type HandleSearchParams = {
  sigla: string;
  descricao: string;
}

export function ListUnidade() {
  const navigate = useNavigate();

  const [page, setPage] = useState<IPage<Unidade>>({} as IPage<Unidade>);
  const [searchLoading, setSearchLoading] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);

  const searchUnidades = useCallback(async (
    { current = 1, sigla, descricao }: SearchUnidadesParams,
  ) => {
    try {
      setSearchLoading(true);

      const response = await api.get<IPage<Unidade>>('/unidades', {
        params: {
          isPaginate: true,
          current,
          sigla,
          descricao,
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
    navigate('/unidades/create');
  }, []);

  const handleSearch = useCallback(async (
    { sigla, descricao }: HandleSearchParams,
  ) => {
    await searchUnidades({
      sigla,
      descricao,
      current: 1,
    });
  }, []);

  const handlePaginate = useCallback(async (current: number) => {
    await searchUnidades({
      current,
    });
  }, []);

  const handleEdit = useCallback((id: string) => {
    navigate(`/unidades/${id}`);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      setConfirmDeleteLoading(true);

      await api.delete(`/unidades/${id}`);

      setPage((prevState) => ({
        ...prevState,
        data: prevState.data
          .filter((item) => item.id !== id)
          .filter((item) => item.unidadePaiId !== id),
      }));

      message.success('Registro excluído com sucesso!');
    } catch (error) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, []);

  useEffect(() => {
    searchUnidades({ current: 1 });
  }, []);

  return (
    <>
      <PageHeader
        ghost={false}
        title="Unidades"
        subTitle="Listagem de Unidades"
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
            <Form.Item label="Sigla" name="sigla">
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
        <Table.Column width="20%" title="Sigla" dataIndex="sigla" key="sigla" />
        <Table.Column width="70%" title="Descricao" dataIndex="descricao" key="descricao" />
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
