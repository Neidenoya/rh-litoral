import { createContext, useContext, useState, ReactNode } from 'react';
import { api, tokenStore } from '../lib/api';
import type { UsuarioSessao } from '../types';

interface AuthCtx {
  usuario: UsuarioSessao | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>(null!);
const USER_KEY = 'rh_litoral_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSessao | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as UsuarioSessao) : null;
  });

  async function login(email: string, senha: string) {
    const res = await api<{ access_token: string; usuario: UsuarioSessao }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, senha }) },
    );
    tokenStore.set(res.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.usuario));
    setUsuario(res.usuario);
  }

  function logout() {
    tokenStore.clear();
    localStorage.removeItem(USER_KEY);
    setUsuario(null);
  }

  return <Ctx.Provider value={{ usuario, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
