import { useState } from 'react';
import { Tabs, Card, Form, Button, Modal, Table, Input, InputNumber, Select, Tag, Space, Typography, Empty, Tooltip, Popconfirm, message, Row, Col, Alert, Divider } from 'antd';
import { ThunderboltOutlined, FileTextOutlined, AppstoreOutlined, PlusOutlined, DeleteOutlined, EyeOutlined, SaveOutlined } from '@ant-design/icons';
import { CauHoi, KhoiKienThuc, MonHoc, MauDeThi, DeThi, CauTrucDeThi } from '../types';
import { uid, DIFF_COLOR, DIFF_LEVELS } from '../constants';

const { Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface DeThiSectionProps {
  deList: DeThi[];
  setDeList: (list: DeThi[] | ((prev: DeThi[]) => DeThi[])) => void;
  mauList: MauDeThi[];
  setMauList: (list: MauDeThi[] | ((prev: MauDeThi[]) => MauDeThi[])) => void;
  chList: CauHoi[];
  khoiList: KhoiKienThuc[];
  monList: MonHoc[];
}

export const DeThiSection: React.FC<DeThiSectionProps> = ({ deList, setDeList, mauList, setMauList, chList, khoiList, monList }) => {
  const [dtForm] = Form.useForm();
  const [mauForm] = Form.useForm();
  const [cauTruc, setCauTruc] = useState<CauTrucDeThi[]>([]);
  const [mauModal, setMauModal] = useState(false);
  const [viewDe, setViewDe] = useState<DeThi | null>(null);
  const [viewDeModal, setViewDeModal] = useState(false);
  const [dtTab, setDtTab] = useState('tao');
  const [selectedMau, setSelectedMau] = useState<string | undefined>();
  const [selectedMon, setSelectedMon] = useState<string | undefined>();

  const addRow = () =>
    setCauTruc((p) => [...p, { mucDoKho: 'Dễ', khoiKienThucId: khoiList[0]?.id || '', soCauHoi: 1 }]);

  const updateRow = (i: number, f: keyof CauTrucDeThi, v: string | number) =>
    setCauTruc((p) => p.map((r, idx) => (idx === i ? { ...r, [f]: v } : r)));

  const removeRow = (i: number) => setCauTruc((p) => p.filter((_, idx) => idx !== i));

  const applyMau = (mauId: string) => {
    const mau = mauList.find((m) => m.id === mauId);
    if (mau) {
      setSelectedMon(mau.monHocId);
      dtForm.setFieldsValue({ monHocId: mau.monHocId });
      setCauTruc(mau.cauTruc.map((r) => ({ ...r })));
    }
  };

  const taoDe = async () => {
    try {
      const vals = await dtForm.validateFields();
      if (cauTruc.length === 0) {
        message.error('Vui lòng thêm ít nhất một dòng cấu trúc đề thi!');
        return;
      }
      const selected: string[] = [];
      for (const row of cauTruc) {
        const pool = chList.filter(
          (q) =>
            q.monHocId === vals.monHocId &&
            q.mucDoKho === row.mucDoKho &&
            q.khoiKienThucId === row.khoiKienThucId &&
            !selected.includes(q.id)
        );
        if (pool.length < row.soCauHoi) {
          const khoi = khoiList.find((k) => k.id === row.khoiKienThucId)?.ten || '';
          message.error(
            `Không đủ câu hỏi: Mức "${row.mucDoKho}" - Khối "${khoi}" (cần ${row.soCauHoi}, có ${pool.length})`,
            5
          );
          return;
        }
        selected.push(
          ...[...pool]
            .sort(() => Math.random() - 0.5)
            .slice(0, row.soCauHoi)
            .map((q) => q.id)
        );
      }
      const count = deList.length + 1;
      const newDe: DeThi = {
        id: uid(),
        maDe: `DE${String(count).padStart(3, '0')}`,
        tenDe: vals.tenDe,
        monHocId: vals.monHocId,
        mauDeThiId: selectedMau,
        cauHoiIds: selected,
        cauTruc: cauTruc.map((r) => ({ ...r })),
        createdAt: new Date().toISOString(),
      };
      setDeList((p) => [...p, newDe]);
      message.success(`Tạo đề thi thành công! Mã: ${newDe.maDe} — ${selected.length} câu hỏi`, 4);
      dtForm.resetFields();
      setCauTruc([]);
      setSelectedMau(undefined);
      setSelectedMon(undefined);
    } catch {}
  };

  const saveMauHandler = async () => {
    try {
      const vals = await mauForm.validateFields();
      if (!selectedMon || cauTruc.length === 0) {
        message.error('Cần có môn học và cấu trúc!');
        return;
      }
      setMauList((p) => [
        ...p,
        {
          id: uid(),
          ten: vals.tenMau,
          monHocId: selectedMon,
          cauTruc: cauTruc.map((r) => ({ ...r })),
          createdAt: new Date().toISOString(),
        },
      ]);
      setMauModal(false);
      mauForm.resetFields();
      message.success('Đã lưu mẫu cấu trúc đề thi');
    } catch {}
  };

  return (
    <Tabs activeKey={dtTab} onChange={setDtTab}>
      <TabPane tab={<span><ThunderboltOutlined /> Tạo Đề Thi</span>} key="tao">
        <Card className="bai2-section-card" title="Thông tin đề thi" style={{ marginBottom: 16 }}>
          <Form form={dtForm} layout="vertical">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="tenDe"
                  label="Tên đề thi"
                  rules={[{ required: true, message: 'Nhập tên đề!' }]}
                >
                  <Input placeholder="VD: Đề thi giữa kỳ..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="monHocId"
                  label="Môn học"
                  rules={[{ required: true, message: 'Chọn môn!' }]}
                >
                  <Select
                    placeholder="-- Chọn môn --"
                    onChange={(v: string) => setSelectedMon(v)}
                  >
                    {monList.map((m) => (
                      <Option key={m.id} value={m.id}>
                        {m.tenMon}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Dùng mẫu cấu trúc">
                  <Select
                    allowClear
                    placeholder="-- Không dùng mẫu --"
                    value={selectedMau}
                    onChange={(v: string) => {
                      setSelectedMau(v);
                      if (v) applyMau(v);
                      else setCauTruc([]);
                    }}
                  >
                    {mauList.map((m) => (
                      <Option key={m.id} value={m.id}>
                        {m.ten} ({monList.find((x) => x.id === m.monHocId)?.maMon})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card
          className="bai2-section-card"
          title="Cấu trúc đề thi"
          extra={
            <Button icon={<PlusOutlined />} onClick={addRow} size="small">
              Thêm dòng
            </Button>
          }
          style={{ marginBottom: 16 }}
        >
          {cauTruc.length === 0 ? (
            <Empty description="Chưa có cấu trúc. Nhấn 'Thêm dòng' hoặc chọn mẫu có sẵn." />
          ) : (
            <Table
              dataSource={cauTruc.map((r, i) => ({ ...r, _idx: i }))}
              rowKey="_idx"
              pagination={false}
              size="small"
              bordered
              columns={[
                {
                  title: 'Mức độ khó',
                  dataIndex: 'mucDoKho',
                  render: (v: any, r: any) => (
                    <Select
                      value={v}
                      onChange={(x: any) => updateRow(r._idx, 'mucDoKho', x)}
                      style={{ width: 130 }}
                    >
                      {DIFF_LEVELS.map((d) => (
                        <Option key={d} value={d}>
                          <Tag color={DIFF_COLOR[d]}>{d}</Tag>
                        </Option>
                      ))}
                    </Select>
                  ),
                },
                {
                  title: 'Khối kiến thức',
                  dataIndex: 'khoiKienThucId',
                  render: (v: any, r: any) => (
                    <Select
                      value={v}
                      onChange={(x: any) => updateRow(r._idx, 'khoiKienThucId', x)}
                      style={{ width: 150 }}
                    >
                      {khoiList.map((k) => (
                        <Option key={k.id} value={k.id}>
                          {k.ten}
                        </Option>
                      ))}
                    </Select>
                  ),
                },
                {
                  title: 'Số câu hỏi',
                  dataIndex: 'soCauHoi',
                  width: 110,
                  render: (v: any, r: any) => (
                    <InputNumber
                      min={1}
                      value={v}
                      onChange={(x) => updateRow(r._idx, 'soCauHoi', x || 1)}
                      style={{ width: 80 }}
                    />
                  ),
                },
                {
                  title: 'Câu có sẵn',
                  align: 'center' as const,
                  width: 110,
                  render: (_: unknown, r: any) => {
                    const mon = dtForm.getFieldValue('monHocId');
                    if (!mon) return <Text type="secondary">—</Text>;
                    const avail = chList.filter(
                      (q) =>
                        q.monHocId === mon &&
                        q.mucDoKho === r.mucDoKho &&
                        q.khoiKienThucId === r.khoiKienThucId
                    ).length;
                    return <Tag color={avail >= r.soCauHoi ? 'success' : 'error'}>{avail} câu</Tag>;
                  },
                },
                {
                  title: '',
                  width: 50,
                  align: 'center' as const,
                  render: (_: unknown, r: any) => (
                    <Button
                      icon={<DeleteOutlined />}
                      size="small"
                      danger
                      onClick={() => removeRow(r._idx)}
                    />
                  ),
                },
              ]}
            />
          )}
        </Card>

        <Space>
          <Button type="primary" icon={<ThunderboltOutlined />} size="large" onClick={taoDe}>
            Tạo Đề Thi
          </Button>
          {cauTruc.length > 0 && selectedMon && (
            <Button icon={<SaveOutlined />} size="large" onClick={() => setMauModal(true)}>
              Lưu Mẫu Cấu Trúc
            </Button>
          )}
        </Space>
      </TabPane>

      <TabPane tab={<span><FileTextOutlined /> Danh Sách Đề Thi ({deList.length})</span>} key="danh-sach">
        <Table
          dataSource={deList}
          rowKey="id"
          size="middle"
          bordered
          locale={{ emptyText: <Empty description="Chưa có đề thi nào" /> }}
          columns={[
            {
              title: 'Mã đề',
              dataIndex: 'maDe',
              render: (t: string) => <Tag color="blue">{t}</Tag>,
              width: 90,
            },
            {
              title: 'Tên đề thi',
              dataIndex: 'tenDe',
              render: (t: string) => <Text strong>{t}</Text>,
            },
            {
              title: 'Môn học',
              dataIndex: 'monHocId',
              render: (id: string) => monList.find((m) => m.id === id)?.tenMon || '—',
              width: 180,
            },
            {
              title: 'Số câu',
              dataIndex: 'cauHoiIds',
              render: (ids: string[]) => <Tag color="green">{ids.length} câu</Tag>,
              width: 80,
              align: 'center' as const,
            },
            {
              title: 'Ngày tạo',
              dataIndex: 'createdAt',
              render: (d: string) => new Date(d).toLocaleDateString('vi-VN'),
              width: 110,
            },
            {
              title: 'Thao tác',
              align: 'center' as const,
              width: 110,
              render: (_: unknown, r: DeThi) => (
                <Space>
                  <Tooltip title="Xem đề thi">
                    <Button
                      icon={<EyeOutlined />}
                      size="small"
                      onClick={() => {
                        setViewDe(r);
                        setViewDeModal(true);
                      }}
                    />
                  </Tooltip>
                  <Popconfirm
                    title="Xác nhận xóa đề thi?"
                    onConfirm={() => {
                      setDeList((p) => p.filter((d) => d.id !== r.id));
                      message.success('Đã xóa');
                    }}
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
      </TabPane>

      <TabPane tab={<span><AppstoreOutlined /> Mẫu Cấu Trúc ({mauList.length})</span>} key="mau">
        <Table
          dataSource={mauList}
          rowKey="id"
          size="middle"
          bordered
          locale={{
            emptyText: <Empty description="Chưa có mẫu nào. Tạo đề thi và lưu cấu trúc!" />,
          }}
          columns={[
            {
              title: 'Tên mẫu',
              dataIndex: 'ten',
              render: (t: string) => <Text strong>{t}</Text>,
            },
            {
              title: 'Môn học',
              dataIndex: 'monHocId',
              render: (id: string) => monList.find((m) => m.id === id)?.tenMon || '—',
              width: 180,
            },
            {
              title: 'Cấu trúc',
              dataIndex: 'cauTruc',
              render: (ct: CauTrucDeThi[]) => (
                <Space wrap>
                  {ct.map((r, i) => (
                    <Tag key={i} color={DIFF_COLOR[r.mucDoKho]}>
                      {r.soCauHoi} {r.mucDoKho} / {khoiList.find((k) => k.id === r.khoiKienThucId)?.ten}
                    </Tag>
                  ))}
                </Space>
              ),
            },
            {
              title: 'Ngày tạo',
              dataIndex: 'createdAt',
              render: (d: string) => new Date(d).toLocaleDateString('vi-VN'),
              width: 110,
            },
            {
              title: 'Thao tác',
              align: 'center' as const,
              width: 130,
              render: (_: unknown, r: MauDeThi) => (
                <Space>
                  <Tooltip title="Dùng mẫu này">
                    <Button
                      size="small"
                      icon={<ThunderboltOutlined />}
                      type="primary"
                      onClick={() => {
                        setDtTab('tao');
                        setSelectedMau(r.id);
                        applyMau(r.id);
                      }}
                    >
                      Dùng
                    </Button>
                  </Tooltip>
                  <Popconfirm
                    title="Xóa mẫu này?"
                    onConfirm={() => {
                      setMauList((p) => p.filter((m) => m.id !== r.id));
                      message.success('Đã xóa');
                    }}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                  >
                    <Button icon={<DeleteOutlined />} size="small" danger />
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </TabPane>

      <Modal
        title="Lưu Mẫu Cấu Trúc Đề Thi"
        visible={mauModal}
        onOk={saveMauHandler}
        onCancel={() => setMauModal(false)}
        okText="Lưu mẫu"
        cancelText="Hủy"
      >
        <Form form={mauForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="tenMau"
            label="Tên mẫu"
            rules={[{ required: true, message: 'Nhập tên mẫu!' }]}
          >
            <Input placeholder="VD: Mẫu đề giữa kỳ CNTT101..." />
          </Form.Item>
        </Form>
        <Alert
          message={`Sẽ lưu cấu trúc ${cauTruc.length} dòng cho môn: ${
            monList.find((m) => m.id === selectedMon)?.tenMon || '—'
          }`}
          type="info"
          showIcon
        />
      </Modal>

      <Modal
        title={`Chi Tiết Đề Thi — ${viewDe?.maDe}`}
        visible={viewDeModal}
        onCancel={() => setViewDeModal(false)}
        footer={<Button onClick={() => setViewDeModal(false)}>Đóng</Button>}
        width={640}
      >
        {viewDe && (
          <>
            <Space style={{ marginBottom: 12 }} wrap>
              <Tag color="blue">{viewDe.maDe}</Tag>
              <Text strong>{viewDe.tenDe}</Text>
              <Tag color="green">{viewDe.cauHoiIds.length} câu hỏi</Tag>
              <Text type="secondary">{monList.find((m) => m.id === viewDe.monHocId)?.tenMon}</Text>
              <Text type="secondary">{new Date(viewDe.createdAt).toLocaleDateString('vi-VN')}</Text>
            </Space>
            <Divider />
            <div style={{ maxHeight: 440, overflowY: 'auto' }}>
              {viewDe.cauHoiIds.map((qid, idx) => {
                const q = chList.find((x) => x.id === qid);
                if (!q) return null;
                return (
                  <div key={qid} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <Space align="start">
                      <Text strong style={{ color: '#1890ff', minWidth: 28 }}>
                        {idx + 1}.
                      </Text>
                      <div>
                        <div style={{ lineHeight: 1.7, marginBottom: 6 }}>{q.noiDung}</div>
                        <Space>
                          <Tag color={DIFF_COLOR[q.mucDoKho]}>{q.mucDoKho}</Tag>
                          <Tag>{khoiList.find((k) => k.id === q.khoiKienThucId)?.ten}</Tag>
                        </Space>
                      </div>
                    </Space>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Modal>
    </Tabs>
  );
};
