import React, { useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, Switch } from 'antd';
import { useDiplomaStore } from '../store';

const DiplomaBooks: React.FC = () => {
  const { books, addBook } = useDiplomaStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Năm', dataIndex: 'year', key: 'year' },
    { title: 'Trạng thái', dataIndex: 'isCurrent', key: 'isCurrent', render: (val: boolean) => val ? 'Đang mở' : 'Đã đóng' },
    { title: 'Số vào sổ hiện tại', dataIndex: 'currentEntryNumber', key: 'currentEntryNumber' },
  ];

  const handleAdd = (values: any) => {
    addBook({
      year: values.year,
      isCurrent: values.isCurrent,
    });
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        Mở sổ văn bằng mới
      </Button>
      <Table dataSource={books} columns={columns} rowKey="id" />

      <Modal
        title="Mở sổ văn bằng"
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd} initialValues={{ isCurrent: true, year: new Date().getFullYear() }}>
          <Form.Item name="year" label="Năm" rules={[{ required: true, message: 'Vui lòng nhập năm' }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="isCurrent" label="Là sổ hiện tại (Mở)" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DiplomaBooks;
