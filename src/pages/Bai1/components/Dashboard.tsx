import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Table, Typography } from 'antd';
import { useBooking } from '../context';
import moment from 'moment';

const { Title } = Typography;

export const Dashboard = () => {
  const { appointments, services, staffs } = useBooking();

  const completedApps = useMemo(() => appointments.filter(a => a.status === 'completed'), [appointments]);


  const totalRevenue = useMemo(() => {
    return completedApps.reduce((sum, app) => {
      const service = services.find(s => s.id === app.serviceId);
      return sum + (service?.price || 0);
    }, 0);
  }, [completedApps, services]);


  const revenueByService = useMemo(() => {
    return services.map(service => {
      const apps = completedApps.filter(a => a.serviceId === service.id);
      return {
        key: service.id,
        serviceName: service.name,
        count: apps.length,
        revenue: apps.length * service.price
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [completedApps, services]);


  const revenueByStaff = useMemo(() => {
    return staffs.map(staff => {
      const apps = completedApps.filter(a => a.staffId === staff.id);
      const revenue = apps.reduce((sum, app) => {
        const service = services.find(s => s.id === app.serviceId);
        return sum + (service?.price || 0);
      }, 0);
      return {
        key: staff.id,
        staffName: staff.name,
        count: apps.length,
        revenue
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [completedApps, staffs, services]);


  const appsByDay = useMemo(() => {
    const days: Record<string, number> = {};
    appointments.forEach(app => {
      days[app.date] = (days[app.date] || 0) + 1;
    });
    return Object.entries(days).map(([date, count]) => ({ date, count })).sort((a, b) => b.date.localeCompare(a.date));
  }, [appointments]);

  const serviceColumns = [
    { title: 'Tên Dịch Vụ', dataIndex: 'serviceName', key: 'serviceName' },
    { title: 'Số lượt sử dụng', dataIndex: 'count', key: 'count' },
    { title: 'Doanh thu (VND)', dataIndex: 'revenue', key: 'revenue', render: (val: number) => val.toLocaleString() },
  ];

  const staffColumns = [
    { title: 'Tên Nhân Viên', dataIndex: 'staffName', key: 'staffName' },
    { title: 'Số lịch hoàn thành', dataIndex: 'count', key: 'count' },
    { title: 'Doanh thu mang lại (VND)', dataIndex: 'revenue', key: 'revenue', render: (val: number) => val.toLocaleString() },
  ];

  const dateColumns = [
    { title: 'Ngày', dataIndex: 'date', key: 'date' },
    { title: 'Số lượng lịch hẹn', dataIndex: 'count', key: 'count' },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng số lịch hẹn" value={appointments.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Số lịch hoàn thành" value={completedApps.length} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng Doanh Thu (VND)" value={totalRevenue} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Thống kê lịch hẹn theo ngày">
            <Table dataSource={appsByDay} columns={dateColumns} rowKey="date" pagination={{ pageSize: 5 }} size="small" />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Doanh thu theo dịch vụ">
            <Table dataSource={revenueByService} columns={serviceColumns} rowKey="key" pagination={false} size="small" />
          </Card>
        </Col>
      </Row>

      <Card title="Doanh thu theo nhân viên">
        <Table dataSource={revenueByStaff} columns={staffColumns} rowKey="key" pagination={false} size="small" />
      </Card>
    </div>
  );
};
