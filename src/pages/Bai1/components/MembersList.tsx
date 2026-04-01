import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Select, message } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { useClubContext } from '../ClubContext';

interface MembersListProps {
  initialClubId?: string | null;
}

const MembersList: React.FC<MembersListProps> = ({ initialClubId }) => {
  const { applications, clubs, changeMemberClub } = useClubContext();
  const [selectedClubFilter, setSelectedClubFilter] = useState<string | undefined>(initialClubId || undefined);

  useEffect(() => {
    if (initialClubId) {
      setSelectedClubFilter(initialClubId);
    }
  }, [initialClubId]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isChangeClubVisible, setIsChangeClubVisible] = useState(false);
  const [form] = Form.useForm();

  let members = applications.filter(app => app.status === 'Approved');
  
  if (selectedClubFilter) {
    members = members.filter(app => app.clubId === selectedClubFilter);
  }

  const handleChangeClub = () => {
    if (selectedRowKeys.length === 0) return;
    form.resetFields();
    setIsChangeClubVisible(true);
  };

  const submitChangeClub = () => {
    form.validateFields().then(values => {
      changeMemberClub(selectedRowKeys as string[], values.newClubId);
      setIsChangeClubVisible(false);
      setSelectedRowKeys([]);
      message.success(`Đã chuyển CLB cho ${selectedRowKeys.length} thành viên!`);
    });
  };

  const columns = [
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { title: 'Sở trường', dataIndex: 'skills', key: 'skills' },
    { 
      title: 'CLB hiện tại', 
      dataIndex: 'clubId', 
      key: 'clubId',
      render: (clubId: string) => clubs.find(c => c.id === clubId)?.name || 'N/A'
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }} size="large">
        <Space>
          <span>Lọc theo Câu lạc bộ:</span>
          <Select 
            style={{ width: 250 }} 
            allowClear 
            placeholder="Tất cả CLB"
            value={selectedClubFilter}
            onChange={val => setSelectedClubFilter(val)}
          >
            {clubs.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
          </Select>
        </Space>
        
        <Button 
          type="primary" 
          icon={<SwapOutlined />} 
          disabled={selectedRowKeys.length === 0}
          onClick={handleChangeClub}
        >
          Đổi Câu lạc bộ ({selectedRowKeys.length})
        </Button>
      </Space>

      <Table 
        rowSelection={rowSelection} 
        columns={columns} 
        dataSource={members} 
        rowKey="id" 
      />

      <Modal
        title={`Chuyển CLB cho ${selectedRowKeys.length} thành viên`}
        visible={isChangeClubVisible}
        onOk={submitChangeClub}
        onCancel={() => setIsChangeClubVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="newClubId" label="Chọn Câu lạc bộ mới" rules={[{ required: true, message: 'Vui lòng chọn CLB!' }]}>
             <Select placeholder="Chọn câu lạc bộ">
                {clubs.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
             </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MembersList;
