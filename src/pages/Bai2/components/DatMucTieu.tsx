import React, { useState } from 'react';
import {
  Card,
  Form,
  InputNumber,
  Button,
  Row,
  Col,
  Table,
  Popconfirm,
  Select,
  Empty,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Subject, MonthlyGoal, GlobalGoal } from '../types';

interface GoalSettingProps {
  subjects: Subject[];
  monthlyGoals: MonthlyGoal[];
  globalGoals: GlobalGoal[];
  onSetMonthlyGoal: (subjectId: string, month: string, targetHours: number) => void;
  onDeleteMonthlyGoal: (id: string) => void;
  onSetGlobalGoal: (month: string, targetHours: number) => void;
  onDeleteGlobalGoal: (id: string) => void;
}

const GoalSetting: React.FC<GoalSettingProps> = ({
  subjects,
  monthlyGoals,
  onSetMonthlyGoal,
  onDeleteMonthlyGoal,

}) => {
  const [form] = Form.useForm();
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(
    subjects.length > 0 ? subjects[0].id : undefined
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(dayjs().format('YYYY-MM'));
 

  const handleSetSubjectGoal = async () => {
    try {
      const values = await form.validateFields();
      if (selectedSubject) {
        onSetMonthlyGoal(selectedSubject, selectedMonth, values.targetHours);
        form.resetFields();
      }
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  
  const getSubjectGoals = () => {
    return monthlyGoals.filter((g) => g.month === selectedMonth);
  };

 

  const goalColumns = [
    {
      title: 'Môn học',
      dataIndex: 'subjectId',
      key: 'subjectId',
      render: (subjectId: string) => {
        const subject = subjects.find((s) => s.id === subjectId);
        return subject?.name || 'N/A';
      },
    },
    {
      title: 'Mục tiêu (giờ)',
      dataIndex: 'targetHours',
      key: 'targetHours',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: MonthlyGoal) => (
        <Popconfirm
          title="Xóa mục tiêu"
          onConfirm={() => onDeleteMonthlyGoal(record.id)}
          okText="Có"
          cancelText="Không"
        >
          <Button danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  

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
        description="Vui lòng thêm môn học trước khi đặt mục tiêu"
        style={{ paddingTop: 50, paddingBottom: 50 }}
      />
    );
  }

  return (
    <div>
      <Card title="Mục tiêu theo môn" style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical">
          <Row gutter={12}>
            <Col xs={24} md={8}>
              <Form.Item label="Tháng">
                <Select value={selectedMonth} onChange={setSelectedMonth} options={months} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Môn học">
                <Select
                  value={selectedSubject}
                  onChange={setSelectedSubject}
                  options={subjects.map((s) => ({ label: s.name, value: s.id }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Mục tiêu (giờ)"
                name="targetHours"
                rules={[
                  { required: true, message: 'Vui lòng nhập mục tiêu' },
                  { type: 'number', min: 0.5, message: 'Mục tiêu phải >= 0.5 giờ' },
                ]}
              >
                <InputNumber min={0.5} step={0.5} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleSetSubjectGoal}>
            Lưu mục tiêu môn
          </Button>
        </Form>

        <div style={{ marginTop: 16 }}>
          {getSubjectGoals().length > 0 ? (
            <Table
              columns={goalColumns}
              dataSource={getSubjectGoals()}
              rowKey="id"
              pagination={false}
            />
          ) : (
            <Empty description="Chưa có mục tiêu môn cho tháng này" />
          )}
        </div>
      </Card>

      
    </div>
  );
};

export default GoalSetting;
