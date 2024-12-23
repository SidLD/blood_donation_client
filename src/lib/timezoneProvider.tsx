import { createContext, useContext, useState, ReactNode } from 'react';

const TimeZoneContext = createContext<{ timeZone: string; setTimeZone: (tz: string) => void } | null>(null);

export const TimeZoneProvider = ({ children }: { children: ReactNode }) => {
  const [timeZone, setTimeZone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);

  return (
    <TimeZoneContext.Provider value={{ timeZone, setTimeZone }}>
      {children}
    </TimeZoneContext.Provider>
  );
};

export const useTimeZone = () => {
  const context = useContext(TimeZoneContext);
  if (!context) {
    throw new Error('useTimeZone must be used within a TimeZoneProvider');
  }
  return context;
};
