import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
  message,
  PageHeader,
  Select,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

import { Servidor, Usuario } from '../../../models';
import { api } from '../../../services/api';

type HandleEditParams = {
  tipo: string;
  senha: string;
  confirmacaoSenha: string;
}

export function EditUsuario() {
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [editLoading, setEditLoading] = useState(false);
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [usuario, setUsuario] = useState<Usuario>();

  useEffect(() => {
    const loadServidores = async () => {
      const response = await api.get<Servidor[]>('/servidores');
      setServidores(response.data);
    };

    const loadUsuario = async () => {
      const response = await api.get<Usuario>(`/usuarios/${params.usuarioId}`);
      setUsuario(response.data);
    };

    loadServidores();
    loadUsuario();
  }, []);

  const handleGoBack = useCallback(() => {
    navigate('/usuarios');
  }, []);

  const handleSelectServidor = useCallback((children: string) => {
    const [cpf] = children.split(' -');

    form.setFieldsValue({
      login: cpf,
    });
  }, [form]);

  const handleEdit = useCallback(async ({
    tipo,
    senha,
    confirmacaoSenha,
  }: HandleEditParams) => {
    try {
      setEditLoading(true);

      const response = await api.put<Usuario>(`/usuarios/${params.usuarioId}`, {
        tipo,
        senha,
        confirmacaoSenha,
      });

      setUsuario(response.data);

      message.success('Registro salvo com sucesso!');
    } catch (error) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setEditLoading(false);
    }
  }, []);

  if (!usuario) {
    return <div />;
  }

  return (
    <>
      <PageHeader
        ghost={false}
        title="Editar Usuário"
        subTitle="Edição de usuário"
        extra={[
          <Button
            key="backButton"
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
          >
            Voltar
          </Button>,
        ]}
      />

      <Form
        layout="vertical"
        form={form}
        initialValues={usuario}
        onFinish={handleEdit}
      >

        <Form.Item
          required
          label="Servidor"
          name="servidorId"
          rules={[{
            required: true, message: 'Informe o servidor.',
          }]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            disabled
          >
            {servidores.map((servidor) => (
              <Select.Option
                key={servidor.id}
                value={servidor.id}
              >
                {`${servidor.cpf} - ${servidor.nome}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Login"
          name="login"
        >
          <Input readOnly />
        </Form.Item>

        <Form.Item
          label="Tipo"
          name="tipo"
          rules={[{
            required: true, message: 'Informe o tipo.',
          }]}
        >
          <Select>
            <Select.Option value="ADMIN">Administrador</Select.Option>
            <Select.Option value="EDITOR">Editor</Select.Option>
            <Select.Option value="SERVIDOR">Servidor</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Senha"
          name="senha"
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          dependencies={['senha']}
          label="Confirmação de senha"
          name="confirmacaoSenha"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue('senha') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Senhas não correspondem.'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button
            loading={editLoading}
            type="primary"
            htmlType="submit"
          >
            Salvar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
