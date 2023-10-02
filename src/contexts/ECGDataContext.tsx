import { createContext, useState } from "react";
import { TECGReading } from "../types";

export type TECGDataContextProps = {
  file?: File;
  timeRange: [number, number];
  isLoading: boolean;
  readings: TECGReading[];
  setFile: (file: File) => void;
  setTimeRange: (timeRange: [number, number]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setReadings: (readings: TECGReading[]) => void;
};
export type TECGDataProviderProps = {
  children: React.ReactNode;
};

const DEFAULT_VALUE: TECGDataContextProps = {
  file: undefined,
  timeRange: [0, 0],
  isLoading: false,
  readings: [],
  setFile: () => {},
  setTimeRange: () => {},
  setIsLoading: () => {},
  setReadings: () => {},
};

const ECGDataContext = createContext<TECGDataContextProps>(DEFAULT_VALUE);

export const Provider = ({ children }: TECGDataProviderProps) => {
  const [file, setFile] = useState<File | undefined>(DEFAULT_VALUE.file);
  const [timeRange, setTimeRange] = useState<[number, number]>(
    DEFAULT_VALUE.timeRange
  );
  const [readings, setReadings] = useState<TECGReading[]>(
    DEFAULT_VALUE.readings
  );
  const [isLoading, setIsLoading] = useState<boolean>(DEFAULT_VALUE.isLoading);

  return (
    <ECGDataContext.Provider
      value={{
        file,
        timeRange,
        readings,
        isLoading,
        setFile,
        setTimeRange,
        setReadings,
        setIsLoading,
      }}
    >
      {children}
    </ECGDataContext.Provider>
  );
};

export default ECGDataContext;
