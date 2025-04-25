import { Input } from '~/components/ui/input';
import { Badge } from '~/components/ui/badge';
import {Search, Clock, AlertCircle} from 'lucide-react';
import {
  type ActivityType,
  type ActivityStatus, type Activity, type ActivityChartData
} from '~/types/dashboard';
import {
  ACTIVITY_ICONS,
  ACTIVITY_STATUS_LABELS,
  ACTIVITY_STATUS_VARIANTS, CHART_COLORS
} from '~/lib/constants';
import {
  createTooltipStyle,
  getAxisConfig,
  getGridConfig,
  getLatestIssues
} from '~/utils/dashboardUtils';
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {formatDate} from "~/utils/dateUtils";
import {getInitials} from "~/utils/helpers";

export function ActivityIcon({ type, className = '' }: { type: ActivityType; className?: string }) {
  const { icon: Icon, className: defaultClassName } = ACTIVITY_ICONS[type];
  return <Icon className={`h-5 w-5 ${defaultClassName} ${className}`} />;
}

export function ActivityStatusBadge({ status }: { status?: ActivityStatus }) {
  if (!status) return null;

  return (
      <Badge variant="secondary" className={ACTIVITY_STATUS_VARIANTS[status]}>
        {ACTIVITY_STATUS_LABELS[status]}
      </Badge>
  );
}

export function ActivityFilters({
                                  searchQuery,
                                  onSearchChange
                                }: {
  searchQuery: string;
  onSearchChange: (value: string) => void
}) {
  return (
      <div className="relative flex-1 md:flex-none">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
            placeholder="Hledat aktivity..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
  );
}

export function ActivityCard({ activity }: {
  activity: Activity;
}) {
  return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <ActivityIcon type={activity.type}/>
              <CardTitle className="text-base truncate">{activity.title}</CardTitle>
            </div>
            <span className="text-xs text-muted-foreground flex items-center whitespace-nowrap ml-4">
              <Clock className="mr-1 h-3 w-3"/>
              {formatDate(activity.timestamp)}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Avatar className="h-6 w-6 shrink-0 text-xs">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback>{getInitials(activity.user.name)}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate">{activity.user.name}</span>
            </div>
            <ActivityStatusBadge status={activity.status} />
          </div>
        </CardContent>
      </Card>
  );
}

export function ActivityChart({ activityData, activities }: {
  activityData: ActivityChartData[];
  activities: Activity[];
}) {
  const latestIssues = getLatestIssues(activities);

  return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Aktivita v čase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid {...getGridConfig()} />
                  <XAxis
                      dataKey="name"
                      {...getAxisConfig()}
                  />
                  <YAxis
                      {...getAxisConfig()}
                  />
                  <Tooltip
                      contentStyle={createTooltipStyle()}
                  />
                  <Line type="monotone" dataKey="issues" stroke={CHART_COLORS.primary.medium} name="Issues"/>
                  <Line type="monotone" dataKey="documents" stroke={CHART_COLORS.primaryDark.medium} name="Dokumenty"/>
                  <Line type="monotone" dataKey="concepts" stroke={CHART_COLORS.primaryDark.dark} name="Koncepty"/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nejnovější Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {latestIssues.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="mt-1">
                      <AlertCircle className="h-4 w-4 text-primary"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.user.name}</p>
                    </div>
                    <ActivityStatusBadge status={activity.status}/>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
