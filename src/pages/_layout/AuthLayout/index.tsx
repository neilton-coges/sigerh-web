import React from 'react';

import * as Styled from './styles';

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Styled.Container>
      {children}
    </Styled.Container>
  );
}
