import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { DashboardSectionTitle } from "~/features/dashboard/DashboardSectionTitle";
import {
  BarChartDisplay,
  PieChartDisplay,
  ProgressDisplay,
  StatCard,
  StatCardGrid,
  StatResultCard,
} from "~/features/dashboard/StatisticsCommonComponents";
import { useDashboardStatistics } from "~/hooks/useDashboardData";
import { STATISTICS_PERIOD_LABELS, STATISTICS_TABS } from "~/lib/constants";
import { type StatisticsPeriod } from "~/types/dashboard";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Statistiky | Saturnin" },
    { name: "description", content: "Přehled výkonu a aktivit v systému" },
  ];
};

export default function StatisticsPage() {
  const {
    selectedPeriod,
    setSelectedPeriod,
    activityData,
    issuesData,
    knowledgeData,
    searchData,
    statCards,
  } = useDashboardStatistics();

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value as StatisticsPeriod);
  };

  return (
    <div className="container mx-auto p-6">
      <DashboardSectionTitle
        title="Statistiky"
        description="Přehled výkonu a aktivit v systému"
      >
        <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Vyber období" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STATISTICS_PERIOD_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </DashboardSectionTitle>

      <StatCardGrid>
        {statCards.map((card, index) => <StatCard key={index} data={card} />)}
      </StatCardGrid>

      <Tabs defaultValue={STATISTICS_TABS.OVERVIEW} className="space-y-4">
        <TabsList>
          <TabsTrigger value={STATISTICS_TABS.OVERVIEW}>Přehled</TabsTrigger>
          <TabsTrigger value={STATISTICS_TABS.ISSUES}>Issues</TabsTrigger>
          <TabsTrigger value={STATISTICS_TABS.KNOWLEDGE}>Znalosti</TabsTrigger>
          <TabsTrigger value={STATISTICS_TABS.SEARCH}>Vyhledávání</TabsTrigger>
        </TabsList>

        <TabsContent value={STATISTICS_TABS.OVERVIEW} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChartDisplay title="Aktivita v čase" data={activityData} />

            <StatResultCard title="Rozložení aktivit">
              <PieChartDisplay data={issuesData} />
            </StatResultCard>
          </div>
        </TabsContent>

        <TabsContent value={STATISTICS_TABS.ISSUES} className="space-y-4">
          <StatResultCard title="Statistiky Issues">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Stav Issues</h3>
                  <div className="space-y-2">
                    {issuesData.map((item, index) => (
                      <ProgressDisplay
                        key={index}
                        label={item.name}
                        value={item.value}
                        className="mb-2"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <PieChartDisplay data={issuesData} />
            </div>
          </StatResultCard>
        </TabsContent>

        <TabsContent value={STATISTICS_TABS.KNOWLEDGE} className="space-y-4">
          <StatResultCard title="Statistiky znalostní báze">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Typy obsahu</h3>
                  <div className="space-y-2">
                    {knowledgeData.map((item, index) => (
                      <ProgressDisplay
                        key={index}
                        label={item.name}
                        value={item.value}
                        className="mb-2"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <PieChartDisplay data={knowledgeData} />
            </div>
          </StatResultCard>
        </TabsContent>

        <TabsContent value={STATISTICS_TABS.SEARCH} className="space-y-4">
          <StatResultCard title="Statistiky vyhledávání">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Úspěšnost vyhledávání</h3>
                  <div className="space-y-2">
                    {searchData.map((item, index) => (
                      <ProgressDisplay
                        key={index}
                        label={item.name}
                        value={item.value}
                        className="mb-2"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <PieChartDisplay data={searchData} />
            </div>
          </StatResultCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
