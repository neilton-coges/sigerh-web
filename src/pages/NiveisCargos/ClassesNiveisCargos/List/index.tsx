import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  Button, message, Popconfirm, Space, Table,
} from 'antd';

import { ClasseNivelCargo } from '../../../../models';
import { api } from '../../../../services/api';

export function ListClasseNivelCargo() {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [classesNiveisCargos, setClassesNiveisCargos] = useState<ClasseNivelCargo[]>([]);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoading(true);

        const response = await api.get<ClasseNivelCargo[]>(
          `/niveis_cargos/${params.nivelCargoId}/classes`,
        );

        setClassesNiveisCargos(response.data);
      } catch (err) {
        message.error('Erro ao carregar os registros. Tente novamente');
      } finally {
        setLoading(false);
      }
    };

    loadClasses();
  }, []);

  const handleEdit = useCallback((id: string) => {
    navigate(`classes/${id}`);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      setConfirmDeleteLoading(true);

      await api.delete(
        `/niveis_cargos/${params.nivelCargoId}/classes/${id}`,
      );

      setClassesNiveisCargos(
        (prevState) => prevState.filter((item) => item.id !== id),
      );

      message.success('Registro excluído com sucesso!');
    } catch (error) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, []);

  return (
    <Table
      bordered
      rowKey={(record) => record.id}
      dataSource={classesNiveisCargos}
      pagination={false}
      loading={loading}
    >
      <Table.Column width="10%" title="Código" dataIndex="codigo" key="codigo" />
      <Table.Column width="80%" title="Descrição" dataIndex="descricao" key="descricao" />
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
  );
}
