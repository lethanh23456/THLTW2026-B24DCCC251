import { DifficultyLevel, KhoiKienThuc, MonHoc, CauHoi } from './types';

export const SK = {
  KHOI: 'qb_khoi',
  MON: 'qb_mon',
  CH: 'qb_ch',
  MAU: 'qb_mau',
  DE: 'qb_de',
};

export const load = <T,>(k: string, fb: T): T => {
  try {
    const r = localStorage.getItem(k);
    return r ? JSON.parse(r) : fb;
  } catch {
    return fb;
  }
};

export const save = <T,>(k: string, d: T) => localStorage.setItem(k, JSON.stringify(d));

export const uid = () => Math.random().toString(36).slice(2, 10);

export const SEED_KHOI: KhoiKienThuc[] = [
  { id: 'k1', ten: 'Tổng quan', moTa: 'Kiến thức cơ bản, giới thiệu' },
  { id: 'k2', ten: 'Chuyên sâu', moTa: 'Kiến thức nâng cao, chuyên biệt' },
  { id: 'k3', ten: 'Ứng dụng', moTa: 'Thực hành, bài tập tình huống' },
];

export const SEED_MON: MonHoc[] = [
  { id: 'm1', maMon: 'CNTT101', tenMon: 'Nhập môn Lập trình', soTinChi: 3 },
  { id: 'm2', maMon: 'MATH201', tenMon: 'Giải tích', soTinChi: 4 },
  { id: 'm3', maMon: 'DB301', tenMon: 'Cơ sở dữ liệu', soTinChi: 3 },
];

export const SEED_CH: CauHoi[] = [
  {
    id: 'q1',
    maCauHoi: 'Q001',
    monHocId: 'm1',
    noiDung: 'Giải thích khái niệm biến và kiểu dữ liệu trong lập trình.',
    mucDoKho: 'Dễ',
    khoiKienThucId: 'k1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q2',
    maCauHoi: 'Q002',
    monHocId: 'm1',
    noiDung: 'Trình bày sự khác biệt giữa lập trình hướng đối tượng và lập trình hàm.',
    mucDoKho: 'Trung bình',
    khoiKienThucId: 'k2',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q3',
    maCauHoi: 'Q003',
    monHocId: 'm1',
    noiDung: 'Xây dựng thuật toán sắp xếp nhanh (quicksort) và phân tích độ phức tạp.',
    mucDoKho: 'Khó',
    khoiKienThucId: 'k3',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q4',
    maCauHoi: 'Q004',
    monHocId: 'm1',
    noiDung: 'Thiết kế hệ thống quản lý sinh viên sử dụng các nguyên tắc SOLID.',
    mucDoKho: 'Rất khó',
    khoiKienThucId: 'k2',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q5',
    maCauHoi: 'Q005',
    monHocId: 'm2',
    noiDung: 'Nêu định nghĩa giới hạn của hàm số tại một điểm.',
    mucDoKho: 'Dễ',
    khoiKienThucId: 'k1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q6',
    maCauHoi: 'Q006',
    monHocId: 'm2',
    noiDung: "Chứng minh quy tắc L'Hôpital và nêu điều kiện áp dụng.",
    mucDoKho: 'Rất khó',
    khoiKienThucId: 'k2',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q7',
    maCauHoi: 'Q007',
    monHocId: 'm3',
    noiDung: 'Phân biệt khóa chính và khóa ngoại trong mô hình quan hệ.',
    mucDoKho: 'Dễ',
    khoiKienThucId: 'k1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q8',
    maCauHoi: 'Q008',
    monHocId: 'm3',
    noiDung: 'Viết câu lệnh SQL tạo bảng và thêm ràng buộc toàn vẹn.',
    mucDoKho: 'Trung bình',
    khoiKienThucId: 'k3',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q9',
    maCauHoi: 'Q009',
    monHocId: 'm3',
    noiDung: 'Phân tích các dạng chuẩn hóa (1NF, 2NF, 3NF) và cho ví dụ minh họa.',
    mucDoKho: 'Khó',
    khoiKienThucId: 'k2',
    createdAt: new Date().toISOString(),
  },
];

export const DIFF_COLOR: Record<DifficultyLevel, string> = {
  'Dễ': 'success',
  'Trung bình': 'warning',
  'Khó': 'orange',
  'Rất khó': 'error',
};

export const DIFF_LEVELS: DifficultyLevel[] = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

export const NAV_ITEMS = [
  { key: 'khoi', icon: 'AppstoreOutlined', label: 'Khối Kiến Thức' },
  { key: 'mon', icon: 'BookOutlined', label: 'Môn Học' },
  { key: 'cauhoi', icon: 'QuestionCircleOutlined', label: 'Câu Hỏi' },
  { key: 'dethi', icon: 'FileTextOutlined', label: 'Đề Thi' },
];
