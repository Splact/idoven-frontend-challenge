export type TECGDataSignal = number | undefined;

export type TECGReading = {
  time: number;
  signals: [
    number,
    TECGDataSignal,
    TECGDataSignal,
    TECGDataSignal,
    TECGDataSignal
  ];
};
