// frontend/src/components/ProfileSettings.tsx
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'react-toastify';

interface Profile {
  fullName: string;
  email: string;
}

export default function ProfileSettings() {
  const [profile, setProfile] = useState<Profile>({
    fullName: "",
    email: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Lần đầu vào component, fetch dữ liệu profile từ API
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Không tải được profile");
        const data = await res.json();
        setProfile({ fullName: data.fullName, email: data.email });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Cập nhật thất bại");
      }
      toast.success("Cập nhật thành công!");
      setSuccess("Cập nhật thành công!");
    } catch (err: any) {
      setError(err.message);
      toast.error("Cập nhật thất bại: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Đang tải thông tin...</p>;
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cài đặt Profile</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Họ và tên</label>
          <Input
            value={profile.fullName}
            onChange={(e) =>
              setProfile({ ...profile, fullName: e.currentTarget.value })
            }
            placeholder="Nhập họ và tên"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <Input
            type="email"
            value={profile.email}
            onChange={(e) =>
              setProfile({ ...profile, email: e.currentTarget.value })
            }
            placeholder="Nhập email"
            required
          />
        </div>

        <Button type="submit" disabled={saving} className="w-full">
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </form>
    </div>
  );
}
