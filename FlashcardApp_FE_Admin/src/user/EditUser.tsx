// src/components/EditUserPage.tsx
import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

interface User {
  userId: string;
  fullName: string;
  email: string;
  status: string;
}

export default function EditUserPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { api } = useAuth();

  const [formData, setFormData] = useState({ fullName: '', email: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    api.get(`/api/v1/admin/users/${userId}`)
      .then(res => {
        const payload = res.data.data;
        setFormData({ fullName: payload.fullName, email: payload.email, status: payload.status });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [api, userId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSubmitting(true);
    api.patch(`/api/v1/admin/users/${userId}`, {
      fullName: formData.fullName,
      email: formData.email,
      status: formData.status,
    })
      .then(() => {
        toast.success('Cập nhật người dùng thành công!');
        navigate('/user');
      })
      .catch(err => {
        setError(err.message);
        toast.error('Cập nhật thất bại: ' + err.message);
      })
      .finally(() => setSubmitting(false));
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div className="text-red-500">Lỗi: {error}</div>;

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">Chỉnh sửa Người dùng</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Họ và tên</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="status">Trạng thái</Label>
          <Input
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          />
        </div>
        <div className="flex space-x-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
          <Button variant="secondary" type="button" onClick={() => navigate(-1)}>
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
}
