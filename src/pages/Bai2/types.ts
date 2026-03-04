export interface Subject {
  id: string;
  name: string;
  color?: string;
}

export interface StudySession {
  id: string;
  subjectId: string;
  date: string; 
  startTime: string;
  duration: number; 
  content: string;
  notes: string;
}

export interface MonthlyGoal {
  id: string;
  subjectId: string;
  month: string; 
  targetHours: number;
}

export interface GlobalGoal {
  id: string;
  month: string; 
  targetHours: number;
}
