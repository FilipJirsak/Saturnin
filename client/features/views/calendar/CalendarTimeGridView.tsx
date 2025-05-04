import { Fragment, useEffect, useRef } from "react";
import { CalendarDay, getLocalDateString, getWeekDays } from "~/utils/calendarUtils";
import { cn } from "~/utils/helpers";
import { IssueFull } from "~/types";

interface TimeGridViewProps {
  viewType: "day" | "week";
  currentDate: Date;
  days: CalendarDay[];
  issues: IssueFull[];
  onSelectDay?: (date: string) => void;
  onIssueSelect: (issue: IssueFull) => void;
}

export function CalendarTimeGridView(
  { viewType, currentDate, days, issues, onSelectDay, onIssueSelect }: TimeGridViewProps,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerNavRef = useRef<HTMLDivElement>(null);
  const containerOffsetRef = useRef<HTMLDivElement>(null);
  const timeIndicatorRef = useRef<HTMLDivElement>(null);

  const todayString = getLocalDateString(new Date());
  const currentDateString = getLocalDateString(currentDate);
  const isToday = todayString === currentDateString;

  const daysOfWeek = getWeekDays(currentDate);

  const eventsToShow = viewType === "day"
    ? days.find((day) => day.date === currentDateString)?.events || []
    : days.filter((day) => daysOfWeek.some((d) => d.date === day.date)).flatMap((day) =>
      day.events.map((event) => ({ ...event, day }))
    );

  const calculateTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const currentSlot = (hours * 12) + Math.floor(minutes / 5);
    const totalSlots = 24 * 12;

    return (currentSlot / totalSlots) * 100;
  };

  const updateTimeIndicator = () => {
    if (!timeIndicatorRef.current || !containerRef.current) return;

    const position = calculateTimePosition();
    timeIndicatorRef.current.style.top = `calc(${position}% + 1.75rem - 2px)`;
  };

  const scrollToCurrentTime = () => {
    if (!containerRef.current || !isToday) return;

    const position = calculateTimePosition();
    const containerHeight = containerRef.current.clientHeight;
    const scrollPosition = (position / 100) * containerRef.current.scrollHeight - containerHeight / 2;

    containerRef.current.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateTimeIndicator();
    if (isToday) {
      setTimeout(scrollToCurrentTime, 300);
    }

    const interval = setInterval(() => {
      updateTimeIndicator();
    }, 60000);

    return () => clearInterval(interval);
  }, [currentDate, viewType, isToday]);

  return (
    <div className="relative h-full">
      <div
        ref={containerRef}
        className="isolate flex flex-auto flex-col overflow-auto bg-card rounded-lg border border-border"
      >
        <div
          style={viewType === "week" ? { width: "165%" } : {}}
          className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full"
        >
          <div
            ref={containerNavRef}
            className={cn("sticky top-0 z-30 flex-none bg-card shadow-sm border-b border-border")}
          >
            {viewType === "week"
              ? (
                <>
                  <div className="grid grid-cols-7 text-sm text-muted-foreground sm:hidden">
                    {daysOfWeek.map((d, index) => (
                      <button
                        key={index}
                        type="button"
                        className="flex flex-col items-center pt-2 pb-3"
                        onClick={() => onSelectDay?.(d.date)}
                      >
                        {d.day}
                        <span
                          className={cn(
                            "mt-1 flex h-8 w-8 items-center justify-center font-semibold rounded-full",
                            d.isToday ? "bg-primary text-primary-foreground" : "text-foreground",
                          )}
                        >
                          {d.date.split("-")[2].replace(/^0/, "")}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="-mr-px hidden grid-cols-7 divide-x divide-border border-r border-border text-sm text-muted-foreground sm:grid">
                    <div className="col-end-1 w-14" />
                    {daysOfWeek.map((d, index) => (
                      <div key={index} className="flex items-center justify-center py-3">
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-muted"
                          onClick={() => onSelectDay?.(d.date)}
                        >
                          <span>{d.day}</span>
                          <span
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full font-medium",
                              d.isToday ? "bg-primary text-primary-foreground" : "text-foreground",
                            )}
                          >
                            {d.date.split("-")[2].replace(/^0/, "")}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )
              : (
                <span className="flex justify-center items-center gap-2 px-4 py-5 rounded-full font-medium text-foreground">
                  {currentDate.toLocaleDateString("cs-CZ", { weekday: "long" })}
                </span>
              )}
          </div>

          <div className="flex flex-auto">
            <div className="sticky left-0 z-10 w-14 text-center flex-none bg-card ring-1 ring-border" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-border"
                style={{ gridTemplateRows: "repeat(48, minmax(3.5rem, 1fr))" }}
              >
                <div ref={containerOffsetRef} className="row-end-1 h-7"></div>
                {Array.from({ length: 24 }, (_, i) => (
                  <Fragment key={i}>
                    <div>
                      <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs text-muted-foreground">
                        {i === 0 ? "12:00" : i < 12 ? `${i}:00` : i === 12 ? "12:00" : `${i - 12}:00`}
                        <span className="ml-1">{i < 12 ? "AM" : "PM"}</span>
                      </div>
                    </div>
                    <div />
                  </Fragment>
                ))}
              </div>

              {viewType === "week" && (
                <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-border sm:grid sm:grid-cols-7">
                  <div className="col-start-1 row-span-full" />
                  <div className="col-start-2 row-span-full" />
                  <div className="col-start-3 row-span-full" />
                  <div className="col-start-4 row-span-full" />
                  <div className="col-start-5 row-span-full" />
                  <div className="col-start-6 row-span-full" />
                  <div className="col-start-7 row-span-full" />
                </div>
              )}

              {isToday && (
                <div
                  ref={timeIndicatorRef}
                  className="absolute left-0 right-0 pointer-events-none z-40"
                >
                  <div className="absolute left-0 -mt-1.5 -ml-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                  <div className="h-px bg-primary" />
                </div>
              )}

              <ol
                className={cn(
                  "col-start-1 col-end-2 row-start-1 grid",
                  viewType === "week" ? "grid-cols-1 sm:grid-cols-7" : "grid-cols-1",
                )}
                style={{ gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto" }}
              >
                {viewType === "week"
                  ? (
                    days.filter((day) => daysOfWeek.some((d) => d.date === day.date)).map((day) => (
                      day.events.map((event, eventIdx) => {
                        try {
                          const eventDate = new Date(event.datetime);
                          const hour = eventDate.getHours();
                          const minute = eventDate.getMinutes();
                          const gridRow = 2 + hour * 12 + Math.floor(minute / 5);

                          const duration = 12;

                          const colIndex = daysOfWeek.findIndex((d) => d.date === day.date);

                          if (colIndex < 0 || isNaN(gridRow)) {
                            return null;
                          }

                          return (
                            <li
                              key={`${day.date}-${eventIdx}`}
                              className="relative mt-px flex"
                              style={{
                                gridRow: `${gridRow} / span ${duration}`,
                                gridColumn: `${colIndex + 1}`,
                              }}
                            >
                              <button
                                onClick={() => {
                                  const issue = issues.find((i) => i.code === event.id);
                                  if (issue) onIssueSelect(issue);
                                }}
                                className={`group text-start absolute inset-1 flex flex-col overflow-hidden rounded-lg p-2 text-xs ${event.colorClass} hover:opacity-90`}
                              >
                                <p className="order-1 font-semibold truncate">{event.name}</p>
                                <p className="text-xs opacity-70">
                                  <time dateTime={event.datetime}>{event.time}</time>
                                </p>
                              </button>
                            </li>
                          );
                        } catch (e) {
                          console.error("Chyba při vykreslování události:", e);
                          return null;
                        }
                      })
                    ))
                  )
                  : (
                    eventsToShow.map((event, eventIdx) => {
                      try {
                        const eventDate = new Date(event.datetime);
                        const hour = eventDate.getHours();
                        const minute = eventDate.getMinutes();
                        const gridRow = 2 + hour * 12 + Math.floor(minute / 5);

                        const duration = 12;

                        if (isNaN(gridRow)) {
                          return null;
                        }

                        return (
                          <li
                            key={eventIdx}
                            className="relative mt-px flex"
                            style={{ gridRow: `${gridRow} / span ${duration}` }}
                          >
                            <button
                              onClick={() => {
                                const issue = issues.find((i) => i.code === event.id);
                                if (issue) onIssueSelect(issue);
                              }}
                              className={`group text-start absolute inset-1 flex flex-col overflow-hidden rounded-lg p-2 text-xs ${event.colorClass} hover:opacity-90`}
                            >
                              <p className="order-1 font-semibold truncate">{event.name}</p>
                              <p className="text-xs opacity-70">
                                <time dateTime={event.datetime}>{event.time}</time>
                              </p>
                            </button>
                          </li>
                        );
                      } catch (e) {
                        console.error("Chyba při vykreslování události:", e);
                        return null;
                      }
                    })
                  )}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
