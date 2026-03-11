export type DifficultyLevel = 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';

export interface KhoiKienThuc {
  id: string;
  ten: string;
  moTa?: string;
}

export interface MonHoc {
  id: string;
  maMon: string;
  tenMon: string;
  soTinChi: number;
}

export interface CauHoi {
  id: string;
  maCauHoi: string;
  monHocId: string;
  noiDung: string;
  mucDoKho: DifficultyLevel;
  khoiKienThucId: string;
  createdAt: string;
}

export interface CauTrucDeThi {
  mucDoKho: DifficultyLevel;
  khoiKienThucId: string;
  soCauHoi: number;
}

export interface MauDeThi {
  id: string;
  ten: string;
  monHocId: string;
  cauTruc: CauTrucDeThi[];
  createdAt: string;
}

export interface DeThi {
  id: string;
  maDe: string;
  tenDe: string;
  monHocId: string;
  mauDeThiId?: string;
  cauHoiIds: string[];
  cauTruc: CauTrucDeThi[];
  createdAt: string;
}
