import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

interface DepartmentData {
  name: string;
  total: number;
}

interface DepartmentBreakdownChartProps {
  data: DepartmentData[];
  isDark: boolean;
  onDepartmentClick?: (deptName: string) => void;
}

const COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#6366f1'];

const DepartmentBreakdownChart = ({ data, isDark, onDepartmentClick }: DepartmentBreakdownChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%" 
          cy="45%" 
          innerRadius={60} 
          outerRadius={80}
          paddingAngle={5} 
          dataKey="total"
          nameKey="name"
          stroke="none"
          animationDuration={1200}
          onClick={(data) => {
            if (onDepartmentClick) onDepartmentClick(data.name);
          }}
          cursor="pointer"
        >
          {data.map((_, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
            />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? '#000' : '#fff',
            borderRadius: '12px',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
            fontSize: '12px',
          }}
          itemStyle={{ color: isDark ? '#fff' : '#000' }}
           formatter={(value: string | number | readonly (string | number)[] | undefined) => {
            if (value === undefined) return ["0", "Tools"];
            return [value, "Tools"];
          }}
        />

        <Legend 
          verticalAlign="bottom" 
          align="center"
          iconType="circle"
          formatter={(value) => (
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DepartmentBreakdownChart;