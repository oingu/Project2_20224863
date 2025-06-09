// src/components/AddUserPage.tsx
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface FormData {
  fullName: string;
  email: string;
  status: string;
}

export default function AddUserPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({ fullName: '', email: '', status: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Thêm user thất bại');
      // Optionally get created user: const newUser = await res.json();
      navigate('/users');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Thêm Người dùng</h1>
      {error && <div className="text-red-500">Lỗi: {error}</div>}
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
            {submitting ? 'Đang thêm...' : 'Thêm'}
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
}
