import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import {
  Button, message, Popconfirm, Table,
} from 'antd';

import { ReajusteClasseNivelCargo } from '../../../../../models';
import { api } from '../../../../../services/api';

export function ListReajusteClasseNivelCargo() {
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [
    reajustesClassesNiveisCargos,
    setReajustesClassesNiveisCargos,
  ] = useState<ReajusteClasseNivelCargo[]>([]);

  useEffect(() => {
    const loadReajustesClassesNiveisCargos = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/niveis_cargos/${params.nivelCargoId}/classes/${params.classeNivelCargoId}/reajustes`,
        );

        setReajustesClassesNiveisCargos(response.data);
      } catch (err) {
        message.error('Erro ao carregar os registros. Tente novamente');
      } finally {
        setLoading(false);
      }
    };

    loadReajustesClassesNiveisCargos();
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      setConfirmDeleteLoading(true);

      await api.delete(
        `/niveis_cargos/${params.nivelCargoId}/classes/${params.classeNivelCargoId}/reajustes/${id}`,
      );

      setReajustesClassesNiveisCargos(
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
      dataSource={reajustesClassesNiveisCargos}
      pagination={false}
      loading={loading}
    >
      <Table.Column
        width="80%"
        align="right"
        title="Percentual (%)"
        dataIndex="percentual"
        key="percentual"
        render={(value) => Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      />
      <Table.Column
        width="10%"
        align="center"
        dataIndex="id"
        render={(id, _, index) => (
          <Popconfirm
            placement="left"
            title="Você tem certeza que deseja excluir? Os valores serão reajustados para o último percentual cadastrado."
            onConfirm={() => handleDelete(id)}
            okButtonProps={{
              loading: confirmDeleteLoading,
            }}
            disabled={index !== reajustesClassesNiveisCargos.length - 1}
          >
            <Button
              disabled={index !== reajustesClassesNiveisCargos.length - 1}
              type="primary"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        )}
      />
    </Table>
  );
}
