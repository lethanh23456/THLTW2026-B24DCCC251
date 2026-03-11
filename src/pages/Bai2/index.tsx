import { useState, useEffect } from 'react';
import { Layout, Menu, Card } from 'antd';
import { AppstoreOutlined, BookOutlined, QuestionCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { KhoiKienThuc, MonHoc, CauHoi, MauDeThi, DeThi } from './types';
import { SK, load, save, SEED_KHOI, SEED_MON, SEED_CH } from './constants';
import { KhoiKienThucSection } from './components/KhoiKienThucSection';
import { MonHocSection } from './components/MonHocSection';
import { CauHoiSection } from './components/CauHoiSection';
import { DeThiSection } from './components/DeThiSection';
import './styles.less';

const { Header, Content } = Layout;

const NAV_ITEMS = [
  { key: 'khoi', icon: <AppstoreOutlined />, label: 'Khối Kiến Thức' },
  { key: 'mon', icon: <BookOutlined />, label: 'Môn Học' },
  { key: 'cauhoi', icon: <QuestionCircleOutlined />, label: 'Câu Hỏi' },
  { key: 'dethi', icon: <FileTextOutlined />, label: 'Đề Thi' },
];

export default function Bai2() {
  const [nav, setNav] = useState('khoi');

  const [khoiList, setKhoiList] = useState<KhoiKienThuc[]>(() => {
    const s = load<KhoiKienThuc[]>(SK.KHOI, []);
    return s.length ? s : SEED_KHOI;
  });
  const [monList, setMonList] = useState<MonHoc[]>(() => {
    const s = load<MonHoc[]>(SK.MON, []);
    return s.length ? s : SEED_MON;
  });
  const [chList, setChList] = useState<CauHoi[]>(() => {
    const s = load<CauHoi[]>(SK.CH, []);
    return s.length ? s : SEED_CH;
  });
  const [mauList, setMauList] = useState<MauDeThi[]>(() => load(SK.MAU, []));
  const [deList, setDeList] = useState<DeThi[]>(() => load(SK.DE, []));

  useEffect(() => {
    save(SK.KHOI, khoiList);
  }, [khoiList]);
  useEffect(() => {
    save(SK.MON, monList);
  }, [monList]);
  useEffect(() => {
    save(SK.CH, chList);
  }, [chList]);
  useEffect(() => {
    save(SK.MAU, mauList);
  }, [mauList]);
  useEffect(() => {
    save(SK.DE, deList);
  }, [deList]);

  const renderSection = () => {
    switch (nav) {
      case 'khoi':
        return <KhoiKienThucSection khoiList={khoiList} setKhoiList={setKhoiList} chList={chList} />;
      case 'mon':
        return <MonHocSection monList={monList} setMonList={setMonList} chList={chList} />;
      case 'cauhoi':
        return <CauHoiSection chList={chList} setChList={setChList} khoiList={khoiList} monList={monList} />;
      case 'dethi':
        return (
          <DeThiSection
            deList={deList}
            setDeList={setDeList}
            mauList={mauList}
            setMauList={setMauList}
            chList={chList}
            khoiList={khoiList}
            monList={monList}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout className="bai2-page" style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header
        style={{
          background: '#fff',
          borderBottom: '1px solid #e8e8e8',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: 60,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 40, flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e', lineHeight: 1.2 }}>
              Ngân Hàng Câu Hỏi
            </div>
            <div style={{ fontSize: 11, color: '#8c8c8c', lineHeight: 1.2 }}>
              Quản lý & Tạo đề thi
            </div>
          </div>
        </div>

        <Menu
          mode="horizontal"
          selectedKeys={[nav]}
          onClick={({ key }) => setNav(key)}
          style={{ border: 'none', flex: 1, background: 'transparent', lineHeight: '58px' }}
        >
          {NAV_ITEMS.map((item) => (
            <Menu.Item key={item.key} icon={item.icon} style={{ fontWeight: 500 }}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>

        <div style={{ display: 'flex', gap: 24, flexShrink: 0, marginLeft: 24, alignItems: 'center', height: 60 }}>
          <div style={{ textAlign: 'center', lineHeight: 'normal' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1890ff', lineHeight: 1.2 }}>
              {chList.length}
            </div>
            <div style={{ fontSize: 11, color: '#8c8c8c', lineHeight: 1.2, marginTop: 2 }}>
              Câu hỏi
            </div>
          </div>
          <div style={{ width: 1, height: 28, background: '#e8e8e8', flexShrink: 0 }} />
          <div style={{ textAlign: 'center', lineHeight: 'normal' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#52c41a', lineHeight: 1.2 }}>
              {deList.length}
            </div>
            <div style={{ fontSize: 11, color: '#8c8c8c', lineHeight: 1.2, marginTop: 2 }}>
              Đề thi
            </div>
          </div>
        </div>
      </Header>

      <Layout style={{ background: '#f5f7fa' }}>
        <Content className="bai2-content" style={{ padding: '24px 32px' }}>
          <Card
            className="bai2-main-card"
            style={{ borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e8e8e8' }}
          >
            {renderSection()}
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}