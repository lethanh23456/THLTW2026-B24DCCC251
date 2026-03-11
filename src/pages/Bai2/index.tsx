import { useState, useEffect } from 'react';
import {
  Layout, Menu, Table, Button, Modal, Form, Input, InputNumber,
  Select, Tag, Space, Typography, Card, Tabs, Badge, Tooltip,
  Popconfirm, Empty, Row, Col, Divider, Alert, message
} from 'antd';
import {
  BookOutlined, QuestionCircleOutlined, FileTextOutlined,
  AppstoreOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
  EyeOutlined, SaveOutlined, ThunderboltOutlined, ReloadOutlined
} from '@ant-design/icons';
import './styles.less';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;


type DifficultyLevel = 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';

interface KhoiKienThuc { id: string; ten: string; moTa?: string; }
interface MonHoc { id: string; maMon: string; tenMon: string; soTinChi: number; }
interface CauHoi {
  id: string; maCauHoi: string; monHocId: string; noiDung: string;
  mucDoKho: DifficultyLevel; khoiKienThucId: string; createdAt: string;
}
interface CauTrucDeThi { mucDoKho: DifficultyLevel; khoiKienThucId: string; soCauHoi: number; }
interface MauDeThi { id: string; ten: string; monHocId: string; cauTruc: CauTrucDeThi[]; createdAt: string; }
interface DeThi {
  id: string; maDe: string; tenDe: string; monHocId: string;
  mauDeThiId?: string; cauHoiIds: string[]; cauTruc: CauTrucDeThi[]; createdAt: string;
}


const SK = { KHOI: 'qb_khoi', MON: 'qb_mon', CH: 'qb_ch', MAU: 'qb_mau', DE: 'qb_de' };
const load = <T,>(k: string, fb: T): T => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; } };
const save = <T,>(k: string, d: T) => localStorage.setItem(k, JSON.stringify(d));
const uid = () => Math.random().toString(36).slice(2, 10);


const SEED_KHOI: KhoiKienThuc[] = [
  { id: 'k1', ten: 'Tổng quan', moTa: 'Kiến thức cơ bản, giới thiệu' },
  { id: 'k2', ten: 'Chuyên sâu', moTa: 'Kiến thức nâng cao, chuyên biệt' },
  { id: 'k3', ten: 'Ứng dụng', moTa: 'Thực hành, bài tập tình huống' },
];
const SEED_MON: MonHoc[] = [
  { id: 'm1', maMon: 'CNTT101', tenMon: 'Nhập môn Lập trình', soTinChi: 3 },
  { id: 'm2', maMon: 'MATH201', tenMon: 'Giải tích', soTinChi: 4 },
  { id: 'm3', maMon: 'DB301', tenMon: 'Cơ sở dữ liệu', soTinChi: 3 },
];
const SEED_CH: CauHoi[] = [
  { id: 'q1', maCauHoi: 'Q001', monHocId: 'm1', noiDung: 'Giải thích khái niệm biến và kiểu dữ liệu trong lập trình.', mucDoKho: 'Dễ', khoiKienThucId: 'k1', createdAt: new Date().toISOString() },
  { id: 'q2', maCauHoi: 'Q002', monHocId: 'm1', noiDung: 'Trình bày sự khác biệt giữa lập trình hướng đối tượng và lập trình hàm.', mucDoKho: 'Trung bình', khoiKienThucId: 'k2', createdAt: new Date().toISOString() },
  { id: 'q3', maCauHoi: 'Q003', monHocId: 'm1', noiDung: 'Xây dựng thuật toán sắp xếp nhanh (quicksort) và phân tích độ phức tạp.', mucDoKho: 'Khó', khoiKienThucId: 'k3', createdAt: new Date().toISOString() },
  { id: 'q4', maCauHoi: 'Q004', monHocId: 'm1', noiDung: 'Thiết kế hệ thống quản lý sinh viên sử dụng các nguyên tắc SOLID.', mucDoKho: 'Rất khó', khoiKienThucId: 'k2', createdAt: new Date().toISOString() },
  { id: 'q5', maCauHoi: 'Q005', monHocId: 'm2', noiDung: 'Nêu định nghĩa giới hạn của hàm số tại một điểm.', mucDoKho: 'Dễ', khoiKienThucId: 'k1', createdAt: new Date().toISOString() },
  { id: 'q6', maCauHoi: 'Q006', monHocId: 'm2', noiDung: 'Chứng minh quy tắc L\'Hôpital và nêu điều kiện áp dụng.', mucDoKho: 'Rất khó', khoiKienThucId: 'k2', createdAt: new Date().toISOString() },
  { id: 'q7', maCauHoi: 'Q007', monHocId: 'm3', noiDung: 'Phân biệt khóa chính và khóa ngoại trong mô hình quan hệ.', mucDoKho: 'Dễ', khoiKienThucId: 'k1', createdAt: new Date().toISOString() },
  { id: 'q8', maCauHoi: 'Q008', monHocId: 'm3', noiDung: 'Viết câu lệnh SQL tạo bảng và thêm ràng buộc toàn vẹn.', mucDoKho: 'Trung bình', khoiKienThucId: 'k3', createdAt: new Date().toISOString() },
  { id: 'q9', maCauHoi: 'Q009', monHocId: 'm3', noiDung: 'Phân tích các dạng chuẩn hóa (1NF, 2NF, 3NF) và cho ví dụ minh họa.', mucDoKho: 'Khó', khoiKienThucId: 'k2', createdAt: new Date().toISOString() },
];

