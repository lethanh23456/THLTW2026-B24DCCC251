import React from 'react';
import { Tabs } from 'antd';
import { DiplomaProvider } from './store';
import DiplomaBooks from './components/DiplomaBooks';
import GraduationDecisions from './components/GraduationDecisions';
import FormConfigs from './components/FormConfigs';
import Diplomas from './components/Diplomas';
import DiplomaLookup from './components/DiplomaLookup';

const { TabPane } = Tabs;

const Bai1: React.FC = () => {
  return (
    <DiplomaProvider>
      <div style={{ padding: 24, background: '#fff', minHeight: '80vh' }}>
        <h2>Hệ Thống Quản Lý Sổ Văn Bằng Tốt Nghiệp</h2>
        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Quản lý sổ văn bằng" key="1">
            <DiplomaBooks />
          </TabPane>
          <TabPane tab="Quyết định tốt nghiệp" key="2">
            <GraduationDecisions />
          </TabPane>
          <TabPane tab="Cấu hình biểu mẫu" key="3">
            <FormConfigs />
          </TabPane>
          <TabPane tab="Thông tin văn bằng" key="4">
            <Diplomas />
          </TabPane>
          <TabPane tab="Tra cứu văn bằng" key="5">
            <DiplomaLookup />
          </TabPane>
        </Tabs>
      </div>
    </DiplomaProvider>
  );
};

export default Bai1;