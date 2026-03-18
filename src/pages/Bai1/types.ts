export type Service = {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
};

export type Staff = {
  id: string;
  name: string;
  maxCustomersPerDay: number;
  workingDays: number[];
  workingHours: [string, string];
};

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type Appointment = {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
};

export type Review = {
  id: string;
  appointmentId: string;
  staffId: string;
  customerName: string;
  rating: number;
  comment: string;
  staffReply?: string;
};
