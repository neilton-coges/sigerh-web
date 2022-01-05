import { Button, PageHeader } from 'antd';

export function Dashboard() {
  return (
    <PageHeader
      ghost={false}
      title="CDS/FG"
      subTitle="Cargos comissionados e funções gratificadas"
      extra={[
        <Button key="1" type="primary">
          Adicionar
        </Button>,
      ]}
    />
  );
}
