// src/auth/RequireAuth.tsx
import React from 'react';
import { useAuth } from './AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';
import type { JSX } from 'react/jsx-runtime';

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  const location = useLocation();

  // Nếu chưa có token thì redirect đến /login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
