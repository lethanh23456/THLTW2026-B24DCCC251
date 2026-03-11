import { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Tag, Space, Typography, Empty, Tooltip, Popconfirm, message, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { MonHoc, CauHoi } from '../types';
import { uid } from '../constants';

const { Title, Text } = Typography;

interface MonHocSectionProps {
  monList: MonHoc[];
  setMonList: (list: MonHoc[] | ((prev: MonHoc[]) => MonHoc[])) => void;
  chList: CauHoi[];
}

export const MonHocSection: React.FC<MonHocSectionProps> = ({ monList, setMonList, chList }) => {
  const [form] = Form.useForm();
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState<MonHoc | null>(null);

  const openModal = (item?: MonHoc) => {
    setEditItem(item || null);
    form.setFieldsValue(item ? { maMon: item.maMon, tenMon: item.tenMon, soTinChi: item.soTinChi } : { maMon: '', tenMon: '', soTinChi: 3 });
    setModal(true);
  };

  const handleSave = async () => {
    const vals = await form.validateFields();
    if (editItem) {
      setMonList((p) => p.map((m) => (m.id === editItem.id ? { ...m, ...vals } : m)));
    } else {
      setMonList((p) => [...p, { id: uid(), ...vals }]);
    }
    setModal(false);
    message.success(editItem ? 'Đã cập nhật môn học' : 'Đã thêm môn học');
  };

  const handleDelete = (id: string) => {
    setMonList((p) => p.filter((m) => m.id !== id));
    message.success('Đã xóa');
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Danh Mục Môn Học
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          Thêm môn học
        </Button>
      </div>

      <Table
        dataSource={monList}
        rowKey="id"
        size="middle"
        bordered
        locale={{ emptyText: <Empty description="Chưa có môn học" /> }}
        columns={[
          { title: 'STT', render: (_: unknown, __: unknown, i: number) => i + 1, width: 60, align: 'center' as const },
          {
            title: 'Mã môn',
            dataIndex: 'maMon',
            render: (t: string) => <Tag color="purple">{t}</Tag>,
            width: 120,
          },
          { title: 'Tên môn học', dataIndex: 'tenMon', render: (t: string) => <Text strong>{t}</Text> },
          {
            title: 'Số tín chỉ',
            dataIndex: 'soTinChi',
            render: (n: number) => <Tag color="green">{n} TC</Tag>,
            width: 100,
            align: 'center' as const,
          },
          {
            title: 'Câu hỏi',
            align: 'center' as const,
            width: 90,
            render: (_: unknown, r: MonHoc) => (
              <span style={{ color: '#1890ff', fontWeight: 500 }}>
                {chList.filter((q) => q.monHocId === r.id).length} câu
              </span>
            ),
          },
          {
            title: 'Thao tác',
            align: 'center' as const,
            width: 120,
            render: (_: unknown, r: MonHoc) => (
              <Space>
                <Tooltip title="Sửa">
                  <Button icon={<EditOutlined />} size="small" onClick={() => openModal(r)} />
                </Tooltip>
                <Popconfirm
                  title="Xác nhận xóa môn này?"
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
        title={editItem ? 'Sửa Môn Học' : 'Thêm Môn Học'}
        visible={modal}
        onOk={handleSave}
        onCancel={() => setModal(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={12}>
            <Col span={14}>
              <Form.Item name="maMon" label="Mã môn" rules={[{ required: true, message: 'Nhập mã môn!' }]}>
                <Input placeholder="VD: CNTT101" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="soTinChi" label="Số tín chỉ" rules={[{ required: true }]}>
                <InputNumber min={1} max={10} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="tenMon" label="Tên môn học" rules={[{ required: true, message: 'Nhập tên môn!' }]}>
            <Input placeholder="VD: Nhập môn Lập trình" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
