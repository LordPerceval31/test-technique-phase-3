import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

interface CostEvolutionChartProps {
  data: { name: string; total: number }[];
  isDark: boolean;
}

const CostEvolutionChart = ({ data, isDark }: CostEvolutionChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
        <defs>
          <linearGradient id="costGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.6}/>
            <stop offset="100%" stopColor="#86efac" stopOpacity={0.1}/>
          </linearGradient>
        </defs>

        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false} 
          stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 
        />
        
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: isDark ? '#9ca3af' : '#4b5563', fontSize: 11 }}
          dy={15}
          interval={0} 
          padding={{ left: 60, right: 60 }}
        />
        
        <YAxis 
          hide={true} 
          domain={[0, 'dataMax + 10000']}
        />
        
        <Tooltip 
          contentStyle={{ 
            backgroundColor: isDark ? '#000' : '#fff', 
            borderRadius: '12px', 
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
            fontSize: '12px',
          }}
          itemStyle={{ color: isDark ? '#fff' : '#000', fontWeight: 'bold' }}
          formatter={(value: string | number | readonly (string | number)[] | undefined) => {
            if (value === undefined) return ["€0", "Total Spend"];
            const numericValue = typeof value === 'number' ? value : Number(value) || 0;
            return [`€${numericValue.toLocaleString()}`, "Total Spend"];
          }}
        />
        
        <Area 
          type="monotone" 
          dataKey="total" 
          stroke="#10b981" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#costGradient)" 
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CostEvolutionChart;