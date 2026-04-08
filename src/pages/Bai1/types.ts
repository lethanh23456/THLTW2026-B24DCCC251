export type DestinationType = 'beach' | 'mountain' | 'city';

export type Destination = {
	id: string;
	name: string;
	location: string;
	image: string;
	description: string;
	type: DestinationType;
	rating: number;
	basePrice: number;
	visitDurationHours: number;
	costFood: number;
	costAccommodation: number;
	costTransport: number;
	costActivities: number;
};

export type ItineraryDay = {
	day: number;
	destinationIds: string[];
};

export type BudgetBreakdown = {
	food: number;
	transport: number;
	accommodation: number;
	activities: number;
	total: number;
};

export type DestinationFilter = {
	type: 'all' | DestinationType;
	priceRange: [number, number];
	minRating: number;
	sortBy: 'ratingDesc' | 'priceAsc' | 'priceDesc' | 'nameAsc';
};

export type AdminStatistics = {
	monthlyPlanCounts: number[];
	totalRevenue: number;
	revenueByCategory: {
		food: number;
		transport: number;
		accommodation: number;
		activities: number;
	};
};
