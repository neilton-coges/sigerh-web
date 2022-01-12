import {
  Button,
  PageHeader,
  Form,
  Input,
  Select,
  Table,
  Row,
  Col,
  Space,
  Popconfirm,
  message,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { api } from '../../../services/api';
import { CdsFg, IPage } from '../../../models';

type SearchCdsFgsParams = {
  tipo?: string;
  simbologia?: string;
  current?: number;
}

export function ListCdsFg() {
  const navigate = useNavigate();

  const [page, setPage] = useState<IPage<CdsFg>>({} as IPage<CdsFg>);
  const [searchLoading, setSearchLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const searchCdsFgs = useCallback(async (
    { current = 1, simbologia, tipo }: SearchCdsFgsParams,
  ) => {
    try {
      setSearchLoading(true);

      const response = await api.get<IPage<CdsFg>>('/cds_fgs', {
        params: {
          isPaginate: true,
          current,
          simbologia,
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

  const onSearch = useCallback(async ({ tipo, simbologia }) => {
    await searchCdsFgs({
      tipo,
      simbologia,
      current: 1,
    });
  }, []);

  const onPaginate = useCallback(async (current: number) => {
    await searchCdsFgs({
      current,
    });
  }, []);

  const onEdit = useCallback((id: string) => {
    navigate(`/cds/${id}`);
  }, []);

  const onDelete = useCallback(async (id: string) => {
    try {
      setConfirmLoading(true);

      await api.delete(`/cds_fgs/${id}`);

      setPage((prevState) => ({
        ...prevState,
        data: prevState.data.filter((item) => item.id !== id),
      }));

      message.success('Registro excluído com sucesso!');
    } catch (error) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setConfirmLoading(false);
    }
  }, []);

  useEffect(() => {
    searchCdsFgs({
      current: 1,
    });
  }, []);

  if (!page) {
    return <div />;
  }

  return (
    <>
      <PageHeader
        ghost={false}
        title="CDS e FG"
        subTitle="Cargos comissionados e funções gratificadas"
        extra={[
          <Button key="addButton" type="primary" onClick={() => navigate('/cds/create')}>
            Adicionar
          </Button>,
        ]}
      />

      <Form layout="vertical" onFinish={onSearch}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={4}>
            <Form.Item label="Tipo" name="tipo">
              <Select allowClear>
                <Select.Option value="CDS">CDS</Select.Option>
                <Select.Option value="FG">FG</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={20}>
            <Form.Item label="Simbologia" name="simbologia">
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
          onChange: onPaginate,
        }}
      >
        <Table.Column width="10%" title="Tipo" dataIndex="tipo" key="tipo" />
        <Table.Column width="60%" title="Simbologia" dataIndex="simbologia" key="simbologia" />
        <Table.Column width="10%" align="right" title="Vagas" dataIndex="quantidadeVagas" key="quantidadeVagas" />
        <Table.Column width="10%" align="right" title="Nomeados" dataIndex="quantidadeNomeados" key="quantidadeNomeados" />
        <Table.Column
          width="10%"
          align="center"
          dataIndex="id"
          render={(value) => (
            <Space>
              <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(value)} />

              <Popconfirm
                placement="left"
                title="Você tem certeza que deseja excluir?"
                onConfirm={() => onDelete(value)}
                okButtonProps={{
                  loading: confirmLoading,
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
