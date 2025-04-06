import { useState } from "react";
import { useOutletContext } from "@remix-run/react";
import { ProjectWithIssues, IssueFull } from "~/types";
import { Card } from "~/components/ui/card";
import {getDaysInMonth, issueToEvent, navigateDate} from "~/utils/calendarUtils";
import {CalendarNavigation} from "~/features/views/calendar/CalendarNavigation";
import {CalendarMonthView} from "~/features/views/calendar/CalendarMonthView";
import {CalendarTimeGridView} from "~/features/views/calendar/CalendarTimeGridView";

type ProjectContext = {
  project: ProjectWithIssues;
  issues: IssueFull[];
};

/*TODO (NL): Dodělat zobrazení detailu issue*/
export default function ProjectCalendarView() {
  const { project, issues } = useOutletContext<ProjectContext>();
  const [viewType, setViewType] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarEvents = issues.map(issueToEvent);
  const days = getDaysInMonth(currentDate, calendarEvents);

  const handleNavigate = (direction: 'prev' | 'next') => {
    setCurrentDate(navigateDate(currentDate, viewType, direction));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleSelectDay = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(part => parseInt(part, 10));
    const selectedDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    setCurrentDate(selectedDate);
  };

  return (
      <Card className="flex flex-col h-full overflow-hidden">
        <div className="flex-none p-6 border-b border-border">
          <CalendarNavigation
              currentDate={currentDate}
              viewType={viewType}
              onNavigate={handleNavigate}
              onToday={handleToday}
              onViewChange={setViewType}
          />
        </div>

        <div className="flex-auto p-6 overflow-auto">
          {viewType === 'month' ? (
              <CalendarMonthView
                  days={days}
                  onSelectDay={handleSelectDay}
              />
          ) : (
              <CalendarTimeGridView
                  viewType={viewType}
                  currentDate={currentDate}
                  days={days}
                  onSelectDay={handleSelectDay}
              />
          )}
        </div>
      </Card>
  );
}
