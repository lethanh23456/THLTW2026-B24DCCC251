import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm } from 'antd';
import { useBooking } from '../context';
import { Service } from '../types';

export const ServiceManager = () => {
  const { services, addService, updateService, deleteService } = useBooking();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingService(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Service) => {
    setEditingService(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (editingService) {
        updateService(editingService.id, values as Omit<Service, 'id'>);
      } else {
        addService(values as Omit<Service, 'id'>);
      }
      setIsModalVisible(false);
    });
  };

  const columns = [
    { title: 'Tên Dịch Vụ', dataIndex: 'name', key: 'name' },
    { title: 'Giá (VND)', dataIndex: 'price', key: 'price', render: (val: number) => val.toLocaleString() },
    { title: 'Thời gian thực hiện (phút)', dataIndex: 'durationMinutes', key: 'durationMinutes' },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: Service) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Xóa dịch vụ này?" onConfirm={() => deleteService(record.id)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>Thêm Dịch Vụ</Button>
      </div>
      <Table dataSource={services} columns={columns} rowKey="id" pagination={false} />

      <Modal
        title={editingService ? 'Sửa Dịch Vụ' : 'Thêm Dịch Vụ'}
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên Dịch Vụ" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Giá (VND)" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="durationMinutes" label="Thời gian thực hiện (phút)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
