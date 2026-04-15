import { Button, Col, Input, Row, Select } from 'antd';
import { MANAGER_OPTIONS } from '../data';
import { ROOM_TYPE_OPTIONS, RoomType } from '../types';

interface Props {
	searchText: string;
	roomType?: RoomType;
	manager?: string;
	sortBySeats?: 'asc' | 'desc';
	onSearchTextChange: (value: string) => void;
	onRoomTypeChange: (value?: RoomType) => void;
	onManagerChange: (value?: string) => void;
	onSortChange: (value?: 'asc' | 'desc') => void;
	onAddRoom: () => void;
}

const RoomToolbar = ({
	searchText,
	roomType,
	manager,
	sortBySeats,
	onSearchTextChange,
	onRoomTypeChange,
	onManagerChange,
	onSortChange,
	onAddRoom,
}: Props) => {
	return (
		<Row gutter={[12, 12]}>
			<Col xs={24} md={12} lg={8}>
				<Input
					allowClear
					value={searchText}
					onChange={(event) => onSearchTextChange(event.target.value)}
					placeholder='Tìm theo mã phòng hoặc tên phòng'
				/>
			</Col>
			<Col xs={24} md={12} lg={5}>
				<Select
					allowClear
					placeholder='Lọc loại phòng'
					style={{ width: '100%' }}
					value={roomType}
					onChange={(value) => onRoomTypeChange(value)}
					options={ROOM_TYPE_OPTIONS}
				/>
			</Col>
			<Col xs={24} md={12} lg={5}>
				<Select
					allowClear
					placeholder='Lọc người phụ trách'
					style={{ width: '100%' }}
					value={manager}
					onChange={(value) => onManagerChange(value)}
					options={MANAGER_OPTIONS.map((item) => ({ label: item, value: item }))}
				/>
			</Col>
			<Col xs={24} md={12} lg={4}>
				<Select
					allowClear
					placeholder='Sắp xếp chỗ ngồi'
					style={{ width: '100%' }}
					value={sortBySeats}
					onChange={(value) => onSortChange(value)}
					options={[
						{ label: 'Tăng dần', value: 'asc' },
						{ label: 'Giảm dần', value: 'desc' },
					]}
				/>
			</Col>
			<Col xs={24} md={24} lg={2}>
				<Button block type='primary' onClick={onAddRoom}>
					Thêm
				</Button>
			</Col>
		</Row>
	);
};

export default RoomToolbar;
