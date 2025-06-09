// frontend/src/components/DashboardLayout.tsx
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { Button } from "@/components/ui/button";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();


  // Danh sách các item sidebar
  const menuItems = [
    { label: "Profile",      path: "/" },
    { label: "User Management",   path: "/user" },
    { label: "Post Management",        path: "/post" },
    { label: "Access Management",     path: "/access" },
  ];

  const { logout } = useAuth();
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <nav className="flex flex-col space-y-2">
          {menuItems.map(({ label, path }) => {
            const isActive = pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`
                  text-left py-2 px-3 rounded
                  ${isActive 
                    ? "font-semibold bg-blue-100 text-blue-600" 
                    : "text-gray-700 hover:bg-gray-200"}
                `}
              >
                {label}
              </button>
            );
            
          })}
          <Button variant="outline" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </nav>

      </aside>

      {/* Nội dung chính */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
