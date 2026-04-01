import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Switch, DatePicker, message, Popconfirm, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, TeamOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useClubContext } from '../ClubContext';
import { Club } from '../types';
import moment from 'moment';

const { TextArea } = Input;

interface ClubsListProps {
  onViewMembers: (clubId: string) => void;
}

const ClubsList: React.FC<ClubsListProps> = ({ onViewMembers }) => {
  const { clubs, setClubs, applications } = useClubContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingClub(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
    setIsModalVisible(true);
  };

  const handleEdit = (record: Club) => {
    setEditingClub(record);
    form.setFieldsValue({
      ...record,
      foundedDate: record.foundedDate ? moment(record.foundedDate) : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    const hasMembers = applications.some(app => app.clubId === id && app.status === 'Approved');
    if (hasMembers) {
      message.error("Không thể xóa câu lạc bộ đang có thành viên!");
      return;
    }
    setClubs(prev => prev.filter(c => c.id !== id));
    message.success("Đã xóa câu lạc bộ.");
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      const data = {
        ...values,
        foundedDate: values.foundedDate ? values.foundedDate.format('YYYY-MM-DD') : null,
      };

      if (editingClub) {
        setClubs(prev => prev.map(c => c.id === editingClub.id ? { ...c, ...data } : c));
        message.success("Cập nhật thành công!");
      } else {
        const newClub: Club = {
          ...data,
          id: `C${Date.now()}`,
          avatar: data.avatar || `https://picsum.photos/seed/${Date.now()}/100`
        };
        setClubs(prev => [...prev, newClub]);
        message.success("Thêm mới thành công!");
      }
      setIsModalVisible(false);
    });
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (text: string) => <Avatar src={text} size="large" />
    },
    {
      title: 'Tên CLB',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Club, b: Club) => a.name.localeCompare(b.name),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm tên CLB"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
              Tìm
            </Button>
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value: any, record: Club) => record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundedDate',
      key: 'foundedDate',
      sorter: (a: Club, b: Club) => new Date(a.foundedDate).getTime() - new Date(b.foundedDate).getTime()
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <div dangerouslySetInnerHTML={{ __html: text }} />
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'manager',
      key: 'manager'
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => isActive ? <span style={{ color: 'green' }}>Có</span> : <span style={{ color: 'red' }}>Không</span>
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Club) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button type="dashed" icon={<TeamOutlined />} onClick={() => onViewMembers(record.id)}>Thành viên</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm Câu lạc bộ
        </Button>
      </div>
      <Table columns={columns} dataSource={clubs} rowKey="id" />

      <Modal
        title={editingClub ? 'Sửa Câu lạc bộ' : 'Thêm Câu lạc bộ'}
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên Câu lạc bộ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="avatar" label="Ảnh đại diện (URL)">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="foundedDate" label="Ngày thành lập" rules={[{ required: true }]}>
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="manager" label="Chủ nhiệm CLB" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
            <Switch checkedChildren="Đang hoạt động" unCheckedChildren="Ngừng hoạt động" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Nhập mô tả" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClubsList;
