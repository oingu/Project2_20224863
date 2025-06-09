// frontend/src/components/EditProfile.tsx
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileData {
  avatarUrl: string;
  fullName: string;
  nickname: string;
  email: string;
}

export default function Profile() {
  // state profile
  const [profile, setProfile] = useState<ProfileData>({
    avatarUrl: "",
    fullName: "",
    nickname: "",
    email: "",
  });
  // ảnh mới (File) và preview URL
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // mật khẩu
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // loading / feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Lần đầu mount: fetch profile hiện tại
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        setProfile({
          avatarUrl: data.avatarUrl,
          fullName: data.fullName,
          nickname: data.nickname,
          email: data.email,
        });
        setAvatarPreview(data.avatarUrl);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  // Khi user chọn file mới, tạo URL preview
  useEffect(() => {
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const formData = new FormData();
      if (avatarFile) formData.append("avatar", avatarFile);
      formData.append("fullName", profile.fullName);
      formData.append("nickname", profile.nickname);
      formData.append("email", profile.email);
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");
      setSuccess("Cập nhật thành công!");
      // nếu API trả về URL avatar mới, update lại
      const result = await res.json();
      if (result.avatarUrl) setAvatarPreview(result.avatarUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto space-y-6 p-6 bg-white rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold">Chỉnh sửa Profile</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      {/* Avatar */}
      <div className="flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-2">
          {avatarPreview ? (
            <AvatarImage src={avatarPreview} />
          ) : (
            <AvatarFallback>
              {profile.fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <label className="cursor-pointer text-sm text-blue-600 hover:underline">
          Thay ảnh đại diện
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Full Name */}
      <div className="space-y-1">
        <Label htmlFor="fullName">Họ và tên</Label>
        <Input
          id="fullName"
          value={profile.fullName}
          onChange={(e) =>
            setProfile({ ...profile, fullName: e.currentTarget.value })
          }
          required
        />
      </div>

      {/* Nickname */}
      <div className="space-y-1">
        <Label htmlFor="nickname">Nickname</Label>
        <Input
          id="nickname"
          value={profile.nickname}
          onChange={(e) =>
            setProfile({ ...profile, nickname: e.currentTarget.value })
          }
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={profile.email}
          onChange={(e) =>
            setProfile({ ...profile, email: e.currentTarget.value })
          }
          required
        />
      </div>

      {/* Password */}
      <div className="space-y-1">
        <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
        <Input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.currentTarget.value)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="newPassword">Mật khẩu mới</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.currentTarget.value)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </form>
  );
}
