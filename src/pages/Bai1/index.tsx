import React from 'react';
import { Card, InputNumber, Tabs } from 'antd';
import { tienVietNam } from '@/utils/utils';
import DestinationExplorer from './components/DestinationExplorer';
import ItineraryPlanner from './components/ItineraryPlanner';
import BudgetManager from './components/BudgetManager';
import AdminPanel from './components/AdminPanel';
import {
	calculateBudget,
	calculateTravelTimeByDay,
	getPopularDestinations,
	getSelectedDestinations,
} from './calculations';
import { defaultAdminStats, initialDestinations, initialItinerary, travelTimeHours } from './dataSource';
import { type Destination, type DestinationFilter, type ItineraryDay } from './types';
import './style.less';

const { TabPane } = Tabs;

const defaultFilter: DestinationFilter = {
	type: 'all',
	priceRange: [1000000, 4000000],
	minRating: 4,
	sortBy: 'ratingDesc',
};

const Bai1: React.FC = () => {
	const [destinations, setDestinations] = React.useState<Destination[]>(initialDestinations);
	const [itinerary, setItinerary] = React.useState<ItineraryDay[]>(initialItinerary);
	const [filter, setFilter] = React.useState<DestinationFilter>(defaultFilter);
	const [budgetLimit, setBudgetLimit] = React.useState<number>(10000000);

	const filteredDestinations = React.useMemo(() => {
		const byType = filter.type === 'all' ? destinations : destinations.filter((item) => item.type === filter.type);
		const byPrice = byType.filter((item) => item.basePrice <= filter.priceRange[1]);
		const byRating = byPrice.filter((item) => item.rating >= filter.minRating);

		const sorted = [...byRating].sort((a, b) => {
			switch (filter.sortBy) {
				case 'priceAsc':
					return a.basePrice - b.basePrice;
				case 'priceDesc':
					return b.basePrice - a.basePrice;
				case 'nameAsc':
					return a.name.localeCompare(b.name);
				case 'ratingDesc':
				default:
					return b.rating - a.rating;
			}
		});

		return sorted;
	}, [destinations, filter]);

	const selectedDestinations = React.useMemo(
		() => getSelectedDestinations(itinerary, destinations),
		[itinerary, destinations],
	);

	const budget = React.useMemo(() => calculateBudget(selectedDestinations), [selectedDestinations]);

	const travelHoursByDay = React.useMemo(() => calculateTravelTimeByDay(itinerary, travelTimeHours), [itinerary]);

	const popularDestinations = React.useMemo(
		() => getPopularDestinations(itinerary, destinations),
		[itinerary, destinations],
	);

	const addDestinationToDay = (day: number, destinationId: string) => {
		setItinerary((prev) =>
			prev.map((item) => {
				if (item.day !== day) return item;
				if (item.destinationIds.includes(destinationId)) return item;
				return { ...item, destinationIds: [...item.destinationIds, destinationId] };
			}),
		);
	};

	const removeDestinationFromDay = (day: number, destinationId: string) => {
		setItinerary((prev) =>
			prev.map((item) => {
				if (item.day !== day) return item;
				return { ...item, destinationIds: item.destinationIds.filter((id) => id !== destinationId) };
			}),
		);
	};

	const moveDestinationByDay = (day: number, index: number, direction: 'up' | 'down') => {
		setItinerary((prev) =>
			prev.map((item) => {
				if (item.day !== day) return item;
				const next = [...item.destinationIds];
				const targetIndex = direction === 'up' ? index - 1 : index + 1;
				if (targetIndex < 0 || targetIndex >= next.length) return item;
				[next[index], next[targetIndex]] = [next[targetIndex], next[index]];
				return { ...item, destinationIds: next };
			}),
		);
	};

	const createDestination = (item: Destination) => {
		setDestinations((prev) => {
			if (prev.some((destination) => destination.id === item.id)) {
				const randomSuffix = Math.floor(Math.random() * 9999);
				return [...prev, { ...item, id: `${item.id}-${randomSuffix}` }];
			}
			return [...prev, item];
		});
	};

	const updateDestination = (item: Destination) => {
		setDestinations((prev) => prev.map((destination) => (destination.id === item.id ? item : destination)));
	};

	const deleteDestination = (id: string) => {
		setDestinations((prev) => prev.filter((destination) => destination.id !== id));
		setItinerary((prev) =>
			prev.map((item) => ({
				...item,
				destinationIds: item.destinationIds.filter((destinationId) => destinationId !== id),
			})),
		);
	};

	return (
		<div className='bai1-page'>
			<Card className='bai1-header-card'>
				<h1>Ứng dụng lập kế hoạch du lịch</h1>
				<p>
					Khám phá điểm đến, tạo lịch trình theo ngày, theo dõi ngân sách và quản trị dữ liệu điểm đến trong một giao
					diện responsive.
				</p>
				<div className='bai1-budget-limit'>
					<span>Ngân sách mục tiêu:</span>
					<InputNumber
						value={budgetLimit}
						onChange={(value) => setBudgetLimit(Number(value || 0))}
						min={1000000}
						step={500000}
						formatter={(value) => tienVietNam(Number(value || 0))}
						parser={(value) => Number((value || '').replace(/[^0-9]/g, ''))}
					/>
				</div>
			</Card>

			<Tabs defaultActiveKey='discover' className='bai1-tabs'>
				<TabPane tab='Khám phá' key='discover'>
					<DestinationExplorer destinations={filteredDestinations} filter={filter} onFilterChange={setFilter} />
				</TabPane>
				<TabPane tab='Lịch trình' key='itinerary'>
					<ItineraryPlanner
						itinerary={itinerary}
						destinations={destinations}
						travelHoursByDay={travelHoursByDay}
						onAddDestination={addDestinationToDay}
						onRemoveDestination={removeDestinationFromDay}
						onMoveDestination={moveDestinationByDay}
					/>
				</TabPane>
				<TabPane tab='Ngân sách' key='budget'>
					<BudgetManager budget={budget} budgetLimit={budgetLimit} />
				</TabPane>
				<TabPane tab='Admin' key='admin'>
					<AdminPanel
						destinations={destinations}
						stats={defaultAdminStats}
						budget={budget}
						popularDestinations={popularDestinations}
						onCreate={createDestination}
						onUpdate={updateDestination}
						onDelete={deleteDestination}
					/>
				</TabPane>
			</Tabs>
		</div>
	);
};

export default Bai1;
