import { type Destination, type ItineraryDay } from '../types';
import { Button, Card, Col, Empty, Row, Select, Space, Tag } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

type Props = {
	itinerary: ItineraryDay[];
	destinations: Destination[];
	travelHoursByDay: { day: number; travelHours: number }[];
	onAddDestination: (day: number, destinationId: string) => void;
	onRemoveDestination: (day: number, destinationId: string) => void;
	onMoveDestination: (day: number, index: number, direction: 'up' | 'down') => void;
};

const ItineraryPlanner: React.FC<Props> = ({
	itinerary,
	destinations,
	travelHoursByDay,
	onAddDestination,
	onRemoveDestination,
	onMoveDestination,
}) => {
	const destinationMap = destinations.reduce<Record<string, Destination>>((acc, item) => {
		acc[item.id] = item;
		return acc;
	}, {});

	return (
		<div className='bai1-section'>
			<h2>2. Tạo lịch trình du lịch</h2>
			<Row gutter={[16, 16]}>
				{itinerary.map((dayItem) => {
					const travelHours = travelHoursByDay.find((item) => item.day === dayItem.day)?.travelHours ?? 0;
					return (
						<Col xs={24} lg={8} key={dayItem.day}>
							<Card title={`Ngày ${dayItem.day}`} bordered={false} className='bai1-day-card'>
								<Select
									placeholder='Chọn điểm đến'
									style={{ width: '100%', marginBottom: 12 }}
									onSelect={(value) => onAddDestination(dayItem.day, String(value))}
								>
									{destinations.map((destination) => (
										<Option value={destination.id} key={destination.id}>
											{destination.name}
										</Option>
									))}
								</Select>

								{dayItem.destinationIds.length === 0 ? (
									<Empty description='Chưa có điểm đến' image={Empty.PRESENTED_IMAGE_SIMPLE} />
								) : (
									<Space direction='vertical' size={10} style={{ width: '100%' }}>
										{dayItem.destinationIds.map((destinationId, index) => {
											const detail = destinationMap[destinationId];
											if (!detail) return null;
											return (
												<div key={destinationId} className='bai1-itinerary-item'>
													<div>
														<b>{detail.name}</b>
														<div>{detail.visitDurationHours} giờ tham quan</div>
													</div>
													<div className='bai1-item-actions'>
														<Button
															size='small'
															icon={<ArrowUpOutlined />}
															disabled={index === 0}
															onClick={() => onMoveDestination(dayItem.day, index, 'up')}
														/>
														<Button
															size='small'
															icon={<ArrowDownOutlined />}
															disabled={index === dayItem.destinationIds.length - 1}
															onClick={() => onMoveDestination(dayItem.day, index, 'down')}
														/>
														<Button
															size='small'
															danger
															icon={<DeleteOutlined />}
															onClick={() => onRemoveDestination(dayItem.day, destinationId)}
														/>
													</div>
												</div>
											);
										})}
									</Space>
								)}

								<div className='bai1-day-summary'>
									<Tag icon={<PlusOutlined />} color='processing'>
										Di chuyển: {travelHours.toFixed(1)} giờ
									</Tag>
								</div>
							</Card>
						</Col>
					);
				})}
			</Row>
		</div>
	);
};

export default ItineraryPlanner;
