import { Club, Application, HistoryAction } from './types';

export const mockClubs: Club[] = [
  { id: 'C1', avatar: 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg', name: 'CLB Âm nhạc', foundedDate: '2023-01-15', description: 'Tổ chức các sự kiện âm nhạc, ca hát và giao lưu văn nghệ', manager: 'Nguyễn Văn A', isActive: true },
  { id: 'C2', avatar: 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg', name: 'CLB Kỹ năng mềm', foundedDate: '2022-11-20', description: 'Đào tạo kỹ năng mềm, thuyết trình, làm việc nhóm', manager: 'Trần Thị B', isActive: true },
  { id: 'C3', avatar: 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg', name: 'CLB Cầu lông', foundedDate: '2024-02-10', description: 'Rèn luyện sức khỏe, giao lưu thể thao', manager: 'Phạm Minh C', isActive: false },
];

export const mockApplications: Application[] = [
  { id: 'A1', fullName: 'Lê Thanh K', email: 'k@example.com', phone: '0123456789', gender: 'Male', address: 'Hà Nội', skills: 'Hát, Đàn guitar', clubId: 'C1', reason: 'Yêu âm nhạc', status: 'Pending' },
  { id: 'A2', fullName: 'Phạm Thị D', email: 'd@example.com', phone: '0987654321', gender: 'Female', address: 'Hồ Chí Minh', skills: 'Giao tiếp tốt, MC', clubId: 'C2', reason: 'Muốn học hỏi giao tiếp', status: 'Approved' },
  { id: 'A3', fullName: 'Hoàng Văn E', email: 'e@example.com', phone: '0912345678', gender: 'Male', address: 'Đà Nẵng', skills: 'Không rõ', clubId: 'C1', reason: 'Thích thì tham gia', status: 'Rejected', rejectReason: 'Lý do đăng ký quá sơ sài' },
  { id: 'A4', fullName: 'Ngô Tấn F', email: 'f@example.com', phone: '0933445566', gender: 'Male', address: 'Cần Thơ', skills: 'Đánh cầu lông tốt', clubId: 'C3', reason: 'Rèn luyện sức khỏe', status: 'Pending' },
];

export const mockHistories: HistoryAction[] = [
  { id: 'H1', applicationId: 'A2', adminName: 'Admin', action: 'Approved', timestamp: '2025-04-09T17:09:00Z' },
  { id: 'H2', applicationId: 'A3', adminName: 'Admin', action: 'Rejected', timestamp: '2025-04-09T17:15:00Z', reason: 'Lý do đăng ký quá sơ sài' },
];
