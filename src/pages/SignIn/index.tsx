import {
  Button, Card, Form, Input,
} from 'antd';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Styled from './styles';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/auth';

export function SignIn() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = useCallback(({ login, senha }) => {
    setLoading(true);

    signIn({
      login,
      senha,
    }).then(() => {
      navigate('/dash');
    }).finally(() => setLoading(false));
  }, []);

  return (
    <Styled.Container>
      <Card
        title="Faça login no sistema"
        style={{ width: 300 }}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            required
            label="Login"
            name="login"
            rules={[{ required: true, message: 'Informe seu login.' }]}
          >
            <Input autoFocus />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="senha"
            rules={[{ required: true, message: 'Informe sua senha.' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              block
              loading={loading}
              type="primary"
              htmlType="submit"
            >
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Styled.Container>

  );
}
