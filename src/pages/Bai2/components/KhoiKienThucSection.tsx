import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Tag, Space, Typography, Empty, Tooltip, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { KhoiKienThuc, CauHoi } from '../types';
import { uid } from '../constants';

const { Title, Text } = Typography;

interface KhoiKienThucSectionProps {
  khoiList: KhoiKienThuc[];
  setKhoiList: (list: KhoiKienThuc[] | ((prev: KhoiKienThuc[]) => KhoiKienThuc[])) => void;
  chList: CauHoi[];
}

export const KhoiKienThucSection: React.FC<KhoiKienThucSectionProps> = ({ khoiList, setKhoiList, chList }) => {
  const [form] = Form.useForm();
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState<KhoiKienThuc | null>(null);

  const openModal = (item?: KhoiKienThuc) => {
    setEditItem(item || null);
    form.setFieldsValue(item ? { ten: item.ten, moTa: item.moTa } : { ten: '', moTa: '' });
    setModal(true);
  };

  const handleSave = async () => {
    const vals = await form.validateFields();
    if (editItem) {
      setKhoiList((p) => p.map((k) => (k.id === editItem.id ? { ...k, ...vals } : k)));
    } else {
      setKhoiList((p) => [...p, { id: uid(), ...vals }]);
    }
    setModal(false);
    message.success(editItem ? 'Đã cập nhật khối kiến thức' : 'Đã thêm khối kiến thức');
  };

  const handleDelete = (id: string) => {
    setKhoiList((p) => p.filter((k) => k.id !== id));
    message.success('Đã xóa');
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Danh Mục Khối Kiến Thức
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          Thêm khối
        </Button>
      </div>

      <Table
        dataSource={khoiList}
        rowKey="id"
        size="middle"
        bordered
        locale={{ emptyText: <Empty description="Chưa có khối kiến thức" /> }}
        columns={[
          { title: 'STT', render: (_: unknown, __: unknown, i: number) => i + 1, width: 60, align: 'center' as const },
          {
            title: 'Tên khối',
            dataIndex: 'ten',
            render: (t: string) => (
              <Tag color="blue" style={{ fontSize: 13 }}>
                {t}
              </Tag>
            ),
          },
          {
            title: 'Mô tả',
            dataIndex: 'moTa',
            render: (t: string) => t || <Text type="secondary">—</Text>,
          },
          {
            title: 'Số câu hỏi',
            align: 'center' as const,
            width: 110,
            render: (_: unknown, r: KhoiKienThuc) => (
              <span style={{ color: '#1890ff', fontWeight: 500 }}>
                {chList.filter((q) => q.khoiKienThucId === r.id).length} câu
              </span>
            ),
          },
          {
            title: 'Thao tác',
            align: 'center' as const,
            width: 120,
            render: (_: unknown, r: KhoiKienThuc) => (
              <Space>
                <Tooltip title="Sửa">
                  <Button icon={<EditOutlined />} size="small" onClick={() => openModal(r)} />
                </Tooltip>
                <Popconfirm
                  title="Xác nhận xóa khối này?"
                  onConfirm={() => handleDelete(r.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Tooltip title="Xóa">
                    <Button icon={<DeleteOutlined />} size="small" danger />
                  </Tooltip>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editItem ? 'Sửa Khối Kiến Thức' : 'Thêm Khối Kiến Thức'}
        visible={modal}
        onOk={handleSave}
        onCancel={() => setModal(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="ten" label="Tên khối" rules={[{ required: true, message: 'Nhập tên khối!' }]}>
            <Input placeholder="VD: Tổng quan, Chuyên sâu..." />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả">
            <Input placeholder="Mô tả ngắn..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
