import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Club, Application, HistoryAction } from './types';
import { mockClubs, mockApplications, mockHistories } from './data';
import moment from 'moment';

interface ClubContextProps {
  clubs: Club[];
  setClubs: React.Dispatch<React.SetStateAction<Club[]>>;
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  histories: HistoryAction[];
  setHistories: React.Dispatch<React.SetStateAction<HistoryAction[]>>;
  
  approveApplications: (ids: string[]) => void;
  rejectApplications: (ids: string[], reason: string) => void;
  changeMemberClub: (applicationIds: string[], newClubId: string) => void;
}

const ClubContext = createContext<ClubContextProps | undefined>(undefined);

export const ClubProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clubs, setClubs] = useState<Club[]>(mockClubs);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [histories, setHistories] = useState<HistoryAction[]>(mockHistories);

  const approveApplications = (ids: string[]) => {
    setApplications(prev => prev.map(app => ids.includes(app.id) ? { ...app, status: 'Approved' } : app));
    const newHistories = ids.map(id => ({
      id: `H_${Date.now()}_${id}`,
      applicationId: id,
      adminName: 'Admin User',
      action: 'Approved' as const,
      timestamp: moment().toISOString(),
    }));
    setHistories(prev => [...prev, ...newHistories]);
  };

  const rejectApplications = (ids: string[], reason: string) => {
    setApplications(prev => prev.map(app => ids.includes(app.id) ? { ...app, status: 'Rejected', rejectReason: reason } : app));
    const newHistories = ids.map(id => ({
      id: `H_${Date.now()}_${id}`,
      applicationId: id,
      adminName: 'Admin User',
      action: 'Rejected' as const,
      timestamp: moment().toISOString(),
      reason,
    }));
    setHistories(prev => [...prev, ...newHistories]);
  };

  const changeMemberClub = (applicationIds: string[], newClubId: string) => {
    setApplications(prev => prev.map(app => applicationIds.includes(app.id) ? { ...app, clubId: newClubId } : app));
  };

  return (
    <ClubContext.Provider value={{ clubs, setClubs, applications, setApplications, histories, setHistories, approveApplications, rejectApplications, changeMemberClub }}>
      {children}
    </ClubContext.Provider>
  );
};

export const useClubContext = () => {
  const context = useContext(ClubContext);
  if (!context) throw new Error("useClubContext must be used within ClubProvider");
  return context;
};
