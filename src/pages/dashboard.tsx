import KPICard from "../components/KPICard";
import { Building2, Users, Wrench, TrendingUp } from "lucide-react";
import RecentTools from "../components/recentTools";


interface DashboardProps {
  isDark: boolean;
}

const Dashboard = ({ isDark }: DashboardProps) => {
  return (
    <main className="p-6 md:p-12 flex flex-col min-h-[calc(100vh-6rem)]">
      
      {/* HEADER */}
      <div className="flex flex-col text-center lg:text-left space-y-2">
        <h1 
          className={`text-3xl md:text-4xl font-bold tracking-tight transition-colors ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Internal Tools Dashboard
        </h1>
        
        <h2 
          className={`text-base md:text-lg font-normal transition-colors ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          Monitor and manage your organization's software tools and expenses
        </h2>
      </div>

      {/* SECTION KPIs (Rouge) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
       <div className="aspect-video">
    <KPICard 
      title="Monthly Budget"
      value="€28,750"
      subValue="/30k"
      trend="+12%"
      icon={TrendingUp}
      color="green"
      progress={96}
    />
  </div>

  <div className="aspect-video">
    <KPICard 
      title="Active Tools"
      value="147"
      trend="+8"
      icon={Wrench}
      color="blue"
    />
  </div>
  <div className="aspect-video">
    <KPICard
          title="Departments"
          value="8"
          trend="+2"
          icon={Building2}
          color="orange"
        />
  </div>
<div className="aspect-video">
    <KPICard 
          title="Cost/User"
          value="€156"
          trend="-€12"
          icon={Users}
          color="pink"
        />
  </div>
      </section>

      <section className="mt-8 mb-8 flex-1 w-full min-h-250 lg:min-h-0 flex flex-col">
          <RecentTools />
      </section>

    </main>
  );
};

export default Dashboard;