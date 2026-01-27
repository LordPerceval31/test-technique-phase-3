
interface DashboardProps {
  isDark: boolean;
}

const Dashboard = ({ isDark }: DashboardProps) => {
  return (
    <main className="p-12">
      
      <div className="flex flex-col text-center lg:text-left space-y-2">
        
        <h1 
          className={`text-3xl md:text-4xl font-bold tracking-tight transition-colors ${
            isDark ? 'text-white' : 'text-black'
          }`}
        >
          Internal Tools Dashboard
        </h1>
        
        <h2 
          className={`text-base md:text-lg font-normal transition-colors ${
            isDark ? 'text-gray-500' : 'text-gray-500'
          }`}
        >
          Monitor and manage your organization's software tools and expenses
        </h2>

      </div>

    </main>
  );
};

export default Dashboard;