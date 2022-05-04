import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Col, Form, Input, message, PageHeader, Row, Select, Table,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { api } from '../../../services/api';
import { IPage, Nomeacao } from '../../../models';

type SearchNomeacoesParams = {
  tipo?: string;
  nomeServidor?: string;
  current?: number;
}

type HandleSearchParams = {
  tipo: string;
  nomeServidor: string;
}

const TipoNomeacao = {
  NOMEACAO: 'Nomeação',
  EXONERACAO: 'Exoneração',
} as {
  [key: string]: string;
};

export function ListNomeacao() {
  const navigate = useNavigate();

  const [page, setPage] = useState<IPage<Nomeacao>>({} as IPage<Nomeacao>);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchNomeacoes = useCallback(async (
    { current = 1, tipo, nomeServidor }: SearchNomeacoesParams,
  ) => {
    try {
      setSearchLoading(true);

      const response = await api.get<IPage<Nomeacao>>('/nomeacoes', {
        params: {
          isPaginate: true,
          current,
          tipo,
          nomeServidor,
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
    navigate('/nomeacoes/create');
  }, []);

  const handleSearch = useCallback(async (
    { tipo, nomeServidor }: HandleSearchParams,
  ) => {
    await searchNomeacoes({
      tipo,
      nomeServidor,
      current: 1,
    });
  }, []);

  const handlePaginate = useCallback(async (current: number) => {
    await searchNomeacoes({
      current,
    });
  }, []);

  const handleEdit = useCallback((id: string) => {
    navigate(`/nomeacoes/${id}`);
  }, []);

  useEffect(() => {
    searchNomeacoes({ current: 1 });
  }, []);

  return (
    <>
      <PageHeader
        ghost={false}
        title="Nomeações"
        subTitle="Listagem de Nomeações"
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
                <Select.Option value="NOMEACAO">Nomeação</Select.Option>
                <Select.Option value="EXONERACAO">Exoneração</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={20}>
            <Form.Item label="Nome" name="nomeServidor">
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
        <Table.Column
          width="20%"
          title="Data"
          dataIndex="data"
          key="data"
          render={(data) => new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        />
        <Table.Column width="20%" title="Tipo" dataIndex="tipo" key="tipo" render={(tipo) => TipoNomeacao[tipo]} />
        <Table.Column width="40%" title="Servidor" dataIndex="servidor" key="servidor" render={(servidor) => servidor.nome} />
        <Table.Column
          width="10%"
          align="center"
          dataIndex="id"
          render={(id) => (
            <Button type="primary" icon={<SearchOutlined />} onClick={() => handleEdit(id)} />
          )}
        />
      </Table>
    </>
  );
}
