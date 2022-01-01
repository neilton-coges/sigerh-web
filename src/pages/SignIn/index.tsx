import {
  Button, Card, Form, Input,
} from 'antd';

export function SignIn() {
  return (
    <Card
      title="Faça login no sistema"
      style={{ width: 300 }}
    >
      <Form
        layout="vertical"
        onFinish={(data) => console.log(data)}
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
            type="primary"
            htmlType="submit"
          >
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
