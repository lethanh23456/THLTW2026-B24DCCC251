import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DiplomaBook {
  id: string;
  year: number;
  isCurrent: boolean;
  currentEntryNumber: number;
}

export interface GraduationDecision {
  id: string;
  decisionNumber: string;
  date: string;
  abstract: string;
  bookId: string;
  lookupCount: number;
}

export interface FormConfig {
  id: string;
  name: string;
  type: 'String' | 'Number' | 'Date';
}

export interface Diploma {
  id: string;
  entryNumber: number;
  diplomaNumber: string;
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  decisionId: string;
  dynamicFields: Record<string, any>;
}

interface DiplomaContextType {
  books: DiplomaBook[];
  addBook: (book: Omit<DiplomaBook, 'id' | 'currentEntryNumber'>) => void;
  updateBook: (id: string, updates: Partial<DiplomaBook>) => void;

  decisions: GraduationDecision[];
  addDecision: (decision: Omit<GraduationDecision, 'id' | 'lookupCount'>) => void;
  updateDecision: (id: string, updates: Partial<GraduationDecision>) => void;
  incrementLookupCount: (decisionId: string) => void;

  formConfigs: FormConfig[];
  addFormConfig: (config: Omit<FormConfig, 'id'>) => void;
  updateFormConfig: (id: string, updates: Partial<FormConfig>) => void;
  deleteFormConfig: (id: string) => void;

  diplomas: Diploma[];
  addDiploma: (diploma: Omit<Diploma, 'id' | 'entryNumber'>) => void;
}

const DiplomaContext = createContext<DiplomaContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

export const DiplomaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<DiplomaBook[]>([]);
  const [decisions, setDecisions] = useState<GraduationDecision[]>([]);
  const [formConfigs, setFormConfigs] = useState<FormConfig[]>([
    { id: '1', name: 'Điểm trung bình', type: 'Number' },
    { id: '2', name: 'Xếp hạng', type: 'String' },
    { id: '3', name: 'Hệ đào tạo', type: 'String' },
    { id: '4', name: 'Nơi sinh', type: 'String' },
    { id: '5', name: 'Dân tộc', type: 'String' },
  ]);
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);

  const addBook = (book: Omit<DiplomaBook, 'id' | 'currentEntryNumber'>) => {
    if (book.isCurrent) {
      setBooks(prev => prev.map(b => ({ ...b, isCurrent: false })));
    }
    setBooks(prev => [...prev, { ...book, id: generateId(), currentEntryNumber: 1 }]);
  };

  const updateBook = (id: string, updates: Partial<DiplomaBook>) => {
    setBooks(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
  };

  const addDecision = (decision: Omit<GraduationDecision, 'id' | 'lookupCount'>) => {
    setDecisions(prev => [...prev, { ...decision, id: generateId(), lookupCount: 0 }]);
  };

  const updateDecision = (id: string, updates: Partial<GraduationDecision>) => {
    setDecisions(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)));
  };

  const incrementLookupCount = (decisionId: string) => {
    setDecisions(prev => prev.map(d =>
      d.id === decisionId ? { ...d, lookupCount: d.lookupCount + 1 } : d
    ));
  };

  const addFormConfig = (config: Omit<FormConfig, 'id'>) => {
    setFormConfigs(prev => [...prev, { ...config, id: generateId() }]);
  };

  const updateFormConfig = (id: string, updates: Partial<FormConfig>) => {
    setFormConfigs(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteFormConfig = (id: string) => {
    setFormConfigs(prev => prev.filter(c => c.id !== id));
  };

  const addDiploma = (diploma: Omit<Diploma, 'id' | 'entryNumber'>) => {
    const decision = decisions.find(d => d.id === diploma.decisionId);
    if (!decision) return;

    const book = books.find(b => b.id === decision.bookId);
    if (!book) return;

    const entryNumberToUse = book.currentEntryNumber;

    setDiplomas(prev => [...prev, { ...diploma, id: generateId(), entryNumber: entryNumberToUse }]);

    updateBook(book.id, { currentEntryNumber: entryNumberToUse + 1 });
  };

  return (
    <DiplomaContext.Provider value={{
      books, addBook, updateBook,
      decisions, addDecision, updateDecision, incrementLookupCount,
      formConfigs, addFormConfig, updateFormConfig, deleteFormConfig,
      diplomas, addDiploma
    }}>
      {children}
    </DiplomaContext.Provider>
  );
};

export const useDiplomaStore = () => {
  const context = useContext(DiplomaContext);
  if (context === undefined) {
    throw new Error('useDiplomaStore must be used within a DiplomaProvider');
  }
  return context;
};
