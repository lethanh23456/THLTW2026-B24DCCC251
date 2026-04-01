import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { useClubContext } from '../ClubContext';
import Chart from 'react-apexcharts';
import { TeamOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
  const { clubs, applications } = useClubContext();

  const totalClubs = clubs.length;
  const pendingCount = applications.filter(a => a.status === 'Pending').length;
  const approvedCount = applications.filter(a => a.status === 'Approved').length;
  const rejectedCount = applications.filter(a => a.status === 'Rejected').length;

  const categories = clubs.map(c => c.name);
  
  const series = [
    {
      name: 'Approved',
      data: clubs.map(c => applications.filter(a => a.clubId === c.id && a.status === 'Approved').length)
    },
    {
      name: 'Pending',
      data: clubs.map(c => applications.filter(a => a.clubId === c.id && a.status === 'Pending').length)
    },
    {
      name: 'Rejected',
      data: clubs.map(c => applications.filter(a => a.clubId === c.id && a.status === 'Rejected').length)
    }
  ];

  const chartOptions: any = {
    chart: {
      type: 'bar',
      stacked: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    xaxis: {
      categories: categories,
    },
    colors: ['#52c41a', '#faad14', '#f5222d'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + " đơn"
        }
      }
    }
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Tổng Câu lạc bộ" 
              value={totalClubs} 
              prefix={<TeamOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Đơn Approved" 
              value={approvedCount} 
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Đơn Pending" 
              value={pendingCount} 
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Đơn Rejected" 
              value={rejectedCount} 
              valueStyle={{ color: '#cf1322' }}
              prefix={<CloseCircleOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      <Card title="Thống kê Tình trạng đơn đăng ký theo từng Câu lạc bộ">
        <Chart 
           options={chartOptions} 
           series={series} 
           type="bar" 
           height={400} 
        />
      </Card>
    </div>
  );
};

export default Dashboard;
