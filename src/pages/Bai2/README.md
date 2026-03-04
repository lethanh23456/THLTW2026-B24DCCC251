# Ứng dụng Quản lý Tiến độ Học tập

## Tổng quan
Ứng dụng giúp người dùng theo dõi và quản lý tiến độ học tập các môn học, thiết lập mục tiêu học tập hàng tháng.

## Tính năng

### 1. Quản lý Môn học
- Thêm, sửa, xóa danh mục môn học
- Mỗi môn học có tên và màu sắc riêng
- Các danh mục mặc định: Toán, Văn, Anh, Khoa học, Công nghệ,...

### 2. Quản lý Tiến độ Học tập
- Ghi lại các buổi học của từng môn
- Thông tin chi tiết: Ngày giờ, thời lượng, nội dung đã học, ghi chú
- Thêm, sửa, xóa lịch học
- Lọc lịch học theo môn

### 3. Thiết lập Mục tiêu Học tập
- Đặt mục tiêu theo giờ học cho từng môn/tháng
- Đặt mục tiêu chung toàn bộ tháng
- Quản lý mục tiêu đa tháng

### 4. Xem Tiến độ
- Hiển thị trạng thái hoàn thành mục tiêu
- Biểu đồ tiến độ theo môn học
- Thống kê tổng giờ học theo tháng
- Chi tiết hoàn thành so với mục tiêu

## Cấu trúc dự án

```
Bai2/
├── index.tsx                      # Component chính
├── types.ts                       # Định nghĩa types
├── styles.less                    # Styling
├── components/
│   ├── SubjectManagement.tsx      # Quản lý môn học
│   ├── StudyTracking.tsx          # Theo dõi buổi học
│   ├── GoalSetting.tsx            # Đặt mục tiêu
│   ├── GoalProgress.tsx           # Xem tiến độ
│   └── index.ts                   # Export components
└── hooks/
    └── useLocalStorage.ts         # Hook quản lý localStorage
```

## Kiến trúc Component

### Bai2 (Main Component)
- Điều phối toàn bộ state
- Quản lý navigation qua tabs
- Xử lý message notifications

### SubjectManagement
- Hiển thị danh sách môn học
- Form thêm/sửa môn học
- Xóa môn học kèm xóa dữ liệu liên quan

### StudyTracking
- Bảng danh sách buổi học
- Tìm kiếm/lọc theo môn
- Form thêm/sửa buổi học

### GoalSetting
- Tab 1: Đặt mục tiêu theo môn/tháng
- Tab 2: Đặt mục tiêu chung tháng
- Danh sách các mục tiêu đã đặt

### GoalProgress
- Progress bar trạng thái đạt mục tiêu
- Thống kê giờ học từng môn
- Comparison so với mục tiêu
- Color-coded status (success/pending)

## Quản lý Dữ liệu

### localStorage Keys
- `bai2_subjects`: Danh sách môn học
- `bai2_study_sessions`: Danh sách buổi học
- `bai2_monthly_goals`: Danh sách mục tiêu theo môn
- `bai2_global_goal`: Mục tiêu chung

### Data Models

```typescript
interface Subject {
  id: string;
  name: string;
  color?: string;
}

interface StudySession {
  id: string;
  subjectId: string;
  date: string;           // YYYY-MM-DD
  startTime: string;      // HH:mm
  duration: number;       // minutes
  content: string;
  notes: string;
}

interface MonthlyGoal {
  id: string;
  subjectId: string;
  month: string;          // YYYY-MM
  targetHours: number;
}

interface GlobalGoal {
  id: string;
  month: string;          // YYYY-MM
  targetHours: number;
}
```

## Hooks

### useLocalStorage
Quản lý toàn bộ state và localStorage:

**State**:
- subjects: Subject[]
- studySessions: StudySession[]
- monthlyGoals: MonthlyGoal[]
- globalGoal: GlobalGoal | null

**Methods**:
- addSubject(name, color?)
- updateSubject(id, name, color?)
- deleteSubject(id)
- addStudySession(session)
- updateStudySession(id, session)
- deleteStudySession(id)
- setMonthlyGoalForSubject(subjectId, month, targetHours)
- deleteMonthlyGoal(id)
- setGlobalGoalForMonth(month, targetHours)
- getMonthlyGoal(subjectId, month)
- getStudySessionsBySubject(subjectId, month?)
- getTotalStudyHours(month?)

## Dependencies
- React 16+
- antd 4.x
- dayjs

## Sử dụng

### Bước 1: Thêm môn học
1. Chuyển đến tab "Môn học"
2. Click "Thêm môn học"
3. Nhập tên môn và chọn màu sắc
4. Click "Lưu"

### Bước 2: Ghi lại buổi học
1. Chuyển đến tab "Lịch học"
2. Click "Thêm lịch học"
3. Điền thông tin: môn học, ngày, giờ, thời lượng, nội dung
4. Click "Lưu"

### Bước 3: Đặt mục tiêu
1. Chuyển đến tab "Mục tiêu"
2. Chọn môn học, tháng, nhập giờ cần đạt được
3. Click "Đặt mục tiêu"
4. Hoặc đặt mục tiêu chung cho tháng (tab "Mục tiêu chung")

### Bước 4: Xem tiến độ
1. Chuyển đến tab "Tiến độ"
2. Chọn tháng muốn xem
3. Xem progress bar và thống kê chi tiết

## Lưu ý
- Tất cả dữ liệu được lưu trong localStorage
- Xóa môn học sẽ xóa tất cả dữ liệu liên quan (buổi học, mục tiêu)
- Mục tiêu được tính theo giờ
- Có thể đặt mục tiêu cho nhiều tháng khác nhau
