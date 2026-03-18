import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Rate, Space, Card, Row, Col, Typography } from 'antd';
import { useBooking } from '../context';
import { Review, Appointment } from '../types';

const { Option } = Select;
const { Text } = Typography;

export const ReviewManager = () => {
  const { reviews, appointments, staffs, addReview, replyReview } = useBooking();
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [replyForm] = Form.useForm();

  const completedAppointments = appointments.filter(a => a.status === 'completed');

  const handleAddReview = () => {
    form.resetFields();
    setIsReviewModalVisible(true);
  };

  const handleSaveReview = () => {
    form.validateFields().then(values => {
      const app = completedAppointments.find(a => a.id === values.appointmentId);
      if (app) {
        addReview({
          appointmentId: app.id,
          staffId: app.staffId,
          customerName: app.customerName,
          rating: values.rating,
          comment: values.comment
        });
        setIsReviewModalVisible(false);
      }
    });
  };

  const handleOpenReply = (reviewId: string) => {
    setCurrentReviewId(reviewId);
    replyForm.resetFields();
    setIsReplyModalVisible(true);
  };

  const handleSaveReply = () => {
    replyForm.validateFields().then(values => {
      if (currentReviewId) {
        replyReview(currentReviewId, values.staffReply);
        setIsReplyModalVisible(false);
      }
    });
  };


  const staffRatings = staffs.map(staff => {
    const staffReviews = reviews.filter(r => r.staffId === staff.id);
    const avg = staffReviews.length > 0
      ? staffReviews.reduce((sum, r) => sum + r.rating, 0) / staffReviews.length
      : 0;
    return { staffName: staff.name, avgRating: avg.toFixed(1), totalReviews: staffReviews.length };
  });

  const columns = [
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    {
      title: 'Nhân viên',
      dataIndex: 'staffId',
      key: 'staffId',
      render: (id: string) => staffs.find(s => s.id === id)?.name || id
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating} />
    },
    { title: 'Nhận xét', dataIndex: 'comment', key: 'comment' },
    {
      title: 'Phản hồi của NV',
      dataIndex: 'staffReply',
      key: 'staffReply',
      render: (reply?: string) => reply ? <Text type="secondary">{reply}</Text> : <Text type="warning">Chưa phản hồi</Text>
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: Review) => (
        !record.staffReply && <Button type="link" onClick={() => handleOpenReply(record.id)}>Phản hồi</Button>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {staffRatings.map((sr, idx) => (
          <Col span={6} key={idx}>
            <Card title={sr.staffName} size="small">
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>{sr.avgRating} <span style={{ fontSize: 16 }}>/ 5</span></div>
              <div>{sr.totalReviews} đánh giá</div>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAddReview}>Viết Đánh Giá (Khách Hàng)</Button>
      </div>

      <Table dataSource={reviews} columns={columns} rowKey="id" pagination={false} />

      <Modal
        title="Viết Đánh Giá"
        visible={isReviewModalVisible}
        onOk={handleSaveReview}
        onCancel={() => setIsReviewModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="appointmentId" label="Lịch hẹn đã hoàn thành" rules={[{ required: true }]}>
            <Select placeholder="Chọn lịch hẹn">
              {completedAppointments.map(a => {
                const staffName = staffs.find(s => s.id === a.staffId)?.name;
                return <Option key={a.id} value={a.id}>{a.customerName} - {a.date} ({staffName})</Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item name="rating" label="Điểm đánh giá" rules={[{ required: true }]}>
            <Rate />
          </Form.Item>
          <Form.Item name="comment" label="Nhận xét" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Nhân Viên Phản Hồi"
        visible={isReplyModalVisible}
        onOk={handleSaveReply}
        onCancel={() => setIsReplyModalVisible(false)}
        destroyOnClose
      >
        <Form form={replyForm} layout="vertical">
          <Form.Item name="staffReply" label="Nội dung phản hồi" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
