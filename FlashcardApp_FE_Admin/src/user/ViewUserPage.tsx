// src/components/ViewUserPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface User {
  userId: string;
  fullName: string;
  address: string;
  email: string;
  status: string;
}

export default function ViewUserPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { api } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    api
      .get(`/api/v1/admin/users/${userId}`)
      .then(res => {
        // response: { data: { ...user fields... } }
        const payload = res.data.data;
        setUser({
          userId: payload.userId,
          fullName: payload.fullName,
          address: payload.address,
          email: payload.email,
          status: payload.status,
        });
      })
      .catch(err => {
        console.error('Fetch user error:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [api, userId]);

  return (
    <div className="max-w-md mx-auto p-4">
      {loading ? (
        <p>Đang tải thông tin người dùng...</p>
      ) : error ? (
        <p className="text-red-500">Lỗi: {error}</p>
      ) : user ? (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin Người dùng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><strong>User ID:</strong> {user.userId}</div>
            <div><strong>Full Name:</strong> {user.fullName}</div>
            <div><strong>Address:</strong> {user.address}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Status:</strong> {user.status}</div>
          </CardContent>
        </Card>
      ) : (
        <p>Không tìm thấy người dùng.</p>
      )}
      <div className="mt-4 text-right">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    </div>
  );
}
