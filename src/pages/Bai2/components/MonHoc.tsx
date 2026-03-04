import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Subject } from '../types';

interface SubjectManagementProps {
  subjects: Subject[];
  onAddSubject: (name: string) => void;
  onUpdateSubject: (id: string, name: string) => void;
  onDeleteSubject: (id: string) => void;
}

const SubjectManagement: React.FC<SubjectManagementProps> = ({
  subjects,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const handleAddClick = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditClick = (subject: Subject) => {
    setEditingId(subject.id);
    form.setFieldsValue({
      name: subject.name,
    });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        onUpdateSubject(editingId, values.name);
      } else {
        onAddSubject(values.name);
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingId(null);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const columns = [
    {
      title: 'Môn học',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 200,
      align: 'center' as const,
      render: (_: any, record: Subject) => (
        <Space >
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa môn học"
            onConfirm={() => onDeleteSubject(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
          Thêm môn học
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={subjects}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: 'Chưa có môn học nào' }}
      />

      <Modal
        title={editingId ? 'Sửa môn học' : 'Thêm môn học'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingId(null);
        }}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="Tên môn học"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên môn học' },
              { max: 50, message: 'Tên môn học không quá 50 ký tự' },
            ]}
          >
            <Input placeholder="Nhập tên môn học" />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default SubjectManagement;
