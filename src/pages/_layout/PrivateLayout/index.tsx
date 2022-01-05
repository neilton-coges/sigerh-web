import React, { useCallback } from 'react';
import {
  Button, Dropdown, Layout, Menu, Space, Typography,
} from 'antd';
import {
  TeamOutlined,
  TableOutlined,
  StarOutlined,
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons';

import { useAuth } from '../../../hooks/auth';
import styles from './PrivateLayout.module.css';

interface PrivateLayoutProps {
  children: React.ReactNode
}

export function PrivateLayout({ children }: PrivateLayoutProps) {
  const { usuario, signOut } = useAuth();

  const handleSignOut = useCallback(() => {
    signOut();
  }, []);

  const userMenu = (
    <Menu>
      <Menu.Item key="0" icon={<LockOutlined />}>
        Alterar senha
      </Menu.Item>
      <Menu.Item
        key="1"
        icon={<LogoutOutlined />}
        onClick={handleSignOut}
      >
        Sair
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className={styles.container}>
      <Layout.Sider
        breakpoint="lg"
        collapsedWidth="80"
        width={220}
      >
        <div style={{
          height: 32,
          margin: 16,
          background: 'rgba(255, 255, 255, 0.3)',
        }}
        />

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
        >
          <Menu.SubMenu
            key="sub1"
            title="Recursos Humanos"
            icon={<TeamOutlined />}
          >
            <Menu.Item key="1">
              Servidores
            </Menu.Item>
            <Menu.Item key="2">
              Nomeações
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.SubMenu
            key="sub2"
            icon={<TableOutlined />}
            title="Tabelas Primárias"
          >
            <Menu.Item key="3">
              Cargos
            </Menu.Item>
            <Menu.Item key="4">
              CDS/FG
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.SubMenu
            key="sub3"
            icon={<StarOutlined />}
            title="Extras"
          >
            <Menu.Item key="5">
              Questionários
            </Menu.Item>
            <Menu.Item key="6">
              Atualização Cadastral
            </Menu.Item>
          </Menu.SubMenu>

        </Menu>
      </Layout.Sider>

      <Layout>
        <Layout.Header className={styles.header}>
          <Dropdown overlay={userMenu}>
            <Button type="text">
              Olá,
              {' '}
              {usuario.nome}
              <DownOutlined />
            </Button>
          </Dropdown>
        </Layout.Header>

        <Layout.Content className={styles.content}>
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
