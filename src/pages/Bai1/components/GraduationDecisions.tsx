import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker } from 'antd';
import { useDiplomaStore } from '../store';
import moment from 'moment';

const GraduationDecisions: React.FC = () => {
  const { decisions, addDecision, books } = useDiplomaStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Số QĐ', dataIndex: 'decisionNumber', key: 'decisionNumber' },
    { title: 'Ngày ban hành', dataIndex: 'date', key: 'date' },
    { title: 'Trích yếu', dataIndex: 'abstract', key: 'abstract' },
    { title: 'Sổ VB', dataIndex: 'bookId', key: 'bookId', render: (val: string) => books.find(b => b.id === val)?.year || 'N/A' },
    { title: 'Số lượt tra cứu', dataIndex: 'lookupCount', key: 'lookupCount' },
  ];

  const handleAdd = (values: any) => {
    addDecision({
      decisionNumber: values.decisionNumber,
      date: values.date.format('YYYY-MM-DD'),
      abstract: values.abstract,
      bookId: values.bookId,
    });
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        Thêm Quyết Định Tốt Nghiệp
      </Button>
      <Table dataSource={decisions} columns={columns} rowKey="id" />

      <Modal
        title="Thêm Quyết Định Tốt Nghiệp"
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="decisionNumber" label="Số QĐ" rules={[{ required: true, message: 'Vui lòng nhập số QĐ' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="date" label="Ngày ban hành" rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành' }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="abstract" label="Trích yếu" rules={[{ required: true, message: 'Vui lòng nhập trích yếu' }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="bookId" label="Sổ văn bằng" rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}>
            <Select>
              {books.map(b => (
                <Select.Option key={b.id} value={b.id}>
                  Năm {b.year} {b.isCurrent ? '(Đang mở)' : ''}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GraduationDecisions;
