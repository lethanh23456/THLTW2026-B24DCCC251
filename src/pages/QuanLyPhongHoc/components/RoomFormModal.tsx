import { Button, Form, Input, InputNumber, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { MANAGER_OPTIONS } from '../data';
import { Room, RoomFormValues, ROOM_TYPE_OPTIONS } from '../types';

interface Props {
	visible: boolean;
	editingRoom?: Room;
	rooms: Room[];
	onCancel: () => void;
	onSubmit: (values: RoomFormValues) => void;
}

const RoomFormModal = ({ visible, editingRoom, rooms, onCancel, onSubmit }: Props) => {
	const [form] = Form.useForm<RoomFormValues>();

	useEffect(() => {
		if (!visible) {
			form.resetFields();
			return;
		}
		if (editingRoom) {
			form.setFieldsValue({
				maPhong: editingRoom.maPhong,
				tenPhong: editingRoom.tenPhong,
				soChoNgoi: editingRoom.soChoNgoi,
				loaiPhong: editingRoom.loaiPhong,
				nguoiPhuTrach: editingRoom.nguoiPhuTrach,
			});
		}
	}, [visible, editingRoom, form]);

	return (
		<Modal
			destroyOnClose
			visible={visible}
			title={editingRoom ? 'Chỉnh sửa phòng học' : 'Thêm phòng học'}
			footer={null}
			onCancel={onCancel}
		>
			<Form form={form} layout='vertical' onFinish={onSubmit}>
				<Form.Item
					label='Mã phòng'
					name='maPhong'
					rules={[
						{ required: true, message: 'Vui lòng nhập mã phòng' },
						{ max: 10, message: 'Mã phòng tối đa 10 ký tự' },
						{
							validator: async (_, value: string) => {
								const normalized = value?.trim().toLowerCase();
								if (!normalized) return;
								const isDuplicated = rooms.some(
									(item) => item.id !== editingRoom?.id && item.maPhong.trim().toLowerCase() === normalized,
								);
								if (isDuplicated) {
									throw new Error('Mã phòng đã tồn tại');
								}
							},
						},
					]}
				>
					<Input placeholder='Ví dụ: A101' />
				</Form.Item>

				<Form.Item
					label='Tên phòng'
					name='tenPhong'
					rules={[
						{ required: true, message: 'Vui lòng nhập tên phòng' },
						{ max: 50, message: 'Tên phòng tối đa 50 ký tự' },
						{
							validator: async (_, value: string) => {
								const normalized = value?.trim().toLowerCase();
								if (!normalized) return;
								const isDuplicated = rooms.some(
									(item) => item.id !== editingRoom?.id && item.tenPhong.trim().toLowerCase() === normalized,
								);
								if (isDuplicated) {
									throw new Error('Tên phòng đã tồn tại');
								}
							},
						},
					]}
				>
					<Input placeholder='Ví dụ: Phòng học A1' />
				</Form.Item>

				<Form.Item
					label='Người phụ trách'
					name='nguoiPhuTrach'
					rules={[{ required: true, message: 'Vui lòng chọn người phụ trách' }]}
				>
					<Select
						placeholder='Chọn người phụ trách'
						options={MANAGER_OPTIONS.map((item) => ({ label: item, value: item }))}
					/>
				</Form.Item>

				<Form.Item
					label='Số chỗ ngồi'
					name='soChoNgoi'
					rules={[{ required: true, message: 'Vui lòng nhập số chỗ ngồi' }]}
				>
					<InputNumber min={10} max={200} style={{ width: '100%' }} placeholder='Từ 10 đến 200' />
				</Form.Item>

				<Form.Item
					label='Loại phòng'
					name='loaiPhong'
					rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
				>
					<Select placeholder='Chọn loại phòng' options={ROOM_TYPE_OPTIONS} />
				</Form.Item>

				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						{editingRoom ? 'Lưu lại' : 'Thêm mới'}
					</Button>
					<Button onClick={onCancel}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default RoomFormModal;
