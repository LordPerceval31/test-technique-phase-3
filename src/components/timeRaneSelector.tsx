import { memo } from "react";

export type TimeRange = '30d' | '90d' | '12m';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  isDark: boolean;
}

const TimeRangeSelector = memo(({ value, onChange, isDark }: TimeRangeSelectorProps) => {
  const options: { label: string; value: TimeRange }[] = [
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: '1 Year', value: '12m' },
  ];

  return (
    <div className={`inline-flex p-1 rounded-xl border transition-colors duration-300 ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
    }`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
            value === opt.value
              ? (isDark ? 'bg-white/10 text-white shadow-lg' : 'bg-white text-blue-600 shadow-sm')
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
});

export default TimeRangeSelector;