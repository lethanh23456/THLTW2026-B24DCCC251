export enum RoomType {
	LY_THUYET = 'LY_THUYET',
	THUC_HANH = 'THUC_HANH',
	HOI_TRUONG = 'HOI_TRUONG',
}

export interface Room {
	id: string;
	maPhong: string;
	tenPhong: string;
	soChoNgoi: number;
	loaiPhong: RoomType;
	nguoiPhuTrach: string;
}

export interface RoomFormValues {
	maPhong: string;
	tenPhong: string;
	soChoNgoi: number;
	loaiPhong: RoomType;
	nguoiPhuTrach: string;
}

export const ROOM_TYPE_OPTIONS: { label: string; value: RoomType }[] = [
	{ label: 'Lý thuyết', value: RoomType.LY_THUYET },
	{ label: 'Thực hành', value: RoomType.THUC_HANH },
	{ label: 'Hội trường', value: RoomType.HOI_TRUONG },
];

export const ROOM_TYPE_LABEL: Record<RoomType, string> = {
	[RoomType.LY_THUYET]: 'Lý thuyết',
	[RoomType.THUC_HANH]: 'Thực hành',
	[RoomType.HOI_TRUONG]: 'Hội trường',
};
