import React from 'react';
import { Tabs, Typography } from 'antd';
import { BookingProvider } from './context';
import { ServiceManager } from './components/ServiceManager';
import { StaffManager } from './components/StaffManager';
import { BookingManager } from './components/BookingManager';
import { ReviewManager } from './components/ReviewManager';
import { Dashboard } from './components/Dashboard';

const { TabPane } = Tabs;
const { Title } = Typography;

const Bai1App = () => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      <Title level={2}>Hệ Thống Đặt Lịch Hẹn</Title>
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="Quản lý Lịch Hẹn" key="1">
          <BookingManager />
        </TabPane>
        <TabPane tab="Quản lý Dịch Vụ" key="2">
          <ServiceManager />
        </TabPane>
        <TabPane tab="Quản lý Nhân Viên" key="3">
          <StaffManager />
        </TabPane>
        <TabPane tab="Đánh Giá Phản Hồi" key="4">
          <ReviewManager />
        </TabPane>
        <TabPane tab="Báo Cáo Thống Kê" key="5">
          <Dashboard />
        </TabPane>
      </Tabs>
    </div>
  );
};

const Bai1 = () => (
  <BookingProvider>
    <Bai1App />
  </BookingProvider>
);

export default Bai1;