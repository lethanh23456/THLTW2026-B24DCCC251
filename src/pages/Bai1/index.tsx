import { useEffect, useState } from 'react';
import { Card, InputNumber, Button, Typography, message, Space } from 'antd';

const { Title, Text } = Typography;

const Bai1 = () => {
    const [secretNumber, setSecretNumber] = useState<number>(0);
    const [guess, setGuess] = useState<number | null>(null);
    const [turn, setTurn] = useState<number>(1);
    const [result, setResult] = useState<string>('');
    const [gameOver, setGameOver] = useState<boolean>(false);
   

    const MAX_TURN = 10;

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        setSecretNumber(randomNumber);
        setGuess(null);
        setTurn(1);
        setResult('');
        setGameOver(false);
    };

    const handleGuess = () => {
        if (guess === null) {
            message.warning('Vui lòng nhập số!');
            return;
        }

        if (guess < secretNumber) {
            setResult('Bạn đoán quá thấp!');
        } else if (guess > secretNumber) {
            setResult('Bạn đoán quá cao!');
        } else {
            setResult('Chúc mừng! Bạn đã đoán đúng!');
            setGameOver(true);
            return;
        }

        if (turn >= MAX_TURN) {
            setResult(`Bạn đã hết lượt! Số đúng là ${secretNumber}.`);
            setGameOver(true);
        } else {
            setTurn(turn + 1);
        }
    };

    return (
        <Card style={{ maxWidth: 500, margin: '40px auto', textAlign: 'center' , maxHeight: 400}}>
            <Title level={2}>Trò chơi đoán số</Title>

            <Text>Hệ thống đã sinh số từ 1 đến 100</Text>
            <br />
            <Text>Bạn có {MAX_TURN} lượt đoán</Text>

            <Space direction="vertical" style={{ width: '100%', marginTop: 20 }}>
                <InputNumber
                    min={1}
                    max={100}
                    value={guess}
                    disabled={gameOver}
                    onChange={(value) => setGuess(value)}
                    style={{ width: '100%' }}
                    placeholder="Nhập số từ 1 đến 100"
                />

                <Button
                    type="primary"
                    onClick={handleGuess}
                    disabled={gameOver}
                    block
                >
                    Đoán
                </Button>

                {gameOver && (
                    <Button onClick={startNewGame} block>
                        Chơi lại
                    </Button>
                )}
            </Space>

            <div style={{ marginTop: 20 }}>
                <Text strong>Lượt hiện tại: {turn}/{MAX_TURN}</Text>
                <br />
                <Text>{result}</Text>
                <br />
                
            </div>
        </Card>
    );
};

export default Bai1;