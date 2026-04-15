import { RoomType } from './types';
import type { Room } from './types';

export const MANAGER_OPTIONS = [
	'Nguyễn Tiến Dũng',
	'Trần Thị Bình',
	'Lê Minh Châu',
	'Phạm Quốc Dũng',
	'Đặng Thu Hà',
];

export const INITIAL_ROOMS: Room[] = [
	{
		id: '1',
		maPhong: 'A1',
		tenPhong: 'Phòng học A1',
		soChoNgoi: 25,
		loaiPhong: RoomType.LY_THUYET,
		nguoiPhuTrach: 'Nguyễn Tiến Dũng',
	},
	{
		id: '2',
		maPhong: 'B1',
		tenPhong: 'Phòng thực hành B1',
		soChoNgoi: 40,
		loaiPhong: RoomType.THUC_HANH,
		nguoiPhuTrach: 'Trần Thị Bình',
	},
	{
		id: '3',
		maPhong: 'C1',
		tenPhong: 'Hội trường C1',
		soChoNgoi: 180,
		loaiPhong: RoomType.HOI_TRUONG,
		nguoiPhuTrach: 'Phạm Quốc Dũng',
	}
];
