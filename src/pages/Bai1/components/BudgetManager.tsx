import DonutChart from '@/components/Chart/DonutChart';
import { Alert, Card, Col, Progress, Row, Statistic } from 'antd';
import { type BudgetBreakdown } from '../types';

type Props = {
	budget: BudgetBreakdown;
	budgetLimit: number;
};

const BudgetManager: React.FC<Props> = ({ budget, budgetLimit }) => {
	const percent = budgetLimit > 0 ? Math.round((budget.total / budgetLimit) * 100) : 0;
	const overBudget = budget.total > budgetLimit;

	return (
		<div className='bai1-section'>
			<h2>3. Quản lý ngân sách</h2>
			<Row gutter={[16, 16]}>
				<Col xs={24} lg={16}>
					<Card title='Phân bổ ngân sách theo hạng mục'>
						<DonutChart
							xAxis={['Ăn uống', 'Di chuyển', 'Lưu trú', 'Hoạt động']}
							yAxis={[[budget.food, budget.transport, budget.accommodation, budget.activities]]}
							yLabel={['Chi phí']}
							colors={['#1890ff', '#13c2c2', '#52c41a', '#fa8c16']}
							showTotal
						/>
					</Card>
				</Col>
				<Col xs={24} lg={8}>
					<Card title='Theo dõi ngân sách'>
						<Statistic
							title='Tổng chi phí hiện tại'
							value={budget.total}
							formatter={(value) => `${Number(value).toLocaleString('vi-VN')} đ`}
						/>
						<Statistic
							title='Ngân sách mục tiêu'
							value={budgetLimit}
							formatter={(value) => `${Number(value).toLocaleString('vi-VN')} đ`}
						/>
						<div style={{ marginTop: 12 }}>
							<Progress
								percent={Math.min(percent, 100)}
								status={overBudget ? 'exception' : 'active'}
								strokeColor={overBudget ? '#ff4d4f' : '#52c41a'}
							/>
						</div>
						{overBudget ? (
							<Alert
								style={{ marginTop: 12 }}
								message='Cảnh báo vượt ngân sách'
								description={`Vượt ${(budget.total - budgetLimit).toLocaleString('vi-VN')} đ so với mức kế hoạch.`}
								type='error'
								showIcon
							/>
						) : (
							<Alert style={{ marginTop: 12 }} message='Ngân sách đang trong mức an toàn' type='success' showIcon />
						)}
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default BudgetManager;
