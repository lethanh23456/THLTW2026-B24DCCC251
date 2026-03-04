import type { Subject } from '../types';

export const defaultSubjects: Subject[] = [
  {
    id: '1',
    name: 'Toán',
    color: '#1890ff',
  },
  {
    id: '2',
    name: 'Văn',
    color: '#52c41a',
  },
  {
    id: '3',
    name: 'Tiếng Anh',
    color: '#faad14',
  },
  {
    id: '4',
    name: 'Khoa học',
    color: '#f5222d',
  },
  {
    id: '5',
    name: 'Công nghệ',
    color: '#13c2c2',
  },
  {
    id: '6',
    name: 'Lịch sử',
    color: '#722ed1',
  },
  {
    id: '7',
    name: 'Địa lý',
    color: '#eb2f96',
  },
  {
    id: '8',
    name: 'Âm nhạc',
    color: '#fa8c16',
  },
];

export const generateRandomColor = (): string => {
  const colors = [
    '#1890ff',
    '#52c41a',
    '#faad14',
    '#f5222d',
    '#13c2c2',
    '#722ed1',
    '#eb2f96',
    '#fa8c16',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
