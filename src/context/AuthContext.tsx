import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { api, ApiError } from '../lib/api';
import { AuthContext, type AuthUser } from '../hooks/useAuth';

interface MeResponse {
  user: AuthUser;
}

interface LoginResponse {
  user: AuthUser;
  token: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api<MeResponse>('GET', '/api/auth/me')
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch((err: unknown) => {
        if (!(err instanceof ApiError) || err.status !== 401) {
          console.error('Failed to resolve current user', err);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api<LoginResponse>('POST', '/api/auth/login', {
      email,
      password,
    });
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    await api('POST', '/api/auth/logout').catch(() => undefined);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
