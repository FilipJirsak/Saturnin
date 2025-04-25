import { type LucideIcon } from "lucide-react";

export interface TeamMember {
  value: string;
  label: string;
}

export type ActivityType = 'issue' | 'document' | 'concept' | 'mindmap' | 'message';

export type ActivityStatus = 'open' | 'closed' | 'in-progress';

export interface ActivityIconMapping {
  icon: LucideIcon;
  className: string;
}

export type StatisticsPeriod = 'week' | 'month' | 'quarter' | 'year';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar?: string;
  };
  status?: ActivityStatus;
  priority?: 'low' | 'medium' | 'high';
}

export interface ActivityChartData {
  name: string;
  issues: number;
  documents: number;
  concepts: number;
}

export interface PieChartData {
  name: string;
  value: number;
}

export interface StatCardData {
  title: string;
  icon: string;
  value: number;
  change: string;
  progressLabel: string;
  progressValue: number;
}
