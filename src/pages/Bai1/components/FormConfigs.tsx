import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm } from 'antd';
import { useDiplomaStore, FormConfig } from '../store';

const FormConfigs: React.FC = () => {
  const { formConfigs, addFormConfig, updateFormConfig, deleteFormConfig } = useDiplomaStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Tên trường', dataIndex: 'name', key: 'name' },
    { title: 'Kiểu dữ liệu', dataIndex: 'type', key: 'type' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: FormConfig) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => deleteFormConfig(record.id)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: FormConfig) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleAddModal = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const onFinish = (values: any) => {
    if (editingId) {
      updateFormConfig(editingId, values);
    } else {
      addFormConfig({
        name: values.name,
        type: values.type,
      });
    }
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={handleAddModal} style={{ marginBottom: 16 }}>
        Thêm trường thông tin
      </Button>
      <Table dataSource={formConfigs} columns={columns} rowKey="id" />

      <Modal
        title={editingId ? 'Sửa trường thông tin' : 'Thêm trường thông tin'}
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Tên trường (Ví dụ: Dân tộc, Nơi sinh)" rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Kiểu dữ liệu" rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu' }]}>
            <Select>
              <Select.Option value="String">String (Chuỗi)</Select.Option>
              <Select.Option value="Number">Number (Số)</Select.Option>
              <Select.Option value="Date">Date (Ngày tháng)</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FormConfigs;
