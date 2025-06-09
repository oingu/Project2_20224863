import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, notification, Popconfirm, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAuth } from '../auth/AuthProvider';
import AddRole from './AddRole';

interface Role {
  _id: string;
  title: string;
  description: string;
  permissions: string[];
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  _id: string;
  title: string;
  description: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const RoleManagement: React.FC = () => {
  const { api } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]); // Track selected roles
  // State để track thay đổi permissions của từng role
  const [rolePermissions, setRolePermissions] = useState<{[roleId: string]: string[]}>({});

  const fetchData = async () => {
    try {
      const permissionsResponse = await api.get('/api/v1/admin/roles/permissions');
      console.log('permissions:', permissionsResponse.data.data);
      setPermissions(Array.isArray(permissionsResponse.data.data) ? permissionsResponse.data.data : []);

      const rolesResponse = await api.get('/api/v1/admin/roles');
      console.log('roles:', rolesResponse.data);
      const rolesData = Array.isArray(rolesResponse.data.data) ? rolesResponse.data.data : [];
      setRoles(rolesData);
      
      // Khởi tạo rolePermissions state với dữ liệu hiện tại
      const initialRolePermissions: {[roleId: string]: string[]} = {};
      rolesData.forEach((role: Role) => {
        initialRolePermissions[role._id] = [...role.permissions];
      });
      setRolePermissions(initialRolePermissions);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [api]);

  // Hàm refresh data sau khi thêm role mới
  const handleAddRoleSuccess = () => {
    fetchData(); // Refresh danh sách roles
  };

  // Hàm xử lý chọn/bỏ chọn role
  const handleRoleSelect = (roleId: string, checked: boolean) => {
    setSelectedRoles(prev => {
      if (checked) {
        return [...prev, roleId];
      } else {
        return prev.filter(id => id !== roleId);
      }
    });
  };

  // Hàm chọn/bỏ chọn tất cả roles
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRoles(roles.map(role => role._id));
    } else {
      setSelectedRoles([]);
    }
  };

  // Hàm xóa các roles được chọn
  const handleDeleteSelected = async () => {
    if (selectedRoles.length === 0) {
      message.warning('Vui lòng chọn ít nhất một role để xóa!');
      return;
    }

    setDeleting(true);
    try {
      // Xóa từng role một cách tuần tự
      for (const roleId of selectedRoles) {
        await api.delete(`/api/v1/admin/roles/${roleId}`);
      }
      
      notification.success({
        message: 'Xóa thành công',
        description: `Đã xóa ${selectedRoles.length} role(s) thành công!`,
        placement: 'topRight'
      });
      
      setSelectedRoles([]); // Clear selection
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deleting roles:', error);
      message.error('Có lỗi xảy ra khi xóa roles!');
    } finally {
      setDeleting(false);
    }
  };

  // Hàm xử lý thay đổi checkbox permission
  const handlePermissionChange = (roleId: string, permissionTitle: string, checked: boolean) => {
    setRolePermissions(prev => {
      const currentPermissions = prev[roleId] || [];
      if (checked) {
        // Thêm permission nếu chưa có
        if (!currentPermissions.includes(permissionTitle)) {
          return {
            ...prev,
            [roleId]: [...currentPermissions, permissionTitle]
          };
        }
      } else {
        // Xóa permission
        return {
          ...prev,
          [roleId]: currentPermissions.filter(p => p !== permissionTitle)
        };
      }
      return prev;
    });
  };

  // Hàm lưu thay đổi permissions
  const handleSave = async () => {
    setSaving(true);
    try {
      const requestBody = {
        rolePermissions: roles.map(role => ({
          _id: role._id,
          title: role.title,
          permissions: rolePermissions[role._id] || []
        }))
      };

      await api.patch('/api/v1/admin/roles/permissions', requestBody);
      Modal.success({
        title: 'Cập nhật thành công!',
        content: 'Permissions đã được cập nhật thành công!',
        okText: 'OK'
      });
      
      // Cập nhật lại state roles với permissions mới
      setRoles(prev => prev.map(role => ({
        ...role,
        permissions: rolePermissions[role._id] || []
      })));
    } catch (error) {
      console.error('Error saving permissions:', error);
      message.error('Có lỗi xảy ra khi cập nhật permissions!');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: 'Permission',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    ...roles.map(role => ({
      title: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '8px' }}>
            <input
              type="checkbox"
              checked={selectedRoles.includes(role._id)}
              onChange={(e) => handleRoleSelect(role._id, e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            <Tooltip title={role.description} placement="top">
              <span style={{ cursor: 'help' }}>{role.title}</span>
            </Tooltip>
          </div>
        </div>
      ),
      dataIndex: role._id,
      key: role._id,
      align: 'center' as const,
      render: (_: any, permission: Permission) => {
        const checked = (rolePermissions[role._id] || []).includes(permission.title);
        return (
          <input 
            type="checkbox" 
            checked={checked}
            onChange={(e) => handlePermissionChange(role._id, permission.title, e.target.checked)}
          />
        );
      },
    })),
  ];

  return (
    <div style={{ padding: '0px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 className="text-2xl font-bold">Role Management</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            type="default" 
            icon={<PlusOutlined />}
            onClick={() => setShowAddModal(true)}
          >
            Add New Role
          </Button>
          {selectedRoles.length > 0 && (
            <Popconfirm
              title={`Xóa ${selectedRoles.length} role(s)?`}
              description="Bạn có chắc chắn muốn xóa các role đã chọn?"
              onConfirm={handleDeleteSelected}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                danger
                icon={<DeleteOutlined />}
                loading={deleting}
              >
                Delete Selected ({selectedRoles.length})
              </Button>
            </Popconfirm>
          )}
          <Button 
            type="primary" 
            onClick={handleSave}
            loading={saving}
            disabled={loading}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Select All Checkbox */}
      {roles.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <input
            type="checkbox"
            checked={selectedRoles.length === roles.length}
            onChange={(e) => handleSelectAll(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          <span>Select All Roles ({selectedRoles.length}/{roles.length} selected)</span>
        </div>
      )}

      <Table
        dataSource={permissions}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={false}
        bordered
        scroll={{ x: 'max-content' }}
      />
      
      {/* Add Role Modal */}
      <AddRole
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddRoleSuccess}
      />
    </div>
  );
};

export default RoleManagement;
