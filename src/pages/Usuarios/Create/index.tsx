import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Button, Form, Input, message, PageHeader, Select,
} from 'antd';
import { api } from '../../../services/api';
import { Servidor, Usuario } from '../../../models';

type HandleCreateParams = {
  tipo: string;
  login: string;
  senha: string;
  confirmacaoSenha: string;
  servidorId: string;
}

export function CreateUsuario() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [createLoading, setCreateLoading] = useState(false);
  const [servidores, setServidores] = useState<Servidor[]>([]);

  useEffect(() => {
    const loadServidores = async () => {
      const response = await api.get<Servidor[]>('/servidores');
      setServidores(response.data);
    };

    loadServidores();
  }, []);

  const handleGoBack = useCallback(() => {
    navigate('/usuarios');
  }, []);

  const handleCreate = useCallback(async ({
    tipo,
    login,
    senha,
    confirmacaoSenha,
    servidorId,
  }: HandleCreateParams) => {
    try {
      setCreateLoading(true);

      const response = await api.post<Usuario>('/usuarios', {
        tipo,
        login,
        senha,
        confirmacaoSenha,
        servidorId,
      });

      message.success('Registro criado com sucesso!');

      navigate(`/usuarios/${response.data.id}`);
    } catch (error) {
      message.error('Ocorreu um erro ao executar esta ação. Tente novamente');
    } finally {
      setCreateLoading(false);
    }
  }, []);

  const handleSelectServidor = useCallback((children: string) => {
    const [cpf] = children.split(' -');

    form.setFieldsValue({
      login: cpf,
    });
  }, [form]);

  return (
    <>
      <PageHeader
        ghost={false}
        title="Criar Usuário"
        subTitle="Criação de usuário"
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
        onFinish={handleCreate}
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
            onSelect={(_: any, option: any) => handleSelectServidor(String(option.children))}
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
          required
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
          required
          label="Senha"
          name="senha"
          rules={[{ required: true, message: 'Informe a senha' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          required
          dependencies={['senha']}
          label="Confirmação de senha"
          name="confirmacaoSenha"
          rules={[
            {
              required: true,
              message: 'Informe a confirmação de senha.',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('senha') === value) {
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
            loading={createLoading}
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
