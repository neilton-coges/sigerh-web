import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../hooks/auth';
import { PrivateLayout } from '../pages/_layout/PrivateLayout';

interface PrivateRouteProps {
  component: React.ComponentType;
}

export function PrivateRoute({ component: Component }: PrivateRouteProps) {
  const { usuario } = useAuth();
  const isAuthenticated = !!usuario;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <PrivateLayout>
      <Component />
    </PrivateLayout>
  );
}
