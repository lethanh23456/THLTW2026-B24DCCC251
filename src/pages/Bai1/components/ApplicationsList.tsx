import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Radio, message, Popconfirm, Tag, List, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, HistoryOutlined, PlusOutlined } from '@ant-design/icons';
import { useClubContext } from '../ClubContext';
import { Application, ApplicationStatus } from '../types';
import moment from 'moment';

const { TextArea } = Input;
const { Text } = Typography;

const ApplicationsList: React.FC = () => {
  const { applications, setApplications, clubs, approveApplications, rejectApplications, histories } = useClubContext();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [form] = Form.useForm();

  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectForm] = Form.useForm();

  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);

  const handleAdd = () => {
    setEditingApp(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Application) => {
    setEditingApp(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    message.success("Đã xóa đơn đăng ký.");
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (editingApp) {
        setApplications(prev => prev.map(app => app.id === editingApp.id ? { ...app, ...values } : app));
        message.success("Cập nhật thành công!");
      } else {
        const newApp: Application = {
          ...values,
          id: `A${Date.now()}`,
          status: 'Pending'
        };
        setApplications(prev => [newApp, ...prev]);
        message.success("Thêm mới thành công!");
      }
      setIsModalVisible(false);
    });
  };

  const handleApproveSelected = () => {
    if (selectedRowKeys.length === 0) return;
    approveApplications(selectedRowKeys as string[]);
    setSelectedRowKeys([]);
    message.success(`Đã duyệt ${selectedRowKeys.length} đơn!`);
  };

  const handleRejectSelected = () => {
    if (selectedRowKeys.length === 0) return;
    rejectForm.resetFields();
    setIsRejectModalVisible(true);
  };

  const submitReject = () => {
    rejectForm.validateFields().then(values => {
      rejectApplications(selectedRowKeys as string[], values.reason);
      setIsRejectModalVisible(false);
      setSelectedRowKeys([]);
      message.success(`Đã từ chối ${selectedRowKeys.length} đơn!`);
    });
  };

  const columns = [
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    {
      title: 'CLB đăng ký',
      dataIndex: 'clubId',
      key: 'clubId',
      render: (clubId: string) => clubs.find(c => c.id === clubId)?.name || 'N/A'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: ApplicationStatus) => {
        let color = status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'gold';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    { title: 'Lý do đăng ký', dataIndex: 'reason', key: 'reason' },
    { title: 'Ghi chú (Lý do từ chối)', dataIndex: 'rejectReason', key: 'rejectReason' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Application) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small" />
          <Popconfirm title="Xóa đơn này?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Tạo đơn đăng ký
        </Button>
        <Button
          type="primary"
          style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          icon={<CheckCircleOutlined />}
          disabled={selectedRowKeys.length === 0}
          onClick={handleApproveSelected}
        >
          Duyệt {selectedRowKeys.length > 0 ? `${selectedRowKeys.length} đơn` : ''}
        </Button>
        <Button
          danger
          icon={<CloseCircleOutlined />}
          disabled={selectedRowKeys.length === 0}
          onClick={handleRejectSelected}
        >
          Từ chối {selectedRowKeys.length > 0 ? `${selectedRowKeys.length} đơn` : ''}
        </Button>
        <Button
          icon={<HistoryOutlined />}
          onClick={() => setIsHistoryModalVisible(true)}
        >
          Xem lịch sử thao tác
        </Button>
      </Space>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={applications}
        rowKey="id"
      />


      <Modal
        title={editingApp ? 'Sửa đơn đăng ký' : 'Tạo đơn đăng ký'}
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Space size="large" style={{ display: 'flex' }}>
            <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]} style={{ width: 300 }}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]} style={{ width: 300 }}>
              <Input />
            </Form.Item>
          </Space>
          <Space size="large" style={{ display: 'flex' }}>
            <Form.Item name="phone" label="SĐT" rules={[{ required: true }]} style={{ width: 300 }}>
              <Input />
            </Form.Item>
            <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]} style={{ width: 300 }}>
              <Radio.Group>
                <Radio value="Male">Nam</Radio>
                <Radio value="Female">Nữ</Radio>
                <Radio value="Other">Khác</Radio>
              </Radio.Group>
            </Form.Item>
          </Space>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="skills" label="Sở trường">
            <Input />
          </Form.Item>
          <Form.Item name="clubId" label="Câu lạc bộ" rules={[{ required: true }]}>
            <Select placeholder="Chọn câu lạc bộ">
              {clubs.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="reason" label="Lý do đăng ký" rules={[{ required: true }]}>
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Lý do từ chối"
        visible={isRejectModalVisible}
        onOk={submitReject}
        onCancel={() => setIsRejectModalVisible(false)}
      >
        <Form form={rejectForm} layout="vertical">
          <Form.Item name="reason" label="Vui lòng nhập lý do từ chối:" rules={[{ required: true, message: 'Lý do là bắt buộc' }]}>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Lịch sử thao tác"
        visible={isHistoryModalVisible}
        onCancel={() => setIsHistoryModalVisible(false)}
        footer={null}
        width={600}
      >
        <List
          dataSource={histories.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())}
          renderItem={item => {
            const app = applications.find(a => a.id === item.applicationId);
            return (
              <List.Item>
                <Text>
                  [{moment(item.timestamp).format('DD/MM/YYYY HH:mm')}] <Text strong>{item.adminName}</Text> đã {" "}
                  <Tag color={item.action === 'Approved' ? 'green' : 'red'}>{item.action}</Tag>
                  đơn của <Text strong>{app?.fullName || 'Ứng viên đã bị xóa'}</Text>.
                  {item.reason && <span> Lý do: {item.reason}</span>}
                </Text>
              </List.Item>
            );
          }}
        />
      </Modal>
    </div>
  );
};

export default ApplicationsList;
