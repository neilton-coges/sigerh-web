import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Col, Form, Input, message, PageHeader, Popconfirm, Row, Select, Space, Table,
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { Cargo, IPage } from '../../../models';
import { api } from '../../../services/api';

type SearchCargosParams = {
  tipo?: string;
  descricao?: string;
  current?: number;
}

type HandleSearchParams = {
  tipo: string;
  descricao: string;
}

const TipoCargo = {
  EFETIVO: 'Efetivo',
  COMISSAO: 'Comissão',
  FUNCAO_GRATIFICADA: 'Função Gratificada',
} as {
  [key: string]: string;
};

export function ListCargo() {
  const navigate = useNavigate();

  const [page, setPage] = useState<IPage<Cargo>>({} as IPage<Cargo>);
  const [searchLoading, setSearchLoading] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);

  const searchCargos = useCallback(async (
    { current = 1, descricao, tipo }: SearchCargosParams,
  ) => {
    try {
      setSearchLoading(true);

      const response = await api.get<IPage<Cargo>>('/cargos', {
        params: {
          isPaginate: true,
          current,
          descricao,
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
    navigate('/cargos/create');
  }, []);

  const handleSearch = useCallback(async (
    { tipo, descricao }: HandleSearchParams,
  ) => {
    await searchCargos({
      tipo,
      descricao,
      current: 1,
    });
  }, []);

  const handlePaginate = useCallback(async (current: number) => {
    await searchCargos({
      current,
    });
  }, []);

  const handleEdit = useCallback((id: string) => {
    navigate(`/cargos/${id}`);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      setConfirmDeleteLoading(true);

      await api.delete(`/cargos/${id}`);

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

  useEffect(() => {
    searchCargos({ current: 1 });
  }, []);

  return (
    <>
      <PageHeader
        ghost={false}
        title="Cargos"
        subTitle="Listagem de Cargos"
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
                <Select.Option value="EFETIVO">Efetivo</Select.Option>
                <Select.Option value="COMISSAO">Comissão</Select.Option>
                <Select.Option value="FUNCAO_GRATIFICADA">Função Gratificada</Select.Option>
              </Select>
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
        <Table.Column width="60%" title="Descrição" dataIndex="descricao" key="descricao" />
        <Table.Column width="30%" title="Tipo" dataIndex="tipo" key="tipo" render={(value) => TipoCargo[value]} />
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
