// src/auth/AuthProvider.tsx
import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    type ReactNode,
  } from 'react';
  import axios, { type AxiosInstance, type AxiosRequestConfig, AxiosError } from 'axios';
  
  const BASE_URL = 'http://localhost:9090';
  
  interface AuthContextType {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    api: AxiosInstance;
  }
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(
      () => localStorage.getItem('accessToken')
    );
    const [refreshToken, setRefreshToken] = useState<string | null>(
      () => localStorage.getItem('refreshToken')
    );
  
    const api = useMemo(() => {
      const instance = axios.create({
        baseURL: BASE_URL,
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
      });
  
      // Gắn luôn accessToken mới nhất trước mỗi request
      instance.interceptors.request.use(config => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error));
  
      // Bắt 401 để tự động refresh
      instance.interceptors.response.use(
        (res) => res,
        async (error) => {
          const originalConfig = error.config as AxiosRequestConfig & { _retry?: boolean };
          // Chỉ với 401, chưa retry, và không phải request đang gọi /auth/refresh
          if (
            error.response && error.response.status === 401 &&
            !error.config._retry
          ) {
            originalConfig._retry = true;
            try {
              // Gọi chính xác endpoint refresh
              const resp = await instance.post(
                `api/v1/auth/refresh`,
              );
              const newAccessToken = resp.data.accessToken as string;
              // Lưu accessToken mới
              setToken(newAccessToken);
              
              localStorage.setItem('accessToken', newAccessToken);
              // Cập nhật cả header mặc định của instance
              instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
              // Retry lại request gốc với header mới
              if (originalConfig.headers) {
                (originalConfig.headers as any).Authorization = `Bearer ${newAccessToken}`;
              }
              return instance(error.config);
            } catch (err) {
              // Nếu refresh cũng fail thì logout
              logout();
              return Promise.reject(err);
            }
          }
          return Promise.reject(error);
        }
      );
  
      return instance;
    }, [refreshToken]);
  
    const login = async (email: string, password: string) => {
      const res = await api.post('/api/v1/admin/auth/login', { email, password });
      const data = res.data as { accessToken: string; refreshToken?: string };
      setToken(data.accessToken);
      localStorage.setItem('accessToken', data.accessToken);
  
      if (data.refreshToken) {
        setRefreshToken(data.refreshToken);
        localStorage.setItem('refreshToken', data.refreshToken);
      }
    };
  
    const logout = () => {
      setToken(null);
      setRefreshToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete api.defaults.headers.common['Authorization'];
    };
  
    return (
      <AuthContext.Provider value={{ token, login, logout, api }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
  };
  