import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./app/DashboardLayout";
import Profile from "./app/Profile";
import EditUser from "./user/EditUser";
import Access from "./app/AccessManagement";
import LoginPage from "./app/LoginPage";
import { AuthProvider } from "./auth/AuthProvider";
import ViewUserPage from "./user/ViewUserPage";
import {RequireAuth} from "./auth/RequireAuth";
import UserManagementTable from "./user/UserManagement.tsx";
import PostManagementTable from "./post/PostManagement";
import PostForm from "./post/AddNewPost.tsx";
import PostDetail from "./post/PostDetail.tsx";
import EditPost from "./post/EditPost.tsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RoleManagement from "./role/RoleManagement.tsx";

export default function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* 1) Route login */}
        <Route path="/login" element={<LoginPage />} />

        {/* 2) Tất cả các route dashboard/bên trong đều phải auth */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          {/* index = "/" sau khi login thành công */}
          <Route index element={<Profile />} />
          <Route path="user" element={<UserManagementTable />}>
            <Route path=":userId" element={<ViewUserPage />} />
            <Route path=":userId/edit" element={<EditUser />} />
          </Route>
          <Route path= "post" element={<PostManagementTable/>} >
            <Route path="add" element={<PostForm />} />
            <Route path=":slug" element={<PostDetail />} />
            <Route path=":_id/edit" element={<EditPost />} />
          </Route>
          <Route path="access" element={<RoleManagement />} />
       
        </Route>

        {/* 3) Mọi đường dẫn không khớp bên trên đều redirect về login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
