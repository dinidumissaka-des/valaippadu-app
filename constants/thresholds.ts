export type ParamKey = 'salinity' | 'temperature' | 'rainfall' | 'wave_height' | 'turbidity';

export const THRESHOLDS = {
  salinity:    { green: [28, 34], amberLow: [20, 27], amberHigh: [35, 38], redLow: [0, 19], redHigh: [39, 50], unit: 'ppt', weight: 0.30, min: 0,  max: 50 },
  temperature: { green: [25, 30], amberLow: [22, 24], amberHigh: [31, 33], redLow: [0, 21], redHigh: [34, 40], unit: '°C',  weight: 0.25, min: 15, max: 40 },
  rainfall:    { green: [0, 10],  amber: [10, 30],    red: [30, 500],                                           unit: 'mm',  weight: 0.20, min: 0,  max: 100 },
  wave_height: { green: [0, 0.5], amber: [0.5, 1.0],  red: [1.0, 10],                                           unit: 'm',   weight: 0.15, min: 0,  max: 5 },
  turbidity:   { green: [0, 10],  amber: [10, 25],    red: [25, 100],                                           unit: 'NTU', weight: 0.10, min: 0,  max: 100 },
} as const;
