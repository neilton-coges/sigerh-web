import {
  createContext, ReactNode, useCallback, useEffect, useState,
} from 'react';

import { api } from '../services/api';

type Usuario = {
  id: string;
  nome: string;
  tipo: string;
}

type SignInCredentials = {
  login: string;
  senha: string;
}

type AuthContextData = {
  usuario: Usuario;
  signIn: (data: SignInCredentials) => Promise<void>;
  signOut: () => void;
}

type AuthProviderProps = {
  children: ReactNode;
}

type AuthState = {
  usuario: Usuario;
  token: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const token = localStorage.getItem('@sigerh:token');
    const usuario = localStorage.getItem('@sigerh:usuario');

    if (token && usuario) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      return {
        token,
        usuario: JSON.parse(usuario),
      };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async (
    { login, senha }: SignInCredentials,
  ): Promise<void> => {
    const response = await api.post('/sessoes', {
      login,
      senha,
    });

    const { usuario, token } = response.data;

    localStorage.setItem('@sigerh:token', token);
    localStorage.setItem('@sigerh:usuario', JSON.stringify(usuario));

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    setAuthState({
      usuario,
      token,
    });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@sigerh:token');
    localStorage.removeItem('@sigerh:usuario');

    setAuthState({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider
      value={{ usuario: authState.usuario, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
