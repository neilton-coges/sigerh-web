import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Col, Form, message, PageHeader, Row, Select, DatePicker, Table, Space,
} from 'antd';
import { Moment } from 'moment';
import { SearchOutlined } from '@ant-design/icons';
import { IPage, Progressao, Servidor } from '../../../models';
import { api } from '../../../services/api';

type SearchProgressoesParams = {
  servidorId?: string;
  dataProgressaoInicio?: Date;
  dataProgressaoFim?: Date;
  current?: number;
}

type HandleSearchParams = {
  servidorId?: string;
  dataProgressao: Moment[];
}

export function ListProgressao() {
  const navigate = useNavigate();

  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [page, setPage] = useState<IPage<Progressao>>({} as IPage<Progressao>);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleAdd = useCallback(() => {
    navigate('/progressoes/create');
  }, []);

  const searchProgressoes = useCallback(async (
    {
      current = 1, servidorId, dataProgressaoInicio, dataProgressaoFim,
    }: SearchProgressoesParams,
  ) => {
    try {
      setSearchLoading(true);

      const response = await api.get<IPage<Progressao>>('/progressoes', {
        params: {
          isPaginate: true,
          current,
          servidorId,
          dataProgressaoInicio,
          dataProgressaoFim,
        },
      });

      setPage(response.data);
    } catch (error) {
      message.error('Erro ao carregar os registros. Tente novamente');
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const loadServidores = useCallback(async () => {
    const response = await api.get<Servidor[]>('/servidores');
    setServidores(response.data);
  }, []);

  const handleSearch = useCallback(async (
    { servidorId, dataProgressao }: HandleSearchParams,
  ) => {
    const dataProgressaoInicio = dataProgressao && dataProgressao[0].toDate();
    const dataProgressaoFim = dataProgressao && dataProgressao[1].toDate();

    await searchProgressoes({
      servidorId,
      dataProgressaoInicio,
      dataProgressaoFim,
      current: 1,
    });
  }, []);

  const handlePaginate = useCallback(async (current: number) => {
    await searchProgressoes({
      current,
    });
  }, []);

  const handleEdit = useCallback((id: string) => {
    navigate(`/progressoes/${id}`);
  }, []);

  useEffect(() => {
    searchProgressoes({ current: 1 });
    loadServidores();
  }, []);

  return (
    <>
      <PageHeader
        ghost={false}
        title="Progressões"
        subTitle="Listagem de Progressões"
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
          <Col xs={24} sm={24} md={24} lg={12}>
            <Form.Item label="Servidor" name="servidorId">
              <Select allowClear showSearch optionFilterProp="children">
                {servidores.map((servidor) => (
                  <Select.Option key={servidor.id} value={servidor.id}>{`${servidor.cpf} - ${servidor.nome}`}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={12}>
            <Form.Item label="Data progressão" name="dataProgressao">
              <DatePicker.RangePicker
                style={{ width: '100%' }}
                placeholder={['De', 'Até']}
                format="DD/MM/YYYY"
              />
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
          width="60%"
          title="Servidor"
          dataIndex="servidor"
          key="servidor"
          render={(value) => `${value.cpf} - ${value.nome}`}
        />
        <Table.Column
          width="30%"
          title="Data progressão"
          dataIndex="dataProgressaoFormatada"
          key="dataProgressaoFormatada"
        />
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
