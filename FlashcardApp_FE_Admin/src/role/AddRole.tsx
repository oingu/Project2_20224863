import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useAuth } from '../auth/AuthProvider';

interface AddRoleProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback để refresh danh sách roles
}

const AddRole: React.FC<AddRoleProps> = ({ open, onClose, onSuccess }) => {
  const { api } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { title: string; description: string }) => {
    setLoading(true);
    try {
      await api.post('/api/v1/admin/roles', {
        title: values.title,
        description: values.description
      });
      
      message.success('Tạo role mới thành công!');
      form.resetFields();
      onClose();
      onSuccess(); // Gọi callback để refresh danh sách
    } catch (error) {
      console.error('Error creating role:', error);
      message.error('Có lỗi xảy ra khi tạo role!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Add New Role"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: '20px' }}
      >
        <Form.Item
          label="Role Title"
          name="title"
          rules={[
            { required: true, message: 'Vui lòng nhập tên role!' },
            { min: 2, message: 'Tên role phải có ít nhất 2 ký tự!' }
          ]}
        >
          <Input 
            placeholder="Nhập tên role (ví dụ: User Manager)" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả!' },
            { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự!' }
          ]}
        >
          <Input.TextArea 
            placeholder="Nhập mô tả role (ví dụ: Manage user and user Information)"
            rows={4}
            size="large"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button 
            onClick={handleCancel} 
            style={{ marginRight: '8px' }}
          >
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
          >
            Create Role
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRole;
