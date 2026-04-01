import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import { ClubProvider } from './ClubContext';
import ClubsList from './components/ClubsList';
import ApplicationsList from './components/ApplicationsList';
import MembersList from './components/MembersList';
import Dashboard from './components/Dashboard';

const { TabPane } = Tabs;

const Bai1Content: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [membersTabClubId, setMembersTabClubId] = useState<string | null>(null);

  const handleViewMembers = (clubId: string) => {
    setMembersTabClubId(clubId);
    setActiveTab('3');
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key !== '3') {
      setMembersTabClubId(null);
    }
  };

  return (
    <Card title="Hệ thống Quản lý Câu lạc bộ" style={{ margin: 24 }}>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Danh sách Câu lạc bộ" key="1">
          <ClubsList onViewMembers={handleViewMembers} />
        </TabPane>
        <TabPane tab="Đơn đăng ký ứng viên" key="2">
          <ApplicationsList />
        </TabPane>
        <TabPane tab="Quản lý thành viên (Approved)" key="3">
          <MembersList initialClubId={membersTabClubId} />
        </TabPane>
        <TabPane tab="Báo cáo & Thống kê" key="4">
          <Dashboard />
        </TabPane>
      </Tabs>
    </Card>
  );
};

const Bai1: React.FC = () => {
  return (
    <ClubProvider>
      <Bai1Content />
    </ClubProvider>
  );
};

export default Bai1;