import React, { useState } from 'react';
import { Table, Button, Form, Input, Card, Descriptions, Modal, message, Row, Col } from 'antd';
import { useDiplomaStore, Diploma } from '../store';

const DiplomaLookup: React.FC = () => {
  const { diplomas, decisions, incrementLookupCount, formConfigs } = useDiplomaStore();
  const [form] = Form.useForm();
  const [searchResults, setSearchResults] = useState<Diploma[]>([]);
  const [selectedDiploma, setSelectedDiploma] = useState<Diploma | null>(null);

  const onSearch = (values: any) => {
    // Count filled parameters
    const filledParams = Object.keys(values).filter(key => values[key] !== undefined && values[key] !== '').length;
    
    if (filledParams < 2) {
      message.error('Vui lòng nhập ít nhất 2 tham số để tra cứu.');
      return;
    }

    // Filter diplomas
    const results = diplomas.filter(d => {
      let match = true;
      if (values.diplomaNumber && !d.diplomaNumber.includes(values.diplomaNumber)) match = false;
      if (values.entryNumber && d.entryNumber.toString() !== values.entryNumber) match = false;
      if (values.studentId && !d.studentId.includes(values.studentId)) match = false;
      if (values.fullName && !d.fullName.toLowerCase().includes(values.fullName.toLowerCase())) match = false;
      if (values.dateOfBirth && d.dateOfBirth !== values.dateOfBirth) match = false;
      return match;
    });

    setSearchResults(results);
  };

  const handleViewDetails = (diploma: Diploma) => {
    setSelectedDiploma(diploma);
    // Increment lookup count of the decision
    incrementLookupCount(diploma.decisionId);
  };

  const columns = [
    { title: 'Số hiệu VB', dataIndex: 'diplomaNumber', key: 'diplomaNumber' },
    { title: 'Số vào sổ', dataIndex: 'entryNumber', key: 'entryNumber' },
    { title: 'Mã SV', dataIndex: 'studentId', key: 'studentId' },
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Diploma) => (
        <Button type="link" onClick={() => handleViewDetails(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const getDecisionInfo = (decisionId: string) => {
    return decisions.find(d => d.id === decisionId);
  };

  return (
    <div>
      <Card title="Tra Cứu Văn Bằng" style={{ marginBottom: 24 }}>
        <Form form={form} onFinish={onSearch} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="diplomaNumber" label="Số hiệu văn bằng">
                <Input allowClear placeholder="Nhập số hiệu VB" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="entryNumber" label="Số vào sổ">
                <Input allowClear placeholder="Nhập số vào sổ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="studentId" label="Mã sinh viên">
                <Input allowClear placeholder="Nhập mã SV" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="fullName" label="Họ tên">
                <Input allowClear placeholder="Nhập họ tên" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dateOfBirth" label="Ngày sinh (YYYY-MM-DD)">
                <Input allowClear placeholder="Nhập ngày sinh (YYYY-MM-DD)" />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" htmlType="submit">
            Tìm kiếm
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => { form.resetFields(); setSearchResults([]); }}>
            Làm mới
          </Button>
        </Form>
      </Card>

      {searchResults.length > 0 && (
        <Table dataSource={searchResults} columns={columns} rowKey="id" />
      )}

      <Modal
        title="Chi Tiết Văn Bằng"
        visible={!!selectedDiploma}
        onCancel={() => setSelectedDiploma(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedDiploma(null)}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {selectedDiploma && (
          <>
            <Descriptions title="Thông Tin Cơ Bản" bordered column={2}>
              <Descriptions.Item label="Số hiệu văn bằng">{selectedDiploma.diplomaNumber}</Descriptions.Item>
              <Descriptions.Item label="Số vào sổ">{selectedDiploma.entryNumber}</Descriptions.Item>
              <Descriptions.Item label="Mã sinh viên">{selectedDiploma.studentId}</Descriptions.Item>
              <Descriptions.Item label="Họ tên">{selectedDiploma.fullName}</Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">{selectedDiploma.dateOfBirth}</Descriptions.Item>
            </Descriptions>
            
            <Descriptions title="Thông Tin Động (Theo Biểu Mẫu)" bordered column={2} style={{ marginTop: 24 }}>
              {formConfigs.map(config => (
                <Descriptions.Item key={config.id} label={config.name}>
                  {selectedDiploma.dynamicFields[config.id] || 'N/A'}
                </Descriptions.Item>
              ))}
            </Descriptions>

            {getDecisionInfo(selectedDiploma.decisionId) && (
              <Descriptions title="Thông Tin Quyết Định Tốt Nghiệp" bordered column={1} style={{ marginTop: 24 }}>
                <Descriptions.Item label="Số QĐ">{getDecisionInfo(selectedDiploma.decisionId)?.decisionNumber}</Descriptions.Item>
                <Descriptions.Item label="Ngày ban hành">{getDecisionInfo(selectedDiploma.decisionId)?.date}</Descriptions.Item>
                <Descriptions.Item label="Trích yếu">{getDecisionInfo(selectedDiploma.decisionId)?.abstract}</Descriptions.Item>
                <Descriptions.Item label="Số lượt tra cứu">{getDecisionInfo(selectedDiploma.decisionId)?.lookupCount}</Descriptions.Item>
              </Descriptions>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default DiplomaLookup;
