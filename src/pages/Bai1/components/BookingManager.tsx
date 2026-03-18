import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, TimePicker, Tag, Space, message } from 'antd';
import { useBooking } from '../context';
import { Appointment, AppointmentStatus } from '../types';
import moment from 'moment';

const { Option } = Select;

const statusColors: Record<AppointmentStatus, string> = {
  pending: 'gold',
  confirmed: 'blue',
  completed: 'green',
  cancelled: 'red'
};

const statusLabels: Record<AppointmentStatus, string> = {
  pending: 'Chờ duyệt',
  confirmed: 'Xác nhận',
  completed: 'Hoàn thành',
  cancelled: 'Hủy'
};

export const BookingManager = () => {
  const { appointments, services, staffs, bookAppointment, updateAppointmentStatus } = useBooking();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      const formattedApp = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm')
      };
      const success = bookAppointment(formattedApp);
      if (success) {
        setIsModalVisible(false);
      }
    });
  };

  const columns = [
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { title: 'SĐT', dataIndex: 'customerPhone', key: 'customerPhone' },
    {
      title: 'Dịch vụ',
      dataIndex: 'serviceId',
      key: 'serviceId',
      render: (id: string) => services.find(s => s.id === id)?.name || id
    },
    {
      title: 'Nhân viên',
      dataIndex: 'staffId',
      key: 'staffId',
      render: (id: string) => staffs.find(s => s.id === id)?.name || id
    },
    { title: 'Ngày', dataIndex: 'date', key: 'date' },
    { title: 'Giờ', dataIndex: 'time', key: 'time' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: AppointmentStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      )
    },
    {
      title: 'Thay đổi trạng thái',
      key: 'actions',
      render: (_: any, record: Appointment) => (
        <Select
          value={record.status}
          style={{ width: 120 }}
          onChange={(val: AppointmentStatus) => updateAppointmentStatus(record.id, val)}
        >
          {Object.entries(statusLabels).map(([key, label]) => (
            <Option key={key} value={key}>{label}</Option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>Đặt Lịch Mới</Button>
      </div>
      <Table dataSource={appointments} columns={columns} rowKey="id" pagination={false} />

      <Modal
        title="Đặt Lịch Hẹn"
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="customerName" label="Tên Khách Hàng" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="customerPhone" label="Số Điện Thoại" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="serviceId" label="Dịch vụ" rules={[{ required: true }]}>
            <Select>
              {services.map(s => <Option key={s.id} value={s.id}>{s.name} - {s.price.toLocaleString()} VND</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="staffId" label="Nhân viên" rules={[{ required: true }]}>
            <Select>
              {staffs.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Ngày hẹn" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="time" label="Giờ hẹn" rules={[{ required: true }]}>
            <TimePicker style={{ width: '100%' }} format="HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
