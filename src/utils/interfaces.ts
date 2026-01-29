

export interface User {
  id: number;
  name: string;
  email: string;
  department: string;
}

export interface Department {
    id: number,
    name: string,
    description: string,
    created_at: string,
    updated_at: string,
}

export interface UserTool {
    user_id: number,
    tool_id: number,
    usage_frequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
    last_used: string,
    proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}


export interface Tool {
  id: number;
  name: string;
  description: string;
  vendor: string;
  category: string;
  monthly_cost: number;
  previous_month_cost: number;
  owner_department: string;
  status: "active" | "expiring" | "unused";
  website_url: string;
  active_users_count: number;
  icon_url: string;
  created_at: string;
  updated_at: string;
}