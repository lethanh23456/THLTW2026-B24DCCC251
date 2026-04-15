import { Button, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { ROOM_TYPE_LABEL } from '../types';
import type { Room } from '../types';

interface Props {
	data: Room[];
	onEdit: (record: Room) => void;
	onDelete: (record: Room) => void;
}

const RoomTable = ({ data, onEdit, onDelete }: Props) => {
	const columns: ColumnsType<Room> = [
		{
			title: 'Mã phòng',
			dataIndex: 'maPhong',
			key: 'maPhong',
			width: 120,
		},
		{
			title: 'Tên phòng',
			dataIndex: 'tenPhong',
			key: 'tenPhong',
			width: 260,
		},
		{
			title: 'Số chỗ ngồi',
			dataIndex: 'soChoNgoi',
			key: 'soChoNgoi',
			align: 'right',
			width: 120,
		},
		{
			title: 'Loại phòng',
			dataIndex: 'loaiPhong',
			key: 'loaiPhong',
			width: 150,
			render: (value: Room['loaiPhong']) => <Tag color='blue'>{ROOM_TYPE_LABEL[value]}</Tag>,
		},
		{
			title: 'Người phụ trách',
			dataIndex: 'nguoiPhuTrach',
			key: 'nguoiPhuTrach',
			width: 200,
		},
		{
			title: 'Thao tác',
			key: 'actions',
			width: 180,
			fixed: 'right',
			render: (_, record) => (
				<Space>
					<Button type='link' onClick={() => onEdit(record)}>
						Chỉnh sửa
					</Button>
					<Button danger type='link' onClick={() => onDelete(record)}>
						Xóa
					</Button>
				</Space>
			),
		},
	];

	return (
		<Table
			rowKey='id'
			columns={columns}
			dataSource={data}
			scroll={{ x: 1000 }}
			pagination={{ pageSize: 8, showSizeChanger: false }}
		/>
	);
};

export default RoomTable;
