import { type BudgetBreakdown, type Destination, type ItineraryDay } from './types';

export const getTravelKey = (fromId: string, toId: string) => `${fromId}-${toId}`;

export const calculateTravelTimeByDay = (itinerary: ItineraryDay[], travelMatrix: Record<string, number>) => {
	return itinerary.map((dayItem) => {
		const ids = dayItem.destinationIds;
		let travelHours = 0;
		for (let i = 0; i < ids.length - 1; i += 1) {
			travelHours += travelMatrix[getTravelKey(ids[i], ids[i + 1])] ?? 2;
		}
		return {
			day: dayItem.day,
			travelHours,
		};
	});
};

export const calculateBudget = (selectedDestinations: Destination[]): BudgetBreakdown => {
	const budget = selectedDestinations.reduce(
		(acc, destination) => {
			acc.food += destination.costFood;
			acc.transport += destination.costTransport;
			acc.accommodation += destination.costAccommodation;
			acc.activities += destination.costActivities;
			return acc;
		},
		{ food: 0, transport: 0, accommodation: 0, activities: 0, total: 0 },
	);

	budget.total = budget.food + budget.transport + budget.accommodation + budget.activities;
	return budget;
};

export const getSelectedDestinations = (itinerary: ItineraryDay[], destinations: Destination[]) => {
	const destinationMap = destinations.reduce<Record<string, Destination>>((acc, item) => {
		acc[item.id] = item;
		return acc;
	}, {});

	return itinerary
		.flatMap((dayItem) => dayItem.destinationIds)
		.map((destinationId) => destinationMap[destinationId])
		.filter(Boolean);
};

export const getPopularDestinations = (itinerary: ItineraryDay[], destinations: Destination[]) => {
	const counts = itinerary
		.flatMap((dayItem) => dayItem.destinationIds)
		.reduce<Record<string, number>>((acc, destinationId) => {
			acc[destinationId] = (acc[destinationId] ?? 0) + 1;
			return acc;
		}, {});

	return destinations
		.map((destination) => ({
			name: destination.name,
			count: counts[destination.id] ?? 0,
		}))
		.sort((a, b) => b.count - a.count)
		.slice(0, 5);
};
