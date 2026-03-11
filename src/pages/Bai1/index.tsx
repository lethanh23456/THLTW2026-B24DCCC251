import { useState } from 'react';
import { Card, Button, Typography, Space, List } from 'antd';

const { Title, Text } = Typography;

const choices = ['Kéo', 'Búa', 'Bao'];

const Bai1 = () => {
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [round, setRound] = useState(1);

  const playGame = (playerChoice: string) => {
    const computerChoice = choices[Math.floor(Math.random() * 3)];

    let kq = '';

    if (playerChoice === computerChoice) {
      kq = 'Hòa';
    } else if (
      (playerChoice === 'Kéo' && computerChoice === 'Bao') ||
      (playerChoice === 'Búa' && computerChoice === 'Kéo') ||
      (playerChoice === 'Bao' && computerChoice === 'Búa')
    ) {
      kq = 'Bạn thắng';
    } else {
      kq = 'Bạn thua';
    }

    const text = `Ván ${round}: Bạn chọn ${playerChoice}, Máy chọn ${computerChoice} → ${kq}`;

    setResult(text);
    setHistory((prev) => [text, ...prev]);
    setRound(round + 1);
  };

  return (
    <div style={{ padding: 20 }}>
      <Card title="Trò chơi Oẳn Tù Tì" style={{ maxWidth: 500 }}>
        <Space style={{ marginBottom: 20 }}>
          <Button type="primary" onClick={() => playGame('Kéo')}>
            Kéo
          </Button>

          <Button type="primary" onClick={() => playGame('Búa')}>
            Búa 
          </Button>

          <Button type="primary" onClick={() => playGame('Bao')}>
            Bao 
          </Button>
        </Space>

        <div style={{ marginBottom: 20 }}>
          <Text strong>{result}</Text>
        </div>

        <Title level={5}>Lịch sử ván đấu</Title>

        <List
          bordered
          dataSource={history}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Card>
    </div>
  );
};

export default Bai1;