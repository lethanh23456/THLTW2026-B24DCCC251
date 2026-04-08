import React from 'react';
import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';
import {
	Button,
	Card,
	Col,
	Form,
	Image,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Rate,
	Row,
	Select,
	Space,
	Statistic,
	Table,
	Tag,
	Upload,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { type RcFile } from 'antd/lib/upload';
import type { ColumnsType } from 'antd/lib/table';
import { destinationTypeMap } from '../dataSource';
import { type AdminStatistics, type BudgetBreakdown, type Destination } from '../types';

type Props = {
	destinations: Destination[];
	stats: AdminStatistics;
	budget: BudgetBreakdown;
	popularDestinations: { name: string; count: number }[];
	onCreate: (item: Destination) => void;
	onUpdate: (item: Destination) => void;
	onDelete: (id: string) => void;
};

type DestinationForm = Omit<Destination, 'id'> & { id?: string };

const defaultFormValue: DestinationForm = {
	name: '',
	location: '',
	image: '',
	description: '',
	type: 'city',
	rating: 4,
	basePrice: 2000000,
	visitDurationHours: 6,
	costFood: 400000,
	costAccommodation: 800000,
	costTransport: 500000,
	costActivities: 300000,
};

const AdminPanel: React.FC<Props> = ({
	destinations,
	stats,
	budget,
	popularDestinations,
	onCreate,
	onUpdate,
	onDelete,
}) => {
	const [form] = Form.useForm<DestinationForm>();
	const [open, setOpen] = React.useState(false);
	const [isEditing, setIsEditing] = React.useState(false);
	const [previewUrl, setPreviewUrl] = React.useState('');

	const openCreate = () => {
		setIsEditing(false);
		form.setFieldsValue(defaultFormValue);
		setPreviewUrl('');
		setOpen(true);
	};

	const openEdit = (record: Destination) => {
		setIsEditing(true);
		form.setFieldsValue({ ...record });
		setPreviewUrl(record.image);
		setOpen(true);
	};

	const onUploadImage = (file: RcFile) => {
		const reader = new FileReader();
		reader.onload = (event) => {
			const base64 = String(event.target?.result || '');
			form.setFieldsValue({ image: base64 });
			setPreviewUrl(base64);
		};
		reader.readAsDataURL(file);
		return false;
	};

	const onSubmit = async () => {
		const values = await form.validateFields();
		const item: Destination = {
			...(values as Destination),
			id:
				values.id ||
				`${values.name
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/[^a-z0-9]+/g, '-')}`,
		};

		if (isEditing) {
			onUpdate(item);
		} else {
			onCreate(item);
		}
		setOpen(false);
	};

	const columns: ColumnsType<Destination> = [
		{
			title: 'Điểm đến',
			dataIndex: 'name',
			key: 'name',
			render: (value, record) => (
				<Space>
					<Image width={52} height={40} src={record.image} style={{ objectFit: 'cover', borderRadius: 6 }} />
					<div>
						<div>{value}</div>
						<div style={{ color: '#8c8c8c' }}>{record.location}</div>
					</div>
				</Space>
			),
		},
		{
			title: 'Loại',
			dataIndex: 'type',
			key: 'type',
			render: (value: Destination['type']) => <Tag>{destinationTypeMap[value]}</Tag>,
		},
		{
			title: 'Rating',
			dataIndex: 'rating',
			key: 'rating',
			render: (value) => <Rate disabled allowHalf value={value} />,
		},
		{
			title: 'Chi phí',
			dataIndex: 'basePrice',
			key: 'basePrice',
			render: (value) => `${value.toLocaleString('vi-VN')} đ`,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_, record) => (
				<Space>
					<Button icon={<EditOutlined />} onClick={() => openEdit(record)} />
					<Popconfirm title='Xóa điểm đến này?' onConfirm={() => onDelete(record.id)}>
						<Button danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	const monthLabels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
	const revenueByCategorySeries = [
		stats.revenueByCategory.food,
		stats.revenueByCategory.transport,
		stats.revenueByCategory.accommodation,
		stats.revenueByCategory.activities,
	];
	const popularLabels = popularDestinations.map((item) => item.name);
	const popularSeries = popularDestinations.map((item) => item.count);

	return (
		<div className='bai1-section' style={{ overflowX: 'hidden' }}>
			<h2>4. Trang quản trị (Admin)</h2>
			<Card
				title='Quản lý điểm đến'
				extra={
					<Button type='primary' icon={<PlusOutlined />} onClick={openCreate}>
						Thêm điểm đến
					</Button>
				}
			>
				<Table<Destination>
					rowKey='id'
					columns={columns}
					dataSource={destinations}
					pagination={{ pageSize: 5 }}
					scroll={{ x: 900 }}
				/>
			</Card>

			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col xs={24} lg={12}>
					<Card title='Thống kê lịch trình theo tháng'>
						<ColumnChart
							title='Số lượt lịch trình'
							xAxis={monthLabels}
							yAxis={[stats.monthlyPlanCounts]}
							yLabel={['Lượt tạo lịch trình']}
							height={320}
							formatY={(val: number) => `${val} lượt`}
						/>
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card title='Địa điểm phổ biến'>
						<ColumnChart
							title='Điểm đến được chọn nhiều nhất'
							xAxis={popularLabels}
							yAxis={[popularSeries]}
							yLabel={['Số lần được chọn']}
							height={320}
							formatY={(val: number) => `${val} lượt`}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col xs={24} lg={12}>
					<Card title='Doanh thu theo hạng mục'>
						<DonutChart
							xAxis={['Ăn uống', 'Di chuyển', 'Lưu trú', 'Hoạt động']}
							yAxis={[revenueByCategorySeries]}
							yLabel={['Doanh thu']}
							height={320}
							showTotal
						/>
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card>
						<Statistic
							title='Tổng doanh thu'
							value={stats.totalRevenue}
							formatter={(value) => `${Number(value).toLocaleString('vi-VN')} đ`}
						/>
					</Card>
					<Card style={{ marginTop: 16 }}>
						<Statistic
							title='Tổng chi theo lịch trình hiện tại'
							value={budget.total}
							formatter={(value) => `${Number(value).toLocaleString('vi-VN')} đ`}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col xs={24} md={8}>
					<Card>
						<Statistic title='Số điểm đến' value={destinations.length} suffix='địa điểm' />
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card>
						<Statistic
							title='Chi phí ăn uống (itinerary)'
							value={budget.food}
							formatter={(value) => `${Number(value).toLocaleString('vi-VN')} đ`}
						/>
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card>
						<Statistic
							title='Chi phí lưu trú (itinerary)'
							value={budget.accommodation}
							formatter={(value) => `${Number(value).toLocaleString('vi-VN')} đ`}
						/>
					</Card>
				</Col>
			</Row>

			<Modal
				title={isEditing ? 'Cập nhật điểm đến' : 'Tạo điểm đến mới'}
				visible={open}
				onOk={onSubmit}
				onCancel={() => setOpen(false)}
				width={820}
				destroyOnClose
			>
				<Form form={form} layout='vertical' initialValues={defaultFormValue}>
					<Form.Item name='id' hidden>
						<Input />
					</Form.Item>
					<Row gutter={[12, 0]}>
						<Col xs={24} md={12}>
							<Form.Item name='name' label='Tên điểm đến' rules={[{ required: true, message: 'Nhập tên điểm đến' }]}>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='location' label='Địa điểm' rules={[{ required: true, message: 'Nhập địa điểm' }]}>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='type' label='Loại hình'>
								<Select>
									<Select.Option value='beach'>{destinationTypeMap.beach}</Select.Option>
									<Select.Option value='mountain'>{destinationTypeMap.mountain}</Select.Option>
									<Select.Option value='city'>{destinationTypeMap.city}</Select.Option>
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='rating' label='Rating'>
								<InputNumber min={1} max={5} step={0.1} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name='description' label='Mô tả'>
								<Input.TextArea rows={3} />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='visitDurationHours' label='Thời gian tham quan (giờ)'>
								<InputNumber min={1} max={24} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='basePrice' label='Giá cơ bản'>
								<InputNumber min={0} step={100000} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col xs={24} md={6}>
							<Form.Item name='costFood' label='Ăn uống'>
								<InputNumber min={0} step={50000} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col xs={24} md={6}>
							<Form.Item name='costTransport' label='Di chuyển'>
								<InputNumber min={0} step={50000} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col xs={24} md={6}>
							<Form.Item name='costAccommodation' label='Lưu trú'>
								<InputNumber min={0} step={50000} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col xs={24} md={6}>
							<Form.Item name='costActivities' label='Hoạt động'>
								<InputNumber min={0} step={50000} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name='image' label='Ảnh điểm đến' rules={[{ required: true, message: 'Chọn hoặc nhập ảnh' }]}>
								<Input placeholder='URL ảnh hoặc upload ảnh bên dưới' />
							</Form.Item>
							<Upload accept='image/*' beforeUpload={onUploadImage} showUploadList={false}>
								<Button icon={<UploadOutlined />}>Upload hình ảnh</Button>
							</Upload>
							{previewUrl ? (
								<div style={{ marginTop: 8 }}>
									<Image src={previewUrl} width={220} height={140} style={{ objectFit: 'cover' }} />
								</div>
							) : null}
						</Col>
					</Row>
				</Form>
			</Modal>
		</div>
	);
};

export default AdminPanel;
