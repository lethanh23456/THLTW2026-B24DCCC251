import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Space,
  Popconfirm,
  DatePicker,
  InputNumber,
  Tag,
  TimePicker,
  Input,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { StudySession, Subject } from '../types';

interface StudyTrackingProps {
  studySessions: StudySession[];
  subjects: Subject[];
  onAddSession: (session: Omit<StudySession, 'id'>) => void;
  onUpdateSession: (id: string, session: Omit<StudySession, 'id'>) => void;
  onDeleteSession: (id: string) => void;
}

const StudyTracking: React.FC<StudyTrackingProps> = ({
  studySessions,
  subjects,
  onAddSession,
  onUpdateSession,
  onDeleteSession,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const handleAddClick = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditClick = (session: StudySession) => {
    setEditingId(session.id);

    form.setFieldsValue({
      subjectId: session.subjectId,
      date: dayjs(session.date),
      startTime: dayjs(session.startTime, 'HH:mm'), // 👈 convert string → dayjs
      duration: session.duration,
      content: session.content,
      notes: session.notes,
    });

    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      const sessionData = {
        subjectId: values.subjectId,
        date: values.date.format('YYYY-MM-DD'),
        startTime: values.startTime.format('HH:mm'), // 👈 convert dayjs → string
        duration: values.duration,
        content: values.content,
        notes: values.notes,
      };

      if (editingId) {
        onUpdateSession(editingId, sessionData);
      } else {
        onAddSession(sessionData);
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingId(null);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const getSubjectColor = (subjectId: string) => {
    return subjects.find((s) => s.id === subjectId)?.color || '#1890ff';
  };

  const getSubjectName = (subjectId: string) => {
    return subjects.find((s) => s.id === subjectId)?.name || 'N/A';
  };

  const columns = [
    {
      title: 'Môn học',
      dataIndex: 'subjectId',
      key: 'subjectId',
      width: 140,
      render: (subjectId: string) => (
        <Tag color={getSubjectColor(subjectId)}>
          {getSubjectName(subjectId)}
        </Tag>
      ),
    },
    {
      title: 'Ngày học',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Giờ bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 100,
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      key: 'duration',
      width: 120,
      render: (duration: number) => `${duration} phút`,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: StudySession) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          />
          <Popconfirm
            title="Xóa lịch học"
            onConfirm={() => onDeleteSession(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
          Thêm lịch học
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={studySessions}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: 'Chưa có lịch học nào' }}
      />

      <Modal
        title={editingId ? 'Sửa lịch học' : 'Thêm lịch học'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingId(null);
        }}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Môn học"
            name="subjectId"
            rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
          >
            <Select
              placeholder="Chọn môn học"
              options={subjects.map((s) => ({
                label: s.name,
                value: s.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Ngày học"
            name="date"
            rules={[{ required: true, message: 'Vui lòng chọn ngày học' }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Giờ bắt đầu"
            name="startTime"
            rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
          >
            <TimePicker
              format="HH:mm"
              minuteStep={5}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Thời lượng học (phút)"
            name="duration"
            rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              placeholder="Nhập số phút"
            />
          </Form.Item>

          <Form.Item
            label="Nội dung đã học"
            name="content"
            rules={[
              { required: true, message: 'Vui lòng nhập nội dung đã học' },
              { max: 500, message: 'Nội dung không quá 500 ký tự' },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Nhập nội dung bạn đã học"
            />
          </Form.Item>

          <Form.Item
            label="Ghi chú"
            name="notes"
            rules={[{ max: 300, message: 'Ghi chú không quá 300 ký tự' }]}
          >
            <Input.TextArea
              rows={2}
              placeholder="Ghi chú thêm (tùy chọn)"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudyTracking;