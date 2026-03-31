import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber } from 'antd';
import { useDiplomaStore } from '../store';
import moment from 'moment';

const Diplomas: React.FC = () => {
  const { diplomas, formConfigs, addDiploma, decisions, books } = useDiplomaStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Số vào sổ', dataIndex: 'entryNumber', key: 'entryNumber' },
    { title: 'Số hiệu VB', dataIndex: 'diplomaNumber', key: 'diplomaNumber' },
    { title: 'Mã SV', dataIndex: 'studentId', key: 'studentId' },
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Ngày sinh', dataIndex: 'dateOfBirth', key: 'dateOfBirth' },
    { title: 'Quyết định (Số QĐ)', dataIndex: 'decisionId', key: 'decisionId', render: (val: string) => decisions.find(d => d.id === val)?.decisionNumber || 'N/A' },
  ];

  const handleAdd = (values: any) => {
    const { diplomaNumber, studentId, fullName, dateOfBirth, decisionId, ...dynamicValues } = values;

    const formattedDob = dateOfBirth.format('YYYY-MM-DD');

    const formattedDynamicFields: Record<string, any> = {};
    formConfigs.forEach(config => {
      const val = dynamicValues[`dynamic_${config.id}`];
      if (val !== undefined && val !== null) {
        if (config.type === 'Date' && moment.isMoment(val)) {
          formattedDynamicFields[config.id] = val.format('YYYY-MM-DD');
        } else {
          formattedDynamicFields[config.id] = val;
        }
      }
    });

    addDiploma({
      diplomaNumber,
      studentId,
      fullName,
      dateOfBirth: formattedDob,
      decisionId,
      dynamicFields: formattedDynamicFields,
    });

    setIsModalVisible(false);
    form.resetFields();
  };

  const renderDynamicInput = (type: string) => {
    switch (type) {
      case 'Number':
        return <InputNumber style={{ width: '100%' }} />;
      case 'Date':
        return <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />;
      case 'String':
      default:
        return <Input />;
    }
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        Thêm Thông Tin Văn Bằng
      </Button>
      <Table dataSource={diplomas} columns={columns} rowKey="id" scroll={{ x: 'max-content' }} />

      <Modal
        title="Thêm Thông Tin Văn Bằng"
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name="decisionId" label="Quyết định tốt nghiệp" rules={[{ required: true, message: 'Vui lòng chọn quyết định' }]}>
              <Select>
                {decisions.map(d => {
                  const book = books.find(b => b.id === d.bookId);
                  return (
                    <Select.Option key={d.id} value={d.id}>
                      Số {d.decisionNumber} (Sổ năm {book?.year})
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="diplomaNumber" label="Số hiệu văn bằng" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="studentId" label="Mã sinh viên" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="dateOfBirth" label="Ngày sinh" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>

            {formConfigs.map(config => (
              <Form.Item 
                key={config.id} 
                name={`dynamic_${config.id}`} 
                label={config.name}
              >
                {renderDynamicInput(config.type)}
              </Form.Item>
            ))}
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Diplomas;