const DIFF_COLOR: Record<DifficultyLevel, string> = {
  'Dễ': 'success', 'Trung bình': 'warning', 'Khó': 'orange', 'Rất khó': 'error'
};
const DIFF_LEVELS: DifficultyLevel[] = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

const NAV_ITEMS = [
  { key: 'khoi', icon: <AppstoreOutlined />, label: 'Khối Kiến Thức' },
  { key: 'mon', icon: <BookOutlined />, label: 'Môn Học' },
  { key: 'cauhoi', icon: <QuestionCircleOutlined />, label: 'Câu Hỏi' },
  { key: 'dethi', icon: <FileTextOutlined />, label: 'Đề Thi' },
];

export default function Bai2() {
  const [nav, setNav] = useState('khoi');

  const [khoiList, setKhoiList] = useState<KhoiKienThuc[]>(() => { const s = load<KhoiKienThuc[]>(SK.KHOI, []); return s.length ? s : SEED_KHOI; });
  const [monList, setMonList] = useState<MonHoc[]>(() => { const s = load<MonHoc[]>(SK.MON, []); return s.length ? s : SEED_MON; });
  const [chList, setChList] = useState<CauHoi[]>(() => { const s = load<CauHoi[]>(SK.CH, []); return s.length ? s : SEED_CH; });
  const [mauList, setMauList] = useState<MauDeThi[]>(() => load(SK.MAU, []));
  const [deList, setDeList] = useState<DeThi[]>(() => load(SK.DE, []));

  useEffect(() => { save(SK.KHOI, khoiList); }, [khoiList]);
  useEffect(() => { save(SK.MON, monList); }, [monList]);
  useEffect(() => { save(SK.CH, chList); }, [chList]);
  useEffect(() => { save(SK.MAU, mauList); }, [mauList]);
  useEffect(() => { save(SK.DE, deList); }, [deList]);


  const [khoiForm] = Form.useForm();
  const [khoiModal, setKhoiModal] = useState(false);
  const [editKhoi, setEditKhoi] = useState<KhoiKienThuc | null>(null);

  const openKhoi = (k?: KhoiKienThuc) => {
    setEditKhoi(k || null);
    khoiForm.setFieldsValue(k ? { ten: k.ten, moTa: k.moTa } : { ten: '', moTa: '' });
    setKhoiModal(true);
  };
  const saveKhoi = async () => {
    const vals = await khoiForm.validateFields();
    if (editKhoi) setKhoiList(p => p.map(k => k.id === editKhoi.id ? { ...k, ...vals } : k));
    else setKhoiList(p => [...p, { id: uid(), ...vals }]);
    setKhoiModal(false);
    message.success(editKhoi ? 'Đã cập nhật khối kiến thức' : 'Đã thêm khối kiến thức');
  };

  const [monForm] = Form.useForm();
  const [monModal, setMonModal] = useState(false);
  const [editMon, setEditMon] = useState<MonHoc | null>(null);

  const openMon = (m?: MonHoc) => {
    setEditMon(m || null);
    monForm.setFieldsValue(m ? { maMon: m.maMon, tenMon: m.tenMon, soTinChi: m.soTinChi } : { maMon: '', tenMon: '', soTinChi: 3 });
    setMonModal(true);
  };
  const saveMon = async () => {
    const vals = await monForm.validateFields();
    if (editMon) setMonList(p => p.map(m => m.id === editMon.id ? { ...m, ...vals } : m));
    else setMonList(p => [...p, { id: uid(), ...vals }]);
    setMonModal(false);
    message.success(editMon ? 'Đã cập nhật môn học' : 'Đã thêm môn học');
  };

  
  const [chForm] = Form.useForm();
  const [chModal, setChModal] = useState(false);
  const [editCh, setEditCh] = useState<CauHoi | null>(null);
  const [chFilter, setChFilter] = useState<{ monHocId?: string; mucDoKho?: string; khoiKienThucId?: string }>({});
  const [viewChModal, setViewChModal] = useState(false);
  const [viewCh, setViewCh] = useState<CauHoi | null>(null);

  const openCh = (q?: CauHoi) => {
    setEditCh(q || null);
    chForm.setFieldsValue(q
      ? { monHocId: q.monHocId, noiDung: q.noiDung, mucDoKho: q.mucDoKho, khoiKienThucId: q.khoiKienThucId }
      : { monHocId: undefined, noiDung: '', mucDoKho: 'Dễ', khoiKienThucId: undefined }
    );
    setChModal(true);
  };
  const saveCh = async () => {
    const vals = await chForm.validateFields();
    if (editCh) {
      setChList(p => p.map(q => q.id === editCh.id ? { ...q, ...vals } : q));
    } else {
      const count = chList.length + 1;
      setChList(p => [...p, { id: uid(), maCauHoi: `Q${String(count).padStart(3, '0')}`, ...vals, createdAt: new Date().toISOString() }]);
    }
    setChModal(false);
    message.success(editCh ? 'Đã cập nhật câu hỏi' : 'Đã thêm câu hỏi');
  };

  const filteredCh = chList.filter(q => {
    if (chFilter.monHocId && q.monHocId !== chFilter.monHocId) return false;
    if (chFilter.mucDoKho && q.mucDoKho !== chFilter.mucDoKho) return false;
    if (chFilter.khoiKienThucId && q.khoiKienThucId !== chFilter.khoiKienThucId) return false;
    return true;
  });

 
  const [dtForm] = Form.useForm();
  const [mauForm] = Form.useForm();
  const [cauTruc, setCauTruc] = useState<CauTrucDeThi[]>([]);
  const [mauModal, setMauModal] = useState(false);
  const [viewDe, setViewDe] = useState<DeThi | null>(null);
  const [viewDeModal, setViewDeModal] = useState(false);
  const [dtTab, setDtTab] = useState('tao');
  const [selectedMau, setSelectedMau] = useState<string | undefined>();
  const [selectedMon, setSelectedMon] = useState<string | undefined>();

  const addRow = () => setCauTruc(p => [...p, { mucDoKho: 'Dễ', khoiKienThucId: khoiList[0]?.id || '', soCauHoi: 1 }]);
  const updateRow = (i: number, f: keyof CauTrucDeThi, v: string | number) =>
    setCauTruc(p => p.map((r, idx) => idx === i ? { ...r, [f]: v } : r));
  const removeRow = (i: number) => setCauTruc(p => p.filter((_, idx) => idx !== i));

  const applyMau = (mauId: string) => {
    const mau = mauList.find(m => m.id === mauId);
    if (mau) {
      setSelectedMon(mau.monHocId);
      dtForm.setFieldsValue({ monHocId: mau.monHocId });
      setCauTruc(mau.cauTruc.map(r => ({ ...r })));
    }
  };

  const taoDe = async () => {
    try {
      const vals = await dtForm.validateFields();
      if (cauTruc.length === 0) { message.error('Vui lòng thêm ít nhất một dòng cấu trúc đề thi!'); return; }
      const selected: string[] = [];
      for (const row of cauTruc) {
        const pool = chList.filter(q =>
          q.monHocId === vals.monHocId &&
          q.mucDoKho === row.mucDoKho &&
          q.khoiKienThucId === row.khoiKienThucId &&
          !selected.includes(q.id)
        );
        if (pool.length < row.soCauHoi) {
          const khoi = khoiList.find(k => k.id === row.khoiKienThucId)?.ten || '';
          message.error(`Không đủ câu hỏi: Mức "${row.mucDoKho}" - Khối "${khoi}" (cần ${row.soCauHoi}, có ${pool.length})`, 5);
          return;
        }
        selected.push(...[...pool].sort(() => Math.random() - 0.5).slice(0, row.soCauHoi).map(q => q.id));
      }
      const count = deList.length + 1;
      const newDe: DeThi = {
        id: uid(), maDe: `DE${String(count).padStart(3, '0')}`, tenDe: vals.tenDe,
        monHocId: vals.monHocId, mauDeThiId: selectedMau,
        cauHoiIds: selected, cauTruc: cauTruc.map(r => ({ ...r })), createdAt: new Date().toISOString(),
      };
      setDeList(p => [...p, newDe]);
      message.success(`Tạo đề thi thành công! Mã: ${newDe.maDe} — ${selected.length} câu hỏi`, 4);
      dtForm.resetFields(); setCauTruc([]); setSelectedMau(undefined); setSelectedMon(undefined);
    } catch {}
  };

  const saveMauHandler = async () => {
    try {
      const vals = await mauForm.validateFields();
      if (!selectedMon || cauTruc.length === 0) { message.error('Cần có môn học và cấu trúc!'); return; }
      setMauList(p => [...p, {
        id: uid(), ten: vals.tenMau, monHocId: selectedMon,
        cauTruc: cauTruc.map(r => ({ ...r })), createdAt: new Date().toISOString()
      }]);
      setMauModal(false); mauForm.resetFields();
      message.success('Đã lưu mẫu cấu trúc đề thi');
    } catch {}
  };



  const renderKhoi = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Danh Mục Khối Kiến Thức</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openKhoi()}>Thêm khối</Button>
      </div>
      <Table
        dataSource={khoiList} rowKey="id" size="middle" bordered
        locale={{ emptyText: <Empty description="Chưa có khối kiến thức" /> }}
        columns={[
          { title: 'STT', render: (_: unknown, __: unknown, i: number) => i + 1, width: 60, align: 'center' as const },
          { title: 'Tên khối', dataIndex: 'ten', render: (t: string) => <Tag color="blue" style={{ fontSize: 13 }}>{t}</Tag> },
          { title: 'Mô tả', dataIndex: 'moTa', render: (t: string) => t || <Text type="secondary">—</Text> },
          {
            title: 'Số câu hỏi', align: 'center' as const, width: 110,
            render: (_: unknown, r: KhoiKienThuc) => (
              <Badge count={chList.filter(q => q.khoiKienThucId === r.id).length} showZero style={{ backgroundColor: '#1890ff' }} />
            )
          },
          {
            title: 'Thao tác', align: 'center' as const, width: 120,
            render: (_: unknown, r: KhoiKienThuc) => (
              <Space>
                <Tooltip title="Sửa">
                  <Button icon={<EditOutlined />} size="small" onClick={() => openKhoi(r)} />
                </Tooltip>
                <Popconfirm title="Xác nhận xóa khối này?" onConfirm={() => { setKhoiList(p => p.filter(k => k.id !== r.id)); message.success('Đã xóa'); }} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
                  <Tooltip title="Xóa"><Button icon={<DeleteOutlined />} size="small" danger /></Tooltip>
                </Popconfirm>
              </Space>
            )
          },
        ]}
      />
      <Modal title={editKhoi ? 'Sửa Khối Kiến Thức' : 'Thêm Khối Kiến Thức'} visible={khoiModal} onOk={saveKhoi} onCancel={() => setKhoiModal(false)} okText="Lưu" cancelText="Hủy">
        <Form form={khoiForm} layout="vertical" style={{ marginTop: 16 }}>
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

  const renderMon = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Danh Mục Môn Học</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openMon()}>Thêm môn học</Button>
      </div>
      <Table
        dataSource={monList} rowKey="id" size="middle" bordered
        locale={{ emptyText: <Empty description="Chưa có môn học" /> }}
        columns={[
          { title: 'STT', render: (_: unknown, __: unknown, i: number) => i + 1, width: 60, align: 'center' as const },
          { title: 'Mã môn', dataIndex: 'maMon', render: (t: string) => <Tag color="purple">{t}</Tag>, width: 120 },
          { title: 'Tên môn học', dataIndex: 'tenMon', render: (t: string) => <Text strong>{t}</Text> },
          { title: 'Số tín chỉ', dataIndex: 'soTinChi', render: (n: number) => <Tag color="green">{n} TC</Tag>, width: 100, align: 'center' as const },
          {
            title: 'Câu hỏi', align: 'center' as const, width: 90,
            render: (_: unknown, r: MonHoc) => (
              <Badge count={chList.filter(q => q.monHocId === r.id).length} showZero style={{ backgroundColor: '#1890ff' }} />
            )
          },
          {
            title: 'Thao tác', align: 'center' as const, width: 120,
            render: (_: unknown, r: MonHoc) => (
              <Space>
                <Tooltip title="Sửa"><Button icon={<EditOutlined />} size="small" onClick={() => openMon(r)} /></Tooltip>
                <Popconfirm title="Xác nhận xóa môn này?" onConfirm={() => { setMonList(p => p.filter(m => m.id !== r.id)); message.success('Đã xóa'); }} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
                  <Tooltip title="Xóa"><Button icon={<DeleteOutlined />} size="small" danger /></Tooltip>
                </Popconfirm>
              </Space>
            )
          },
        ]}
      />
      <Modal title={editMon ? 'Sửa Môn Học' : 'Thêm Môn Học'} visible={monModal} onOk={saveMon} onCancel={() => setMonModal(false)} okText="Lưu" cancelText="Hủy">
        <Form form={monForm} layout="vertical" style={{ marginTop: 16 }}>
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

  const renderCauHoi = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Quản Lý Câu Hỏi</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openCh()}>Thêm câu hỏi</Button>
      </div>

      <Card className="bai2-section-card" size="small" style={{ marginBottom: 16 }}>
        <Row gutter={12} align="middle">
          <Col span={7}>
            <Select allowClear placeholder="Lọc theo môn học" style={{ width: '100%' }}
              onChange={(v: string) => setChFilter(p => ({ ...p, monHocId: v }))} value={chFilter.monHocId}>
              {monList.map(m => <Option key={m.id} value={m.id}>{m.tenMon}</Option>)}
            </Select>
          </Col>
          <Col span={7}>
            <Select allowClear placeholder="Lọc theo mức độ" style={{ width: '100%' }}
              onChange={(v: string) => setChFilter(p => ({ ...p, mucDoKho: v }))} value={chFilter.mucDoKho}>
              {DIFF_LEVELS.map(d => <Option key={d} value={d}><Tag color={DIFF_COLOR[d]}>{d}</Tag></Option>)}
            </Select>
          </Col>
          <Col span={7}>
            <Select allowClear placeholder="Lọc theo khối KT" style={{ width: '100%' }}
              onChange={(v: string) => setChFilter(p => ({ ...p, khoiKienThucId: v }))} value={chFilter.khoiKienThucId}>
              {khoiList.map(k => <Option key={k.id} value={k.id}>{k.ten}</Option>)}
            </Select>
          </Col>
          <Col span={3}>
            <Button icon={<ReloadOutlined />} onClick={() => setChFilter({})}>Reset</Button>
          </Col>
        </Row>
      </Card>

      <div style={{ marginBottom: 8 }}>
        <Text type="secondary">Hiển thị <Text strong>{filteredCh.length}</Text> / {chList.length} câu hỏi</Text>
      </div>

      <Table
        dataSource={filteredCh} rowKey="id" size="middle" bordered
        locale={{ emptyText: <Empty description="Không có câu hỏi phù hợp" /> }}
        columns={[
          { title: 'Mã', dataIndex: 'maCauHoi', render: (t: string) => <Tag color="blue">{t}</Tag>, width: 80 },
          { title: 'Môn học', dataIndex: 'monHocId', render: (id: string) => <Text type="secondary">{monList.find(m => m.id === id)?.tenMon || '—'}</Text>, width: 170 },
          {
            title: 'Nội dung câu hỏi', dataIndex: 'noiDung', ellipsis: true,
            render: (t: string) => <Tooltip title={t}><span>{t}</span></Tooltip>
          },
          { title: 'Mức độ', dataIndex: 'mucDoKho', render: (d: DifficultyLevel) => <Tag color={DIFF_COLOR[d]}>{d}</Tag>, width: 110 },
          { title: 'Khối KT', dataIndex: 'khoiKienThucId', render: (id: string) => <Tag>{khoiList.find(k => k.id === id)?.ten || '—'}</Tag>, width: 110 },
          {
            title: 'Thao tác', align: 'center' as const, width: 120,
            render: (_: unknown, r: CauHoi) => (
              <Space>
                <Tooltip title="Xem"><Button icon={<EyeOutlined />} size="small" onClick={() => { setViewCh(r); setViewChModal(true); }} /></Tooltip>
                <Tooltip title="Sửa"><Button icon={<EditOutlined />} size="small" onClick={() => openCh(r)} /></Tooltip>
                <Popconfirm title="Xác nhận xóa câu hỏi?" onConfirm={() => { setChList(p => p.filter(q => q.id !== r.id)); message.success('Đã xóa'); }} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
                  <Tooltip title="Xóa"><Button icon={<DeleteOutlined />} size="small" danger /></Tooltip>
                </Popconfirm>
              </Space>
            )
          },
        ]}
      />

      <Modal title={editCh ? 'Sửa Câu Hỏi' : 'Thêm Câu Hỏi'} visible={chModal} onOk={saveCh} onCancel={() => setChModal(false)} okText="Lưu" cancelText="Hủy" width={560}>
        <Form form={chForm} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="monHocId" label="Môn học" rules={[{ required: true, message: 'Chọn môn học!' }]}>
                <Select placeholder="-- Chọn môn --">
                  {monList.map(m => <Option key={m.id} value={m.id}>{m.tenMon}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="khoiKienThucId" label="Khối kiến thức" rules={[{ required: true, message: 'Chọn khối!' }]}>
                <Select placeholder="-- Chọn khối --">
                  {khoiList.map(k => <Option key={k.id} value={k.id}>{k.ten}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="mucDoKho" label="Mức độ khó" rules={[{ required: true }]}>
            <Select>
              {DIFF_LEVELS.map(d => <Option key={d} value={d}><Tag color={DIFF_COLOR[d]}>{d}</Tag></Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="noiDung" label="Nội dung câu hỏi" rules={[{ required: true, message: 'Nhập nội dung!' }]}>
            <Input.TextArea rows={4} placeholder="Nhập nội dung câu hỏi tự luận..." />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Chi Tiết Câu Hỏi" visible={viewChModal} onCancel={() => setViewChModal(false)} footer={<Button onClick={() => setViewChModal(false)}>Đóng</Button>}>
        {viewCh && (
          <div>
            <Space style={{ marginBottom: 12 }}>
              <Tag color="blue">{viewCh.maCauHoi}</Tag>
              <Tag color={DIFF_COLOR[viewCh.mucDoKho]}>{viewCh.mucDoKho}</Tag>
              <Tag>{khoiList.find(k => k.id === viewCh.khoiKienThucId)?.ten}</Tag>
            </Space>
            <Divider />
            <div><Text strong>Môn học: </Text><Text>{monList.find(m => m.id === viewCh.monHocId)?.tenMon}</Text></div>
            <Divider />
            <Text strong>Nội dung:</Text>
            <div style={{ marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 6, lineHeight: 1.8 }}>{viewCh.noiDung}</div>
          </div>
        )}
      </Modal>
    </>
  );

  const renderDeThi = () => (
    <Tabs activeKey={dtTab} onChange={setDtTab}>
      <TabPane tab={<span><ThunderboltOutlined /> Tạo Đề Thi</span>} key="tao">
        <Card className="bai2-section-card" title="Thông tin đề thi" style={{ marginBottom: 16 }}>
          <Form form={dtForm} layout="vertical">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="tenDe" label="Tên đề thi" rules={[{ required: true, message: 'Nhập tên đề!' }]}>
                  <Input placeholder="VD: Đề thi giữa kỳ..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="monHocId" label="Môn học" rules={[{ required: true, message: 'Chọn môn!' }]}>
                  <Select placeholder="-- Chọn môn --" onChange={(v: string) => setSelectedMon(v)}>
                    {monList.map(m => <Option key={m.id} value={m.id}>{m.tenMon}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Dùng mẫu cấu trúc">
                  <Select allowClear placeholder="-- Không dùng mẫu --" value={selectedMau}
                    onChange={(v: string) => { setSelectedMau(v); if (v) applyMau(v); else setCauTruc([]); }}>
                    {mauList.map(m => <Option key={m.id} value={m.id}>{m.ten} ({monList.find(x => x.id === m.monHocId)?.maMon})</Option>)}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card
          className="bai2-section-card"
          title="Cấu trúc đề thi"
          extra={<Button icon={<PlusOutlined />} onClick={addRow} size="small">Thêm dòng</Button>}
          style={{ marginBottom: 16 }}
        >
          {cauTruc.length === 0
            ? <Empty description="Chưa có cấu trúc. Nhấn 'Thêm dòng' hoặc chọn mẫu có sẵn." />
            : (
              <Table
                dataSource={cauTruc.map((r, i) => ({ ...r, _idx: i }))}
                rowKey="_idx" pagination={false} size="small" bordered
                columns={[
                  {
                    title: 'Mức độ khó', dataIndex: 'mucDoKho',
                    render: (v: DifficultyLevel, r: CauTrucDeThi & { _idx: number }) => (
                      <Select value={v} onChange={(x: DifficultyLevel) => updateRow(r._idx, 'mucDoKho', x)} style={{ width: 130 }}>
                        {DIFF_LEVELS.map(d => <Option key={d} value={d}><Tag color={DIFF_COLOR[d]}>{d}</Tag></Option>)}
                      </Select>
                    )
                  },
                  {
                    title: 'Khối kiến thức', dataIndex: 'khoiKienThucId',
                    render: (v: string, r: CauTrucDeThi & { _idx: number }) => (
                      <Select value={v} onChange={(x: string) => updateRow(r._idx, 'khoiKienThucId', x)} style={{ width: 150 }}>
                        {khoiList.map(k => <Option key={k.id} value={k.id}>{k.ten}</Option>)}
                      </Select>
                    )
                  },
                  {
                    title: 'Số câu hỏi', dataIndex: 'soCauHoi', width: 110,
                    render: (v: number, r: CauTrucDeThi & { _idx: number }) => (
                      <InputNumber min={1} value={v} onChange={(x) => updateRow(r._idx, 'soCauHoi', x || 1)} style={{ width: 80 }} />
                    )
                  },
                  {
                    title: 'Câu có sẵn', align: 'center' as const, width: 110,
                    render: (_: unknown, r: CauTrucDeThi & { _idx: number }) => {
                      const mon = dtForm.getFieldValue('monHocId');
                      if (!mon) return <Text type="secondary">—</Text>;
                      const avail = chList.filter(q => q.monHocId === mon && q.mucDoKho === r.mucDoKho && q.khoiKienThucId === r.khoiKienThucId).length;
                      return <Tag color={avail >= r.soCauHoi ? 'success' : 'error'}>{avail} câu</Tag>;
                    }
                  },
                  {
                    title: '', width: 50, align: 'center' as const,
                    render: (_: unknown, r: CauTrucDeThi & { _idx: number }) => (
                      <Button icon={<DeleteOutlined />} size="small" danger onClick={() => removeRow(r._idx)} />
                    )
                  },
                ]}
              />
            )}
        </Card>

        <Space>
          <Button type="primary" icon={<ThunderboltOutlined />} size="large" onClick={taoDe}>Tạo Đề Thi</Button>
          {cauTruc.length > 0 && selectedMon && (
            <Button icon={<SaveOutlined />} size="large" onClick={() => setMauModal(true)}>Lưu Mẫu Cấu Trúc</Button>
          )}
        </Space>
      </TabPane>

      <TabPane tab={<span><FileTextOutlined /> Danh Sách Đề Thi ({deList.length})</span>} key="danh-sach">
        <Table
          dataSource={deList} rowKey="id" size="middle" bordered
          locale={{ emptyText: <Empty description="Chưa có đề thi nào" /> }}
          columns={[
            { title: 'Mã đề', dataIndex: 'maDe', render: (t: string) => <Tag color="blue">{t}</Tag>, width: 90 },
            { title: 'Tên đề thi', dataIndex: 'tenDe', render: (t: string) => <Text strong>{t}</Text> },
            { title: 'Môn học', dataIndex: 'monHocId', render: (id: string) => monList.find(m => m.id === id)?.tenMon || '—', width: 180 },
            { title: 'Số câu', dataIndex: 'cauHoiIds', render: (ids: string[]) => <Tag color="green">{ids.length} câu</Tag>, width: 80, align: 'center' as const },
            { title: 'Ngày tạo', dataIndex: 'createdAt', render: (d: string) => new Date(d).toLocaleDateString('vi-VN'), width: 110 },
            {
              title: 'Thao tác', align: 'center' as const, width: 110,
              render: (_: unknown, r: DeThi) => (
                <Space>
                  <Tooltip title="Xem đề thi">
                    <Button icon={<EyeOutlined />} size="small" onClick={() => { setViewDe(r); setViewDeModal(true); }} />
                  </Tooltip>
                  <Popconfirm title="Xác nhận xóa đề thi?" onConfirm={() => { setDeList(p => p.filter(d => d.id !== r.id)); message.success('Đã xóa'); }} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
                    <Tooltip title="Xóa"><Button icon={<DeleteOutlined />} size="small" danger /></Tooltip>
                  </Popconfirm>
                </Space>
              )
            },
          ]}
        />
      </TabPane>

      <TabPane tab={<span><AppstoreOutlined /> Mẫu Cấu Trúc ({mauList.length})</span>} key="mau">
        <Table
          dataSource={mauList} rowKey="id" size="middle" bordered
          locale={{ emptyText: <Empty description="Chưa có mẫu nào. Tạo đề thi và lưu cấu trúc!" /> }}
          columns={[
            { title: 'Tên mẫu', dataIndex: 'ten', render: (t: string) => <Text strong>{t}</Text> },
            { title: 'Môn học', dataIndex: 'monHocId', render: (id: string) => monList.find(m => m.id === id)?.tenMon || '—', width: 180 },
            {
              title: 'Cấu trúc', dataIndex: 'cauTruc',
              render: (ct: CauTrucDeThi[]) => (
                <Space wrap>
                  {ct.map((r, i) => (
                    <Tag key={i} color={DIFF_COLOR[r.mucDoKho]}>
                      {r.soCauHoi} {r.mucDoKho} / {khoiList.find(k => k.id === r.khoiKienThucId)?.ten}
                    </Tag>
                  ))}
                </Space>
              )
            },
            { title: 'Ngày tạo', dataIndex: 'createdAt', render: (d: string) => new Date(d).toLocaleDateString('vi-VN'), width: 110 },
            {
              title: 'Thao tác', align: 'center' as const, width: 130,
              render: (_: unknown, r: MauDeThi) => (
                <Space>
                  <Tooltip title="Dùng mẫu này">
                    <Button size="small" icon={<ThunderboltOutlined />} type="primary"
                      onClick={() => { setDtTab('tao'); setSelectedMau(r.id); applyMau(r.id); }}>
                      Dùng
                    </Button>
                  </Tooltip>
                  <Popconfirm title="Xóa mẫu này?" onConfirm={() => { setMauList(p => p.filter(m => m.id !== r.id)); message.success('Đã xóa'); }} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
                    <Button icon={<DeleteOutlined />} size="small" danger />
                  </Popconfirm>
                </Space>
              )
            },
          ]}
        />
      </TabPane>
    </Tabs>
  );

  const SECTION: Record<string, () => JSX.Element> = {
    khoi: renderKhoi, mon: renderMon, cauhoi: renderCauHoi, dethi: renderDeThi
  };

  return (
    <Layout className="bai2-page" style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header style={{
        background: '#fff',
        borderBottom: '1px solid #e8e8e8',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: 60,
      }}>
   
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 40, flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e', lineHeight: 1.2 }}>Ngân Hàng Câu Hỏi</div>
            <div style={{ fontSize: 11, color: '#8c8c8c', lineHeight: 1.2 }}>Quản lý & Tạo đề thi</div>
          </div>
        </div>

      
        <Menu
          mode="horizontal"
          selectedKeys={[nav]}
          onClick={({ key }) => setNav(key)}
          style={{ border: 'none', flex: 1, background: 'transparent', lineHeight: '58px' }}
        >
          {NAV_ITEMS.map(item => (
            <Menu.Item key={item.key} icon={item.icon} style={{ fontWeight: 500 }}>{item.label}</Menu.Item>
          ))}
        </Menu>

       
        <div style={{ display: 'flex', gap: 24, flexShrink: 0, marginLeft: 24, alignItems: 'center', height: 60 }}>
          <div style={{ textAlign: 'center', lineHeight: 'normal' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1890ff', lineHeight: 1.2 }}>{chList.length}</div>
            <div style={{ fontSize: 11, color: '#8c8c8c', lineHeight: 1.2, marginTop: 2 }}>Câu hỏi</div>
          </div>
          <div style={{ width: 1, height: 28, background: '#e8e8e8', flexShrink: 0 }} />
          <div style={{ textAlign: 'center', lineHeight: 'normal' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#52c41a', lineHeight: 1.2 }}>{deList.length}</div>
            <div style={{ fontSize: 11, color: '#8c8c8c', lineHeight: 1.2, marginTop: 2 }}>Đề thi</div>
          </div>
        </div>
      </Header>

      
      <Layout style={{ background: '#f5f7fa' }}>
        <Content className="bai2-content" style={{ padding: '24px 32px' }}>
          <Card className="bai2-main-card" style={{ borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e8e8e8' }}>
            {SECTION[nav]?.()}
          </Card>
        </Content>
      </Layout>

  
      <Modal title="Lưu Mẫu Cấu Trúc Đề Thi" visible={mauModal} onOk={saveMauHandler} onCancel={() => setMauModal(false)} okText="Lưu mẫu" cancelText="Hủy">
        <Form form={mauForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="tenMau" label="Tên mẫu" rules={[{ required: true, message: 'Nhập tên mẫu!' }]}>
            <Input placeholder="VD: Mẫu đề giữa kỳ CNTT101..." />
          </Form.Item>
        </Form>
        <Alert
          message={`Sẽ lưu cấu trúc ${cauTruc.length} dòng cho môn: ${monList.find(m => m.id === selectedMon)?.tenMon || '—'}`}
          type="info" showIcon
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
              <Text type="secondary">{monList.find(m => m.id === viewDe.monHocId)?.tenMon}</Text>
              <Text type="secondary">{new Date(viewDe.createdAt).toLocaleDateString('vi-VN')}</Text>
            </Space>
            <Divider />
            <div style={{ maxHeight: 440, overflowY: 'auto' }}>
              {viewDe.cauHoiIds.map((qid, idx) => {
                const q = chList.find(x => x.id === qid);
                if (!q) return null;
                return (
                  <div key={qid} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <Space align="start">
                      <Text strong style={{ color: '#1890ff', minWidth: 28 }}>{idx + 1}.</Text>
                      <div>
                        <div style={{ lineHeight: 1.7, marginBottom: 6 }}>{q.noiDung}</div>
                        <Space>
                          <Tag color={DIFF_COLOR[q.mucDoKho]}>{q.mucDoKho}</Tag>
                          <Tag>{khoiList.find(k => k.id === q.khoiKienThucId)?.ten}</Tag>
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
    </Layout>
  );
}