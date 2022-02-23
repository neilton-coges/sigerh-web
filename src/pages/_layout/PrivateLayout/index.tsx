import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Dropdown, Layout, Menu,
} from 'antd';
import {
  TeamOutlined,
  TableOutlined,
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
            <Menu.Item key="sub1-1" onClick={() => navigate('/servidores')}>
              Servidores
            </Menu.Item>
            <Menu.Item key="sub1-2" onClick={() => navigate('/nomeacoes')}>
              Nomeações
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.SubMenu
            key="sub2"
            icon={<TableOutlined />}
            title="Tabelas Primárias"

          >
            <Menu.Item key="sub2-1" onClick={() => navigate('/cargos')}>
              Cargos
            </Menu.Item>

            <Menu.Item key="sub2-2" onClick={() => navigate('/niveis_cargos')}>
              Niveis Cargos
            </Menu.Item>

            <Menu.Item key="sub2-3" onClick={() => navigate('/cds')}>
              CDS/FG
            </Menu.Item>

            <Menu.Item key="sub2-4" onClick={() => navigate('/jornadas')}>
              Jornadas
            </Menu.Item>

            <Menu.Item key="sub2-5" onClick={() => navigate('/unidades')}>
              Unidades
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.SubMenu
            key="sub3"
            icon={<LockOutlined />}
            title="Acesso"
          >
            <Menu.Item key="sub3-1" onClick={() => navigate('/usuarios')}>
              Usuários
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
