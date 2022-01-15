import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  Button, message, Popconfirm, Space, Table,
} from 'antd';

import { PadraoClasseNivelCargo } from '../../../../../models';
import { api } from '../../../../../services/api';

export function ListPadraoClasseNivelCargo() {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [
    padroesClassesNiveisCargos,
    setPadroesClassesNiveisCargos,
  ] = useState<PadraoClasseNivelCargo[]>([]);

  useEffect(() => {
    const loadPadroesClassesNiveisCargos = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/niveis_cargos/${params.nivelCargoId}/classes/${params.classeNivelCargoId}/padroes`,
        );

        setPadroesClassesNiveisCargos(response.data);
      } catch (err) {
        message.error('Erro ao carregar os registros. Tente novamente');
      } finally {
        setLoading(false);
      }
    };

    loadPadroesClassesNiveisCargos();
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      setConfirmDeleteLoading(true);

      await api.delete(
        `/niveis_cargos/${params.nivelCargoId}/classes/${params.classeNivelCargoId}/padroes/${id}`,
      );

      setPadroesClassesNiveisCargos(
        (prevState) => prevState.filter((item) => item.id !== id),
      );

      message.success('Registro excluído com sucesso!');
    } catch (error) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, []);

  const handleEdit = useCallback((id: string) => {
    navigate(`padroes/${id}`);
  }, []);

  return (
    <Table
      bordered
      rowKey={(record) => record.id}
      dataSource={padroesClassesNiveisCargos}
      pagination={false}
      loading={loading}
    >
      <Table.Column width="10%" title="Código" dataIndex="codigo" key="codigo" />
      <Table.Column width="40%" title="Descrição" dataIndex="descricao" key="descricao" />
      <Table.Column
        width="20%"
        align="right"
        title="Valor"
        dataIndex="valor"
        render={(value) => Number(value).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
        key="valor"
      />
      <Table.Column
        width="20%"
        align="right"
        title="Valor Reajustado"
        dataIndex="valorReajustado"
        render={(value) => Number(value).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
        key="valor"
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
  );
}
