import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface UserInfo {
  username?: string;
  email?: string;
  name?: string;
  surname?: string;
  role?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      authService.getUserInfo().then((data) => {
        setUser({
          username: data.username,
          email: data.email,
          name: data.name,
          surname: data.surname,
          role: data.role,
        });
      }).catch(() => setUser(null));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const loginResponse = await authService.login(username, password);
    setIsAuthenticated(true);
    setUser({
      username,
      email: loginResponse.email,
      name: loginResponse.name,
      surname: loginResponse.surname,
      role: loginResponse.role,
    });
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}; 