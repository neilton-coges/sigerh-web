import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, message, PageHeader, Popconfirm, Space, Table,
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Jornada } from '../../../models';
import { api } from '../../../services/api';

export function ListJornada() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [jornadas, setJornadas] = useState<Jornada[]>([]);

  const handleAdd = useCallback(() => {
    navigate('/jornadas/create');
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      setConfirmDeleteLoading(true);

      await api.delete(`/jornadas/${id}`);

      setJornadas((prevState) => (prevState.filter((item) => item.id !== id)));

      message.success('Registro excluído com sucesso!');
    } catch (error) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, []);

  const handleEdit = useCallback((id: string) => {
    navigate(`/jornadas/${id}`);
  }, []);

  useEffect(() => {
    const loadJornadas = async () => {
      try {
        setLoading(true);

        const response = await api.get<Jornada[]>('/jornadas');

        setJornadas(response.data);
      } catch (err) {
        message.error('Erro ao carregar os registros. Tente novamente');
      } finally {
        setLoading(false);
      }
    };

    loadJornadas();
  }, []);

  return (
    <>
      <PageHeader
        ghost={false}
        title="Jornadas"
        subTitle="Listagem de Jornadas"
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

      <Table
        bordered
        loading={loading}
        rowKey={(record) => record.id}
        dataSource={jornadas}
        pagination={false}
      >
        <Table.Column width="90%" title="Nome" dataIndex="descricao" key="descricao" />
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
