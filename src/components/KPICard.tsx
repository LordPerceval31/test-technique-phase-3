import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  subValue?: string;
  trend: string;
  icon: LucideIcon;
  color: "blue" | "green" | "orange" | "pink";
}

export default function KPICard({ 
  title, 
  value, 
  subValue,
  trend, 
  icon: Icon, 
  color 
}: KPICardProps) {
  
  const gradients = {
    green: "bg-gradient-to-br from-green-400 to-emerald-600 shadow-emerald-500/20",
    blue: "bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/20",
    orange: "bg-gradient-to-br from-orange-400 to-red-500 shadow-orange-500/20",
    pink: "bg-gradient-to-br from-pink-500 to-rose-600 shadow-pink-500/20",
  };

  return (
    <div className="@container relative h-full w-full p-10 justify-between sm:p-6 sm:gap-0 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      <div className={`absolute rounded-lg text-white shadow-lg ${gradients[color]} top-10 right-10 p-3 sm:top-6 sm:right-6 sm:p-2.5
      `}>
        <Icon size={20} />
      </div>
      <div className="flex justify-between items-start">
        <p className="font-medium text-gray-500 dark:text-gray-400 leading-tight text-[clamp(14px,6cqw,18px)] pr-14">
          {title}
        </p>
      </div>
      <div className="flex flex-col"> 
        <div className="flex items-baseline gap-1 flex-wrap">
          <h3 className="font-bold text-gray-900 dark:text-white leading-none tracking-tight text-[clamp(1rem,10cqw,2.5rem)]">
            {value}
          </h3>
          
          {subValue && (
            <span className="font-medium text-gray-400 dark:text-gray-500 leading-none text-[clamp(1rem,10cqw,2.5rem)]">
              {subValue}
            </span>
          )}
        </div>
        
        <div className="mt-3 flex items-center gap-4">
          <span className={`font-bold px-2 py-0.5 rounded-full whitespace-nowrap text-[clamp(10px,4cqw,12px)] text-white ${gradients[color]}`}>
            {trend}
          </span>
        </div>
      </div>

    </div>
  );
}