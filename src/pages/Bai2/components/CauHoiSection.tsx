import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Tag, Space, Typography, Empty, Tooltip, Popconfirm, message, Card, Row, Col, Select, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { CauHoi, KhoiKienThuc, MonHoc, DifficultyLevel } from '../types';
import { uid, DIFF_COLOR, DIFF_LEVELS } from '../constants';

const { Title, Text } = Typography;
const { Option } = Select;

interface CauHoiSectionProps {
  chList: CauHoi[];
  setChList: (list: CauHoi[] | ((prev: CauHoi[]) => CauHoi[])) => void;
  khoiList: KhoiKienThuc[];
  monList: MonHoc[];
}

export const CauHoiSection: React.FC<CauHoiSectionProps> = ({ chList, setChList, khoiList, monList }) => {
  const [form] = Form.useForm();
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState<CauHoi | null>(null);
  const [filter, setFilter] = useState<{ monHocId?: string; mucDoKho?: string; khoiKienThucId?: string }>({});
  const [viewModal, setViewModal] = useState(false);
  const [viewItem, setViewItem] = useState<CauHoi | null>(null);

  const openModal = (item?: CauHoi) => {
    setEditItem(item || null);
    form.setFieldsValue(
      item
        ? { monHocId: item.monHocId, noiDung: item.noiDung, mucDoKho: item.mucDoKho, khoiKienThucId: item.khoiKienThucId }
        : { monHocId: undefined, noiDung: '', mucDoKho: 'Dễ', khoiKienThucId: undefined }
    );
    setModal(true);
  };

  const handleSave = async () => {
    const vals = await form.validateFields();
    if (editItem) {
      setChList((p) => p.map((q) => (q.id === editItem.id ? { ...q, ...vals } : q)));
    } else {
      const count = chList.length + 1;
      setChList((p) => [...p, { id: uid(), maCauHoi: `Q${String(count).padStart(3, '0')}`, ...vals, createdAt: new Date().toISOString() }]);
    }
    setModal(false);
    message.success(editItem ? 'Đã cập nhật câu hỏi' : 'Đã thêm câu hỏi');
  };

  const handleDelete = (id: string) => {
    setChList((p) => p.filter((q) => q.id !== id));
    message.success('Đã xóa');
  };

  const filteredCh = chList.filter((q) => {
    if (filter.monHocId && q.monHocId !== filter.monHocId) return false;
    if (filter.mucDoKho && q.mucDoKho !== filter.mucDoKho) return false;
    if (filter.khoiKienThucId && q.khoiKienThucId !== filter.khoiKienThucId) return false;
    return true;
  });

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Quản Lý Câu Hỏi
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          Thêm câu hỏi
        </Button>
      </div>

      <Card className="bai2-section-card" size="small" style={{ marginBottom: 16 }}>
        <Row gutter={12} align="middle">
          <Col span={7}>
            <Select
              allowClear
              placeholder="Lọc theo môn học"
              style={{ width: '100%' }}
              onChange={(v: string) => setFilter((p) => ({ ...p, monHocId: v }))}
              value={filter.monHocId}
            >
              {monList.map((m) => (
                <Option key={m.id} value={m.id}>
                  {m.tenMon}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={7}>
            <Select
              allowClear
              placeholder="Lọc theo mức độ"
              style={{ width: '100%' }}
              onChange={(v: string) => setFilter((p) => ({ ...p, mucDoKho: v }))}
              value={filter.mucDoKho}
            >
              {DIFF_LEVELS.map((d) => (
                <Option key={d} value={d}>
                  <Tag color={DIFF_COLOR[d]}>{d}</Tag>
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={7}>
            <Select
              allowClear
              placeholder="Lọc theo khối KT"
              style={{ width: '100%' }}
              onChange={(v: string) => setFilter((p) => ({ ...p, khoiKienThucId: v }))}
              value={filter.khoiKienThucId}
            >
              {khoiList.map((k) => (
                <Option key={k.id} value={k.id}>
                  {k.ten}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={3}>
            <Button icon={<ReloadOutlined />} onClick={() => setFilter({})}>
              Reset
            </Button>
          </Col>
        </Row>
      </Card>

      <div style={{ marginBottom: 8 }}>
        <Text type="secondary">
          Hiển thị <Text strong>{filteredCh.length}</Text> / {chList.length} câu hỏi
        </Text>
      </div>

      <Table
        dataSource={filteredCh}
        rowKey="id"
        size="middle"
        bordered
        locale={{ emptyText: <Empty description="Không có câu hỏi phù hợp" /> }}
        columns={[
          { title: 'Mã', dataIndex: 'maCauHoi', render: (t: string) => <Tag color="blue">{t}</Tag>, width: 80 },
          {
            title: 'Môn học',
            dataIndex: 'monHocId',
            render: (id: string) => <Text type="secondary">{monList.find((m) => m.id === id)?.tenMon || '—'}</Text>,
            width: 170,
          },
          {
            title: 'Nội dung câu hỏi',
            dataIndex: 'noiDung',
            ellipsis: true,
            render: (t: string) => (
              <Tooltip title={t}>
                <span>{t}</span>
              </Tooltip>
            ),
          },
          {
            title: 'Mức độ',
            dataIndex: 'mucDoKho',
            render: (d: DifficultyLevel) => <Tag color={DIFF_COLOR[d]}>{d}</Tag>,
            width: 110,
          },
          {
            title: 'Khối KT',
            dataIndex: 'khoiKienThucId',
            render: (id: string) => <Tag>{khoiList.find((k) => k.id === id)?.ten || '—'}</Tag>,
            width: 110,
          },
          {
            title: 'Thao tác',
            align: 'center' as const,
            width: 120,
            render: (_: unknown, r: CauHoi) => (
              <Space>
                <Tooltip title="Xem">
                  <Button
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => {
                      setViewItem(r);
                      setViewModal(true);
                    }}
                  />
                </Tooltip>
                <Tooltip title="Sửa">
                  <Button icon={<EditOutlined />} size="small" onClick={() => openModal(r)} />
                </Tooltip>
                <Popconfirm
                  title="Xác nhận xóa câu hỏi?"
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
        title={editItem ? 'Sửa Câu Hỏi' : 'Thêm Câu Hỏi'}
        visible={modal}
        onOk={handleSave}
        onCancel={() => setModal(false)}
        okText="Lưu"
        cancelText="Hủy"
        width={560}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="monHocId" label="Môn học" rules={[{ required: true, message: 'Chọn môn học!' }]}>
                <Select placeholder="-- Chọn môn --">
                  {monList.map((m) => (
                    <Option key={m.id} value={m.id}>
                      {m.tenMon}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="khoiKienThucId" label="Khối kiến thức" rules={[{ required: true, message: 'Chọn khối!' }]}>
                <Select placeholder="-- Chọn khối --">
                  {khoiList.map((k) => (
                    <Option key={k.id} value={k.id}>
                      {k.ten}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="mucDoKho" label="Mức độ khó" rules={[{ required: true }]}>
            <Select>
              {DIFF_LEVELS.map((d) => (
                <Option key={d} value={d}>
                  <Tag color={DIFF_COLOR[d]}>{d}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="noiDung" label="Nội dung câu hỏi" rules={[{ required: true, message: 'Nhập nội dung!' }]}>
            <Input.TextArea rows={4} placeholder="Nhập nội dung câu hỏi tự luận..." />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Chi Tiết Câu Hỏi" visible={viewModal} onCancel={() => setViewModal(false)} footer={<Button onClick={() => setViewModal(false)}>Đóng</Button>}>
        {viewItem && (
          <div>
            <Space style={{ marginBottom: 12 }}>
              <Tag color="blue">{viewItem.maCauHoi}</Tag>
              <Tag color={DIFF_COLOR[viewItem.mucDoKho]}>{viewItem.mucDoKho}</Tag>
              <Tag>{khoiList.find((k) => k.id === viewItem.khoiKienThucId)?.ten}</Tag>
            </Space>
            <Divider />
            <div>
              <Text strong>Môn học: </Text>
              <Text>{monList.find((m) => m.id === viewItem.monHocId)?.tenMon}</Text>
            </div>
            <Divider />
            <Text strong>Nội dung:</Text>
            <div style={{ marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 6, lineHeight: 1.8 }}>
              {viewItem.noiDung}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
