import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Col, Input, PageHeader, Row, Form, message, Table, Space, Popconfirm, DatePicker,
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import InputMask, { Props as InputMaskProps } from 'react-input-mask';
import { Moment } from 'moment';

import { IPage, Servidor } from '../../../models';
import { api } from '../../../services/api';

type SearchServidoresParams = {
  cpf?: string;
  nome?: string;
  anoProximaProgressao?: number;
  current?: number;
}

type HandleSearchParams = {
  cpf: string;
  nome: string;
  anoProximaProgressao: Moment;
}

export function ListServidor() {
  const navigate = useNavigate();

  const [page, setPage] = useState<IPage<Servidor>>({} as IPage<Servidor>);
  const [searchLoading, setSearchLoading] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);

  const handleAdd = useCallback(() => {
    navigate('/servidores/create');
  }, []);

  const handleEdit = useCallback((id: string) => {
    navigate(`/servidores/${id}`);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      setConfirmDeleteLoading(true);

      await api.delete(`/servidores/${id}`);

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

  const searchServidores = useCallback(async (
    {
      current = 1, cpf, nome, anoProximaProgressao,
    }: SearchServidoresParams,
  ) => {
    try {
      setSearchLoading(true);

      const response = await api.get<IPage<Servidor>>('/servidores', {
        params: {
          isPaginate: true,
          current,
          cpf,
          nome,
          anoProximaProgressao,
        },
      });

      setPage(response.data);
    } catch (error) {
      message.error('Erro ao carregar os registros. Tente novamente');
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async (
    { cpf, nome, anoProximaProgressao }: HandleSearchParams,
  ) => {
    await searchServidores({
      cpf,
      nome,
      anoProximaProgressao: anoProximaProgressao.year(),
      current: 1,
    });
  }, []);

  const handlePaginate = useCallback(async (current: number) => {
    await searchServidores({
      current,
    });
  }, []);

  useEffect(() => {
    searchServidores({ current: 1 });
  }, []);

  return (
    <>
      <PageHeader
        ghost={false}
        title="Servidores"
        subTitle="Listagem de Servidores"
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
          <Col xs={24} sm={24} md={24} lg={6}>
            <Form.Item label="CPF" name="cpf">
              <InputMask mask="999.999.999-99">
                {(inputProps: any) => <Input {...inputProps} />}
              </InputMask>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={12}>
            <Form.Item label="Nome" name="nome">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={6}>
            <Form.Item label="Progressão" name="anoProximaProgressao">
              <DatePicker
                picker="year"
                format="YYYY"
                allowClear
                style={{ width: '100%' }}
                placeholder="Selecione o ano"
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
        <Table.Column width="30%" title="CPF" dataIndex="cpf" key="cpf" />
        <Table.Column width="40%" title="Nome" dataIndex="nome" key="nome" />
        <Table.Column
          width="20%"
          align="center"
          title="Próxima progressão"
          dataIndex="dataProximaProgressaoFormatada"
          key="dataProximaProgressaoFormatada"
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
