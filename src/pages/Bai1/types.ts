export interface Club {
  id: string;
  avatar: string;
  name: string;
  foundedDate: string;
  description: string;
  manager: string;
  isActive: boolean;
}

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  skills: string;
  clubId: string;
  reason: string;
  status: ApplicationStatus;
  rejectReason?: string;
}

export interface HistoryAction {
  id: string;
  applicationId: string;
  adminName: string;
  action: 'Approved' | 'Rejected';
  timestamp: string;
  reason?: string;
}
