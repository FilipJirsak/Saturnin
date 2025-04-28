import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import {ActivityFilters, ActivityCard, ActivityChart} from '~/features/dashboard/ActivitiesCommonComponents';
import { useDashboardActivities } from '~/hooks/useDashboardData';
import { mockActivityChartData } from '~/lib/data';
import { STATISTICS_PERIODS } from '~/lib/constants';
import {DashboardSectionTitle} from "~/features/dashboard/DashboardSectionTitle";

export default function ActivitiesPage() {
  const {
    activities,
    filteredActivities,
    searchQuery,
    setSearchQuery,
    setSelectedTab
  } = useDashboardActivities();

  const activityData = mockActivityChartData[STATISTICS_PERIODS.WEEK];

  return (
      <div className="container mx-auto p-6">
        <DashboardSectionTitle
            title="Aktivity"
            description="Přehled všech aktivit v systému"
        >
          <ActivityFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
          />
        </DashboardSectionTitle>

        <ActivityChart
            activityData={activityData}
            activities={activities}
        />

        <Tabs
            defaultValue="recent"
            className="space-y-4"
            onValueChange={setSelectedTab}
        >
          <TabsList>
            <TabsTrigger value="recent">Nedávné</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="knowledge">Znalosti</TabsTrigger>
            <TabsTrigger value="messages">Zprávy</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            {filteredActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
            ))}
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            {filteredActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
            ))}
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-4">
            {filteredActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
            ))}
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            {filteredActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
  );
}
