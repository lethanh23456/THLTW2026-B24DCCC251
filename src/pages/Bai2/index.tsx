import React from 'react';
import { Tabs, PageHeader, message } from 'antd';
import {
  BookOutlined,
  ClockCircleOutlined,
  FlagOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useLocalStorage } from './hooks/QLDuLieu';
import QuanLyMonHoc from './components/MonHoc';
import GhiLaiHocTap from './components/LichHoc';
import DatMucTieu from './components/DatMucTieu';
import XemTienDo from './components/TienDo';
import type { StudySession } from './types';

const Bai2: React.FC = () => {
  const {
    subjects,
    studySessions,
    monthlyGoals,
    globalGoals,
    addSubject,
    updateSubject,
    deleteSubject,
    addStudySession,
    updateStudySession,
    deleteStudySession,
    setMonthlyGoalForSubject,
    deleteMonthlyGoal,
    setGlobalGoalForMonth,
    deleteGlobalGoal,
  } = useLocalStorage();

  const handleAddSubject = (name: string) => {
    addSubject(name);
    message.success('Thêm môn học thành công');
  };

  const handleUpdateSubject = (id: string, name: string) => {
    updateSubject(id, name);
    message.success('Cập nhật môn học thành công');
  };

  const handleDeleteSubject = (id: string) => {
    deleteSubject(id);
    message.success('Xóa môn học thành công');
  };

  const handleAddStudySession = (session: Omit<StudySession, 'id'>) => {
    addStudySession(session);
    message.success('Thêm lịch học thành công');
  };

  const handleUpdateStudySession = (id: string, session: Omit<StudySession, 'id'>) => {
    updateStudySession(id, session);
    message.success('Cập nhật lịch học thành công');
  };

  const handleDeleteStudySession = (id: string) => {
    deleteStudySession(id);
    message.success('Xóa lịch học thành công');
  };

  const handleSetMonthlyGoal = (subjectId: string, month: string, targetHours: number) => {
    setMonthlyGoalForSubject(subjectId, month, targetHours);
    message.success('Đặt mục tiêu thành công');
  };

  const handleDeleteMonthlyGoal = (id: string) => {
    deleteMonthlyGoal(id);
    message.success('Xóa mục tiêu thành công');
  };

  const handleSetGlobalGoal = (month: string, targetHours: number) => {
    setGlobalGoalForMonth(month, targetHours);
    message.success('Lưu mục tiêu tổng thành công');
  };

  const handleDeleteGlobalGoal = (id: string) => {
    deleteGlobalGoal(id);
    message.success('Xóa mục tiêu tổng thành công');
  };

  const tabItems = [
    {
      key: 'subjects',
      label: (
        <span>
          <BookOutlined />
          Môn học
        </span>
      ),
      children: (
        <QuanLyMonHoc
          subjects={subjects}
          onAddSubject={handleAddSubject}
          onUpdateSubject={handleUpdateSubject}
          onDeleteSubject={handleDeleteSubject}
        />
      ),
    },
    {
      key: 'tracking',
      label: (
        <span>
          <ClockCircleOutlined />
          Lịch học
        </span>
      ),
      children: (
        <GhiLaiHocTap
          studySessions={studySessions}
          subjects={subjects}
          onAddSession={handleAddStudySession}
          onUpdateSession={handleUpdateStudySession}
          onDeleteSession={handleDeleteStudySession}
        />
      ),
    },
    {
      key: 'goals',
      label: (
        <span>
          <FlagOutlined />
          Mục tiêu
        </span>
      ),
      children: (
        <DatMucTieu
          subjects={subjects}
          monthlyGoals={monthlyGoals}
          globalGoals={globalGoals}
          onSetMonthlyGoal={handleSetMonthlyGoal}
          onDeleteMonthlyGoal={handleDeleteMonthlyGoal}
          onSetGlobalGoal={handleSetGlobalGoal}
          onDeleteGlobalGoal={handleDeleteGlobalGoal}
        />
      ),
    },
    {
      key: 'progress',
      label: (
        <span>
          <BarChartOutlined />
          Tiến độ
        </span>
      ),
      children: (
        <XemTienDo
          subjects={subjects}
          studySessions={studySessions}
          monthlyGoals={monthlyGoals}
          globalGoals={globalGoals}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <PageHeader
        title="Quản lý tiến độ học tập"
        subTitle="Tối giản theo yêu cầu đề"
        style={{ marginBottom: 24, paddingLeft: 0, paddingRight: 0 }}
      />
      <Tabs type="card" style={{ backgroundColor: '#fff', padding: 16, borderRadius: 4 }}>
        {tabItems.map((item) => (
          <Tabs.TabPane key={item.key} tab={item.label}>
            {item.children}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default Bai2;