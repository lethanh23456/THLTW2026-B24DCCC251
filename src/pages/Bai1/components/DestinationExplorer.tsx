import { destinationTypeMap } from '../dataSource';
import { type Destination, type DestinationFilter } from '../types';
import { Card, Col, Form, InputNumber, Rate, Row, Select, Slider, Tag } from 'antd';

const { Option } = Select;

type Props = {
	destinations: Destination[];
	filter: DestinationFilter;
	onFilterChange: (next: DestinationFilter) => void;
};

const typeColor: Record<string, string> = {
	beach: 'blue',
	mountain: 'green',
	city: 'gold',
};

const DestinationExplorer: React.FC<Props> = ({ destinations, filter, onFilterChange }) => {
	return (
		<div className='bai1-section'>
			<h2>1. Trang chủ - Khám phá điểm đến</h2>
			<Form layout='vertical' className='bai1-filter-panel'>
				<Row gutter={[12, 12]}>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Form.Item label='Loại hình'>
							<Select value={filter.type} onChange={(value) => onFilterChange({ ...filter, type: value })}>
								<Option value='all'>{destinationTypeMap.all}</Option>
								<Option value='beach'>{destinationTypeMap.beach}</Option>
								<Option value='mountain'>{destinationTypeMap.mountain}</Option>
								<Option value='city'>{destinationTypeMap.city}</Option>
							</Select>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Form.Item label='Giá tối đa'>
							<InputNumber
								style={{ width: '100%' }}
								min={1000000}
								step={100000}
								value={filter.priceRange[1]}
								onChange={(value) =>
									onFilterChange({
										...filter,
										priceRange: [filter.priceRange[0], Number(value || 0)] as [number, number],
									})
								}
								formatter={(val) => `${Number(val || 0).toLocaleString('vi-VN')} đ`}
								parser={(val) => Number((val || '').replace(/[^0-9]/g, ''))}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Form.Item label='Đánh giá tối thiểu'>
							<Slider
								min={1}
								max={5}
								step={0.1}
								value={filter.minRating}
								onChange={(value) => onFilterChange({ ...filter, minRating: Number(value) })}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Form.Item label='Sắp xếp'>
							<Select value={filter.sortBy} onChange={(value) => onFilterChange({ ...filter, sortBy: value })}>
								<Option value='ratingDesc'>Đánh giá cao nhất</Option>
								<Option value='priceAsc'>Giá tăng dần</Option>
								<Option value='priceDesc'>Giá giảm dần</Option>
								<Option value='nameAsc'>Tên A-Z</Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>
			</Form>

			<Row gutter={[16, 16]}>
				{destinations.map((item) => (
					<Col xs={24} sm={12} lg={8} xxl={6} key={item.id}>
						<Card hoverable cover={<img alt={item.name} src={item.image} className='bai1-cover-image' />}>
							<div className='bai1-card-content'>
								<h3>{item.name}</h3>
								<p>{item.location}</p>
								<Rate disabled allowHalf value={item.rating} />
								<div>
									<Tag color={typeColor[item.type]}>{destinationTypeMap[item.type]}</Tag>
								</div>
								<div className='bai1-price'>{item.basePrice.toLocaleString('vi-VN')} đ</div>
							</div>
						</Card>
					</Col>
				))}
			</Row>
		</div>
	);
};

export default DestinationExplorer;
