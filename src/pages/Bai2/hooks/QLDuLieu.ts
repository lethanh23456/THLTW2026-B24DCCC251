import { useState, useCallback, useEffect } from 'react';
import { Subject, StudySession, MonthlyGoal, GlobalGoal } from '../types';

const STORAGE_KEY = {
  SUBJECTS: 'bai2_subjects',
  STUDY_SESSIONS: 'bai2_study_sessions',
  MONTHLY_GOALS: 'bai2_monthly_goals',
  GLOBAL_GOALS: 'bai2_global_goals',
};

const MON_HOC_MAC_DINH: Subject[] = [
  { id: 'mh-toan', name: 'Toán', color: '#1890ff' },
  { id: 'mh-van', name: 'Văn', color: '#52c41a' },
  { id: 'mh-anh', name: 'Anh', color: '#faad14' },
  { id: 'mh-khoahoc', name: 'Khoa học', color: '#f5222d' },
  { id: 'mh-congnghe', name: 'Công nghệ', color: '#13c2c2' },
];

export const useLocalStorage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoal[]>([]);
  const [globalGoals, setGlobalGoals] = useState<GlobalGoal[]>([]);

  
  useEffect(() => {
    const savedSubjects = localStorage.getItem(STORAGE_KEY.SUBJECTS);
    const savedSessions = localStorage.getItem(STORAGE_KEY.STUDY_SESSIONS);
    const savedMonthlyGoals = localStorage.getItem(STORAGE_KEY.MONTHLY_GOALS);
    const savedGlobalGoals = localStorage.getItem(STORAGE_KEY.GLOBAL_GOALS);

    if (savedSubjects) {
      const parsedSubjects: Subject[] = JSON.parse(savedSubjects);
      setSubjects(parsedSubjects.length > 0 ? parsedSubjects : MON_HOC_MAC_DINH);
    } else {
      setSubjects(MON_HOC_MAC_DINH);
    }
    if (savedSessions) setStudySessions(JSON.parse(savedSessions));
    if (savedMonthlyGoals) setMonthlyGoals(JSON.parse(savedMonthlyGoals));
    if (savedGlobalGoals) setGlobalGoals(JSON.parse(savedGlobalGoals));
  }, []);

  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY.STUDY_SESSIONS, JSON.stringify(studySessions));
  }, [studySessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY.MONTHLY_GOALS, JSON.stringify(monthlyGoals));
  }, [monthlyGoals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY.GLOBAL_GOALS, JSON.stringify(globalGoals));
  }, [globalGoals]);

 
  const addSubject = useCallback((name: string, color?: string) => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name,
      color: color || generateRandomColor(),
    };
    setSubjects((prev) => [...prev, newSubject]);
    return newSubject;
  }, []);

  const updateSubject = useCallback((id: string, name: string, color?: string) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name, color: color || s.color } : s))
    );
  }, []);

  const deleteSubject = useCallback((id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setStudySessions((prev) => prev.filter((s) => s.subjectId !== id));
    setMonthlyGoals((prev) => prev.filter((g) => g.subjectId !== id));
  }, []);

 
  const addStudySession = useCallback((session: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...session,
      id: Date.now().toString(),
    };
    setStudySessions((prev) => [...prev, newSession]);
    return newSession;
  }, []);

  const updateStudySession = useCallback((id: string, session: Omit<StudySession, 'id'>) => {
    setStudySessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...session } : s))
    );
  }, []);

  const deleteStudySession = useCallback((id: string) => {
    setStudySessions((prev) => prev.filter((s) => s.id !== id));
  }, []);


  const setMonthlyGoalForSubject = useCallback((subjectId: string, month: string, targetHours: number) => {
    setMonthlyGoals((prev) => {
      const existing = prev.find((g) => g.subjectId === subjectId && g.month === month);
      if (existing) {
        return prev.map((g) =>
          g.id === existing.id ? { ...g, targetHours } : g
        );
      }
      return [
        ...prev,
        {
          id: Date.now().toString(),
          subjectId,
          month,
          targetHours,
        },
      ];
    });
  }, []);

  const deleteMonthlyGoal = useCallback((id: string) => {
    setMonthlyGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  
  const setGlobalGoalForMonth = useCallback((month: string, targetHours: number) => {
    setGlobalGoals((prev) => {
      const existing = prev.find((goal) => goal.month === month);
      if (existing) {
        return prev.map((goal) =>
          goal.id === existing.id ? { ...goal, targetHours } : goal
        );
      }

      return [
        ...prev,
        {
          id: Date.now().toString(),
          month,
          targetHours,
        },
      ];
    });
  }, []);

  const deleteGlobalGoal = useCallback((id: string) => {
    setGlobalGoals((prev) => prev.filter((goal) => goal.id !== id));
  }, []);

  const getMonthlyGoal = useCallback(
    (subjectId: string, month: string) => {
      return monthlyGoals.find((g) => g.subjectId === subjectId && g.month === month);
    },
    [monthlyGoals]
  );

  const getStudySessionsBySubject = useCallback(
    (subjectId: string, month?: string) => {
      return studySessions.filter((s) => {
        if (s.subjectId !== subjectId) return false;
        if (month) {
          const sessionMonth = s.date.substring(0, 7);
          return sessionMonth === month;
        }
        return true;
      });
    },
    [studySessions]
  );

  const getTotalStudyHours = useCallback(
    (month?: string) => {
      const total = studySessions.reduce((total, session) => {
        if (month) {
          const sessionMonth = session.date.substring(0, 7);
          if (sessionMonth !== month) return total;
        }
        return total + session.duration;
      }, 0) / 60; 
      return Math.round(total * 100) / 100; 
    },
    [studySessions]
  );

  return {
    subjects,
    studySessions,
    monthlyGoals,
    globalGoals,
    addSubject,
    updateSubject,
    deleteSubject,
    addStudySession,
    updateStudySession,
    deleteStudySession,
    setMonthlyGoalForSubject,
    deleteMonthlyGoal,
    setGlobalGoalForMonth,
    deleteGlobalGoal,
    getMonthlyGoal,
    getStudySessionsBySubject,
    getTotalStudyHours,
  };
};

function generateRandomColor(): string {
  const colors = [
    '#1890ff',
    '#52c41a',
    '#faad14',
    '#f5222d',
    '#13c2c2',
    '#722ed1',
    '#eb2f96',
    '#fa8c16',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
