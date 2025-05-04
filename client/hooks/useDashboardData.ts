import { useMemo, useState } from "react";
import {
  mockActivities,
  mockActivityChartData,
  mockIssuesData,
  mockKnowledgeData,
  mockSearchData,
  mockStatCards,
} from "~/lib/data";
import { filterActivitiesBySearch, filterActivitiesByTab, sortActivitiesByDate } from "~/utils/dashboardUtils";
import { STATISTICS_PERIODS } from "~/lib/constants";
import { Activity, ActivityChartData, PieChartData, StatisticsPeriod } from "~/types/dashboard";

interface UseDashboardActivitiesProps {
  initialSearchQuery?: string;
  initialTab?: string;
}

interface UseDashboardActivitiesResult {
  activities: Activity[];
  filteredActivities: Activity[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export function useDashboardActivities({
  initialSearchQuery = "",
  initialTab = "recent",
}: UseDashboardActivitiesProps = {}): UseDashboardActivitiesResult {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedTab, setSelectedTab] = useState(initialTab);

  const activities = useMemo(() => sortActivitiesByDate(mockActivities), []);

  const filteredActivities = useMemo(() => {
    const searchFiltered = filterActivitiesBySearch(activities, searchQuery);
    return filterActivitiesByTab(searchFiltered, selectedTab);
  }, [activities, searchQuery, selectedTab]);

  return {
    activities,
    filteredActivities,
    searchQuery,
    setSearchQuery,
    selectedTab,
    setSelectedTab,
  };
}

interface UseDashboardStatisticsProps {
  initialPeriod?: StatisticsPeriod;
}

interface UseDashboardStatisticsResult {
  selectedPeriod: StatisticsPeriod;
  setSelectedPeriod: (period: StatisticsPeriod) => void;
  activityData: ActivityChartData[];
  issuesData: PieChartData[];
  knowledgeData: PieChartData[];
  searchData: PieChartData[];
  statCards: typeof mockStatCards;
}

export function useDashboardStatistics({
  initialPeriod = STATISTICS_PERIODS.WEEK,
}: UseDashboardStatisticsProps = {}): UseDashboardStatisticsResult {
  const [selectedPeriod, setSelectedPeriod] = useState<StatisticsPeriod>(initialPeriod);

  const activityData = mockActivityChartData[selectedPeriod];
  const issuesData = mockIssuesData[selectedPeriod];
  const knowledgeData = mockKnowledgeData[selectedPeriod];
  const searchData = mockSearchData[selectedPeriod];
  const statCards = mockStatCards;

  return {
    selectedPeriod,
    setSelectedPeriod,
    activityData,
    issuesData,
    knowledgeData,
    searchData,
    statCards,
  };
}
