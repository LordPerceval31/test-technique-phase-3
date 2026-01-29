import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  Cell
} from 'recharts';

interface TopToolsData {
  name: string;
  total: number;
}

interface TopToolsChartProps {
  data: TopToolsData[];
  isDark: boolean;
}

const TopToolsChart = ({ data, isDark }: TopToolsChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data} 
        layout="vertical" 
        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          horizontal={true} 
          vertical={false} 
          stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 
        />
        
        <XAxis type="number" hide />
        
        <YAxis 
          dataKey="name" 
          type="category" 
          axisLine={false} 
          tickLine={false} 
          width={100}
          tick={{ fill: isDark ? '#9ca3af' : '#4b5563', fontSize: 11 }}
        />
        
        <Tooltip
          cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
          contentStyle={{
            backgroundColor: isDark ? '#000' : '#fff',
            borderRadius: '12px',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
            fontSize: '12px',
          }}
          itemStyle={{ color: isDark ? '#fff' : '#000' }}
          formatter={(value: string | number | readonly (string | number)[] | undefined) => {
            if (value === undefined) return ["€0", "Monthly Cost"];
            const numericValue = typeof value === 'number' ? value : Number(value) || 0;
            return [`€${numericValue.toLocaleString()}`, "Monthly Cost"];
          }}
        />
        
        <Bar 
          dataKey="total" 
          radius={[0, 4, 4, 0]} 
          barSize={20}
        >
          {data.map((_, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={index === 0 ? '#3b82f6' : '#6366f1'} 
              fillOpacity={1 - (index * 0.08)} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopToolsChart;