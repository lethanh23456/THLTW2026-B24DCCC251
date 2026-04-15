import { Card, Modal, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { INITIAL_ROOMS } from './data';
import RoomFormModal from './components/RoomFormModal';
import RoomTable from './components/RoomTable';
import RoomToolbar from './components/RoomToolbar';
import type { Room, RoomFormValues, RoomType } from './types';

const { Title, Text } = Typography;

const QuanLyPhongHoc: React.FC = () => {
	const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
	const [searchText, setSearchText] = useState<string>('');
	const [selectedRoomType, setSelectedRoomType] = useState<RoomType | undefined>(undefined);
	const [selectedManager, setSelectedManager] = useState<string | undefined>(undefined);
	const [sortBySeats, setSortBySeats] = useState<'asc' | 'desc' | undefined>(undefined);
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [editingRoom, setEditingRoom] = useState<Room | undefined>(undefined);

	const filteredRooms = useMemo(() => {
		const normalizedSearch = searchText.trim().toLowerCase();
		let nextData = [...rooms];

		if (normalizedSearch) {
			nextData = nextData.filter(
				(item) =>
					item.maPhong.toLowerCase().includes(normalizedSearch) ||
					item.tenPhong.toLowerCase().includes(normalizedSearch),
			);
		}

		if (selectedRoomType) {
			nextData = nextData.filter((item) => item.loaiPhong === selectedRoomType);
		}

		if (selectedManager) {
			nextData = nextData.filter((item) => item.nguoiPhuTrach === selectedManager);
		}

		if (sortBySeats) {
			nextData.sort((a, b) => {
				return sortBySeats === 'asc' ? a.soChoNgoi - b.soChoNgoi : b.soChoNgoi - a.soChoNgoi;
			});
		}

		return nextData;
	}, [rooms, searchText, selectedRoomType, selectedManager, sortBySeats]);

	const closeModal = () => {
		setVisibleModal(false);
		setEditingRoom(undefined);
	};

	const handleOpenCreate = () => {
		setEditingRoom(undefined);
		setVisibleModal(true);
	};

	const handleOpenEdit = (room: Room) => {
		setEditingRoom(room);
		setVisibleModal(true);
	};

	const handleSubmit = (values: RoomFormValues) => {
		if (editingRoom) {
			setRooms((prev) => prev.map((item) => (item.id === editingRoom.id ? { ...item, ...values } : item)));
			message.success('Cập nhật phòng học thành công');
		} else {
			const newRoom: Room = {
				id: `${Date.now()}`,
				...values,
			};
			setRooms((prev) => [newRoom, ...prev]);
			message.success('Thêm phòng học thành công');
		}
		closeModal();
	};

	const handleDelete = (room: Room) => {
		if (room.soChoNgoi >= 30) {
			message.warning('Chỉ được xóa phòng có dưới 30 chỗ ngồi');
			return;
		}

		Modal.confirm({
			title: 'Xác nhận xóa phòng học',
			content: `Bạn có chắc muốn xóa phòng ${room.maPhong} - ${room.tenPhong}?`,
			okText: 'Xóa',
			cancelText: 'Hủy',
			onOk: () => {
				setRooms((prev) => prev.filter((item) => item.id !== room.id));
				message.success('Xóa phòng học thành công');
			},
		});
	};

	return (
		<div className='QuanLyPhongHoc-page'>
			<Card>
				<Title level={3}>Quản lý phòng học</Title>
				<Text type='secondary'>Quản lý thông tin phòng học, tìm kiếm, lọc và cập nhật dữ liệu nhanh chóng.</Text>

				<div style={{ marginTop: 16 }}>
					<RoomToolbar
						searchText={searchText}
						roomType={selectedRoomType}
						manager={selectedManager}
						sortBySeats={sortBySeats}
						onSearchTextChange={setSearchText}
						onRoomTypeChange={setSelectedRoomType}
						onManagerChange={setSelectedManager}
						onSortChange={setSortBySeats}
						onAddRoom={handleOpenCreate}
					/>
				</div>

				<div style={{ marginTop: 16 }}>
					<RoomTable data={filteredRooms} onEdit={handleOpenEdit} onDelete={handleDelete} />
				</div>
			</Card>

			<RoomFormModal
				visible={visibleModal}
				editingRoom={editingRoom}
				rooms={rooms}
				onCancel={closeModal}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default QuanLyPhongHoc;
