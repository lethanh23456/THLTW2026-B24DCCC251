import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Service, Staff, Appointment, Review, AppointmentStatus } from './types';
import { message } from 'antd';
import moment from 'moment';

interface BookingContextType {
  services: Service[];
  staffs: Staff[];
  appointments: Appointment[];
  reviews: Review[];


  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Omit<Service, 'id'>) => void;
  deleteService: (id: string) => void;


  addStaff: (staff: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, staff: Omit<Staff, 'id'>) => void;
  deleteStaff: (id: string) => void;


  bookAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => boolean;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;


  addReview: (review: Omit<Review, 'id' | 'staffReply'>) => void;
  replyReview: (id: string, reply: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);


const initialServices: Service[] = [
  { id: 's1', name: 'Cắt tóc nam', price: 100000, durationMinutes: 30 },
  { id: 's2', name: 'Massage mặt', price: 200000, durationMinutes: 60 },
  { id: 's3', name: 'Nhuộm tóc', price: 500000, durationMinutes: 120 },
];

const initialStaffs: Staff[] = [
  { id: 'st1', name: 'ten 1', maxCustomersPerDay: 5, workingDays: [1, 2, 3, 4, 5], workingHours: ['09:00', '17:00'] },
  { id: 'st2', name: 'ten 2', maxCustomersPerDay: 8, workingDays: [1, 2, 3, 4, 5, 6], workingHours: ['08:00', '20:00'] },
];

const initialAppointments: Appointment[] = [
  { id: 'a1', customerName: 'Khách C', customerPhone: '0901234567', serviceId: 's1', staffId: 'st1', date: moment().format('YYYY-MM-DD'), time: '10:00', status: 'completed' },
  { id: 'a2', customerName: 'Khách D', customerPhone: '0901234568', serviceId: 's2', staffId: 'st2', date: moment().format('YYYY-MM-DD'), time: '14:00', status: 'confirmed' },
];

const initialReviews: Review[] = [
  { id: 'r1', appointmentId: 'a1', staffId: 'st1', customerName: 'Khách C', rating: 5, comment: 'Dịch vụ rất tốt!', staffReply: 'Cảm ơn bạn nhé!' }
];

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [staffs, setStaffs] = useState<Staff[]>(initialStaffs);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const addService = (service: Omit<Service, 'id'>) => setServices([...services, { ...service, id: `s${Date.now()}` }]);
  const updateService = (id: string, service: Omit<Service, 'id'>) => setServices(services.map(s => s.id === id ? { ...s, ...service } : s));
  const deleteService = (id: string) => setServices(services.filter(s => s.id !== id));

  const addStaff = (staff: Omit<Staff, 'id'>) => setStaffs([...staffs, { ...staff, id: `st${Date.now()}` }]);
  const updateStaff = (id: string, staff: Omit<Staff, 'id'>) => setStaffs(staffs.map(s => s.id === id ? { ...s, ...staff } : s));
  const deleteStaff = (id: string) => setStaffs(staffs.filter(s => s.id !== id));

  const bookAppointment = (app: Omit<Appointment, 'id' | 'status'>) => {

    const staff = staffs.find(s => s.id === app.staffId);
    if (!staff) {
      message.error('Nhân viên không tồn tại!');
      return false;
    }


    const staffAppointmentsToday = appointments.filter(a => a.staffId === app.staffId && a.date === app.date && a.status !== 'cancelled');
    if (staffAppointmentsToday.length >= staff.maxCustomersPerDay) {
      message.error('Nhân viên đã đạt giới hạn khách trong ngày!');
      return false;
    }


    const isOverlap = staffAppointmentsToday.some(a => a.time === app.time);
    if (isOverlap) {
      message.error('Nhân viên đã có lịch trùng giờ này!');
      return false;
    }

    setAppointments([...appointments, { ...app, id: `a${Date.now()}`, status: 'pending' }]);
    message.success('Đặt lịch thành công!');
    return true;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
  };

  const addReview = (review: Omit<Review, 'id' | 'staffReply'>) => {
    const app = appointments.find(a => a.id === review.appointmentId);
    if (!app || app.status !== 'completed') {
      message.error('Chỉ được đánh giá lịch hẹn đã hoàn thành!');
      return;
    }


    if (reviews.some(r => r.appointmentId === review.appointmentId)) {
      message.error('Lịch hẹn này đã được đánh giá!');
      return;
    }

    setReviews([...reviews, { ...review, id: `r${Date.now()}` }]);
    message.success('Gửi đánh giá thành công!');
  };

  const replyReview = (id: string, reply: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, staffReply: reply } : r));
    message.success('Đã phản hồi đánh giá!');
  };

  return (
    <BookingContext.Provider
      value={{
        services, staffs, appointments, reviews,
        addService, updateService, deleteService,
        addStaff, updateStaff, deleteStaff,
        bookAppointment, updateAppointmentStatus,
        addReview, replyReview
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
