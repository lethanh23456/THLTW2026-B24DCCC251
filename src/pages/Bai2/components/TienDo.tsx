import React, { useMemo } from 'react';
import { Card, Empty, Select, Table, Tag } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Subject, StudySession, MonthlyGoal, GlobalGoal } from '../types';

interface GoalProgressProps {
  subjects: Subject[];
  studySessions: StudySession[];
  monthlyGoals: MonthlyGoal[];
  globalGoals: GlobalGoal[];
}

const GoalProgress: React.FC<GoalProgressProps> = ({
  subjects,
  studySessions,
  monthlyGoals,

}) => {
  const [selectedMonth, setSelectedMonth] = React.useState<string>(dayjs().format('YYYY-MM'));


  const getTotalHoursForSubject = (subjectId: string, month: string) => {
    return (
      studySessions
        .filter(
          (session) => session.subjectId === subjectId && session.date.substring(0, 7) === month
        )
        .reduce((total, session) => total + session.duration, 0) / 60
    );
  };


  const subjectProgressData = useMemo(() => {
    return monthlyGoals
      .filter((goal) => goal.month === selectedMonth)
      .map((goal) => {
        const subject = subjects.find((item) => item.id === goal.subjectId);
        const actualHours = getTotalHoursForSubject(goal.subjectId, selectedMonth);
        return {
          id: goal.id,
          subjectName: subject?.name || 'N/A',
          actualHours,
          targetHours: goal.targetHours,
          status: actualHours >= goal.targetHours,
        };
      });
  }, [monthlyGoals, subjects, selectedMonth]);

  const months = [];
  for (let i = 0; i < 12; i++) {
    const month = dayjs().subtract(i, 'month');
    months.push({
      label: month.format('MM/YYYY'),
      value: month.format('YYYY-MM'),
    });
  }

  if (subjects.length === 0) {
    return (
      <Empty
        description="Vui lòng thêm môn học để xem tiến độ"
        style={{ paddingTop: 50, paddingBottom: 50 }}
      />
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Select value={selectedMonth} onChange={setSelectedMonth} options={months} style={{ width: 150 }} />
      </div>



      <Card title="Trạng thái mục tiêu theo môn">
        <Table
          rowKey="id"
          dataSource={subjectProgressData}
          pagination={false}
          locale={{ emptyText: 'Tháng này chưa có mục tiêu môn' }}
          columns={[
            { title: 'Môn học', dataIndex: 'subjectName', key: 'subjectName' },
            {
              title: 'Đã học (giờ)',
              dataIndex: 'actualHours',
              key: 'actualHours',
              render: (value: number) => value.toFixed(2),
            },
            {
              title: 'Mục tiêu (giờ)',
              dataIndex: 'targetHours',
              key: 'targetHours',
              render: (value: number) => value.toFixed(2),
            },
            {
              title: 'Trạng thái',
              dataIndex: 'status',
              key: 'status',
              render: (status: boolean) =>
                status ? (
                  <Tag color="success" icon={<CheckCircleOutlined />}>
                    Hoàn thành
                  </Tag>
                ) : (
                  <Tag icon={<ClockCircleOutlined />}>Chưa đạt</Tag>
                ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default GoalProgress;
