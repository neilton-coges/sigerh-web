import React, { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button, Dropdown, Layout, Menu,
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
  const location = useLocation();
  const navigate = useNavigate();

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
        >
          <Menu.SubMenu
            key="sub1"
            title="Recursos Humanos"
            icon={<TeamOutlined />}
          >
            <Menu.Item key="sub1-1">
              Servidores
            </Menu.Item>
            <Menu.Item key="sub1-2">
              Nomeações
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.SubMenu
            key="sub2"
            icon={<TableOutlined />}
            title="Tabelas Primárias"

          >
            <Menu.Item key="sub2-1">
              Cargos
            </Menu.Item>
            <Menu.Item key="syub2-2" onClick={() => navigate('/cds')}>
              CDS/FG
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.SubMenu
            key="sub3"
            icon={<StarOutlined />}
            title="Extras"
          >
            <Menu.Item key="sub3-1">
              Questionários
            </Menu.Item>
            <Menu.Item key="sub3-2">
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
