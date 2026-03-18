import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, Select, TimePicker } from 'antd';
import { useBooking } from '../context';
import { Staff } from '../types';
import moment from 'moment';

const { Option } = Select;

const daysOfWeek = [
  { label: 'Chủ Nhật', value: 0 },
  { label: 'Thứ 2', value: 1 },
  { label: 'Thứ 3', value: 2 },
  { label: 'Thứ 4', value: 3 },
  { label: 'Thứ 5', value: 4 },
  { label: 'Thứ 6', value: 5 },
  { label: 'Thứ 7', value: 6 },
];

export const StaffManager = () => {
  const { staffs, addStaff, updateStaff, deleteStaff } = useBooking();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingStaff(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Staff) => {
    setEditingStaff(record);
    form.setFieldsValue({
      ...record,
      workingHours: [moment(record.workingHours[0], 'HH:mm'), moment(record.workingHours[1], 'HH:mm')]
    });
    setIsModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        workingHours: [values.workingHours[0].format('HH:mm'), values.workingHours[1].format('HH:mm')]
      };
      if (editingStaff) {
        updateStaff(editingStaff.id, formattedValues as Omit<Staff, 'id'>);
      } else {
        addStaff(formattedValues as Omit<Staff, 'id'>);
      }
      setIsModalVisible(false);
    });
  };

  const columns = [
    { title: 'Tên Nhân Viên', dataIndex: 'name', key: 'name' },
    { title: 'Giới hạn khách/ngày', dataIndex: 'maxCustomersPerDay', key: 'maxCustomersPerDay' },
    { 
      title: 'Ngày làm việc', 
      dataIndex: 'workingDays', 
      key: 'workingDays',
      render: (days: number[]) => days.map(d => daysOfWeek.find(dw => dw.value === d)?.label).join(', ')
    },
    { 
      title: 'Giờ làm việc', 
      dataIndex: 'workingHours', 
      key: 'workingHours',
      render: (hours: [string, string]) => `${hours[0]} - ${hours[1]}`
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: Staff) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Xóa nhân viên này?" onConfirm={() => deleteStaff(record.id)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>Thêm Nhân Viên</Button>
      </div>
      <Table dataSource={staffs} columns={columns} rowKey="id" pagination={false} />

      <Modal
        title={editingStaff ? 'Sửa Nhân Viên' : 'Thêm Nhân Viên'}
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên Nhân Viên" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="maxCustomersPerDay" label="Giới hạn khách/ngày" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          <Form.Item name="workingDays" label="Ngày làm việc" rules={[{ required: true, type: 'array' }]}>
            <Select mode="multiple" placeholder="Chọn ngày">
              {daysOfWeek.map(d => (
                <Option key={d.value} value={d.value}>{d.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="workingHours" label="Giờ làm việc (Bắt đầu - Kết thúc)" rules={[{ required: true }]}>
             <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
