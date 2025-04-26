import {ElementType, type ReactNode} from 'react';
import { Progress } from '~/components/ui/progress';
import { Card, CardHeader, CardContent, CardTitle } from '~/components/ui/card';
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, CartesianGrid, XAxis, YAxis, Bar} from 'recharts';
import {
  createTooltipStyle,
  getAxisConfig,
  getGridConfig
} from '~/utils/dashboardUtils';
import { CHART_COLORS } from '~/lib/constants';
import {ActivityChartData, PieChartData} from "~/types/dashboard";
import { type StatCardData } from '~/types/dashboard';
import {
  Activity,
  AlertCircle,
  Book,
  Calendar,
  Map,
  Search,
  Users
} from 'lucide-react';

// TODO (NL): Přidat podporu pro více typů grafů
export function ProgressDisplay({
                                  label,
                                  value,
                                  className = ''
                                }: {
  label: string;
  value: number;
  className?: string
}) {
  return (
      <div className={className}>
        <div className="flex justify-between text-xs mb-1">
          <span className="truncate">{label}</span>
          <span className="ml-2">{value}%</span>
        </div>
        <Progress value={value} className="h-1" />
      </div>
  );
}

export function PieChartDisplay({
                                  data,
                                  height = 300
                                }: {
  data: PieChartData[];
  height?: number
}) {
  const colors = [
    CHART_COLORS.primary.medium,
    CHART_COLORS.primaryDark.medium,
    CHART_COLORS.accent
  ];

  return (
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill={CHART_COLORS.primary.medium}
                dataKey="value"
                label={({ name, percent }) => (
                    <text
                        x={0}
                        y={0}
                        fill="hsl(var(--foreground))"
                        fontSize={12}
                        textAnchor="middle"
                    >
                      {`${name} ${(percent * 100).toFixed(0)}%`}
                    </text>
                )}
            >
              {data.map((_, index) => (
                  <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                  />
              ))}
            </Pie>
            <Tooltip contentStyle={createTooltipStyle()} />
          </PieChart>
        </ResponsiveContainer>
      </div>
  );
}

export function BarChartDisplay({
                                  title,
                                  data
                                }: {
  title: string;
  data: ActivityChartData[]
}) {
  return (
      <StatResultCard title={title}>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
              <Bar dataKey="issues" fill={CHART_COLORS.primary.medium} name="Issues"/>
              <Bar dataKey="documents" fill={CHART_COLORS.primaryDark.medium} name="Dokumenty"/>
              <Bar dataKey="concepts" fill={CHART_COLORS.accent} name="Koncepty"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </StatResultCard>
  );
}

export function StatCardGrid({children}: { children: ReactNode }) {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {children}
      </div>
  );
}
export function StatProgressCard({
                                   title,
                                   icon: Icon,
                                   metricIcon: MetricIcon,
                                   value,
                                   change,
                                   progressLabel,
                                   progressValue
                                 }: {
  title: string;
  icon: ElementType;
  metricIcon: ElementType;
  value: number | string;
  change: string;
  progressLabel: string;
  progressValue: number;
}) {
  return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center min-w-0 flex-1">
            <Icon className="mr-2 h-4 w-4 text-primary shrink-0" />
            <span className="truncate">{title}</span>
          </CardTitle>
          <MetricIcon className="h-4 w-4 text-primary ml-2 shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground truncate">
            {change}
          </p>
          <div className="mt-2">
            <ProgressDisplay label={progressLabel} value={progressValue} />
          </div>
        </CardContent>
      </Card>
  );
}

export function StatResultCard({
                                 title,
                                 children
                               }: {
  title: string;
  children: ReactNode;
}) {
  return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
  );
}

const ICON_MAP: Record<string, ElementType> = {
  'AlertCircle': AlertCircle,
  'Book': Book,
  'Map': Map,
  'Search': Search,
  'Activity': Activity,
  'Calendar': Calendar,
  'BarChart': BarChart,
  'Users': Users
};

const METRIC_ICON_MAP: Record<string, ElementType> = {
  'AlertCircle': Activity,
  'Book': BarChart,
  'Map': Users,
  'Search': Calendar
};

export function StatCard({ data }: {
  data: StatCardData;
}) {
  const Icon = ICON_MAP[data.icon] || AlertCircle;
  const MetricIcon = METRIC_ICON_MAP[data.icon] || Activity;

  return (
      <StatProgressCard
          title={data.title}
          icon={Icon}
          metricIcon={MetricIcon}
          value={data.value}
          change={data.change}
          progressLabel={data.progressLabel}
          progressValue={data.progressValue}
      />
  );
}
