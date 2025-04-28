import { ClockIcon } from "@heroicons/react/20/solid";
import {CalendarDay} from "~/utils/calendarUtils";
import {cn} from "~/utils/helpers";
import {Fragment} from "react";
import { IssueFull } from "~/types";

interface MonthViewProps {
  days: CalendarDay[];
  issues: IssueFull[];
  onSelectDay: (date: string) => void;
  onIssueSelect: (issue: IssueFull) => void;
}

export function CalendarMonthView({ days, issues, onSelectDay, onIssueSelect }: MonthViewProps) {
  //TODO (NL): Přehodit do hooku/utils
  const selectedDay = days.find(day => day.isSelected);
  const totalRows = Math.ceil(days.length / 7);
  const rows = Array.from({ length: totalRows }, (_, i) =>
      days.slice(i * 7, (i + 1) * 7)
  );
  const lastRowHasCurrentMonth = rows[rows.length - 1].some(day => day.isCurrentMonth);

  return (
      <>
      <div
          className="ring-1 shadow-sm ring-border rounded-lg overflow-hidden lg:flex lg:flex-auto lg:flex-col">
        <div
            className="grid grid-cols-7 gap-px border-b border-border bg-muted text-center text-xs font-semibold text-muted-foreground lg:flex-none">
          <div className="bg-card py-2">
            Po<span className="sr-only sm:not-sr-only">n</span>
          </div>
          <div className="bg-card py-2">
            Út<span className="sr-only sm:not-sr-only"></span>
          </div>
          <div className="bg-card py-2">
            St<span className="sr-only sm:not-sr-only"></span>
          </div>
          <div className="bg-card py-2">
            Čt<span className="sr-only sm:not-sr-only"></span>
          </div>
          <div className="bg-card py-2">
            Pá<span className="sr-only sm:not-sr-only"></span>
          </div>
          <div className="bg-card py-2">
            So<span className="sr-only sm:not-sr-only"></span>
          </div>
          <div className="bg-card py-2">
            Ne<span className="sr-only sm:not-sr-only"></span>
          </div>
        </div>
        <div
            className="flex bg-muted text-xs text-muted-foreground lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:gap-px">
            {rows.map((rowDays, rowIndex) => (
                <Fragment key={rowIndex}>
                  {rowDays.map((day) => (
                      <div
                          key={day.date}
                          className={cn(
                              day.isCurrentMonth ? 'bg-card' : 'bg-muted/50 text-muted-foreground',
                              'relative px-3 py-2 min-h-36',
                              rowIndex === rows.length - 1 && !lastRowHasCurrentMonth && 'bg-card'
                          )}
                      >
                        <button
                            onClick={() => onSelectDay(day.date)}
                            className="absolute top-1 right-1 group p-1 hover:bg-muted rounded-full"
                        >
                          <time
                              dateTime={day.date}
                              className={cn(
                                  "flex h-6 w-6 items-center justify-center rounded-full text-sm",
                                  day.isToday && !day.isSelected && "bg-primary text-primary-foreground",
                                  day.isSelected && "bg-primary text-primary-foreground font-semibold",
                                  !day.isToday && !day.isSelected && "text-foreground group-hover:bg-muted"
                              )}
                          >
                            {day.date.split('-').pop()?.replace(/^0/, '')}
                          </time>
                        </button>

                        {day.events.length > 0 && (
                            <ol className="mt-8">
                              {day.events.slice(0, 2).map((event) => (
                                  <li key={event.id}>
                                    <button
                                        onClick={() => {
                                          const issue = issues.find(i => i.code === event.id);
                                          if (issue) onIssueSelect(issue);
                                        }}
                                        className="group text-start flex w-full"
                                    >
                                      <p className="flex-auto truncate font-medium text-foreground group-hover:text-primary">
                                        {event.name}
                                      </p>
                                      <time
                                          dateTime={event.datetime}
                                          className="ml-3 hidden flex-none text-muted-foreground group-hover:text-primary xl:block"
                                      >
                                        {event.time}
                                      </time>
                                    </button>
                                  </li>
                              ))}
                              {day.events.length > 2 &&
                                  <li className="text-muted-foreground text-xs mt-1">+ {day.events.length - 2} více</li>
                              }
                            </ol>
                        )}
                      </div>
                  ))}
                </Fragment>
            ))}
          </div>
          <div className="isolate grid w-full grid-cols-7 auto-rows-min gap-px lg:hidden">
            {rows.map((rowDays, rowIndex) => (
                <Fragment key={rowIndex}>
                  {rowDays.map((day) => (
                      <button
                          key={day.date}
                          type="button"
                          className={cn(
                              day.isCurrentMonth ? 'bg-card' : 'bg-muted/50',
                              (day.isSelected || day.isToday) && 'font-semibold',
                              day.isSelected && 'text-primary-foreground',
                              !day.isSelected && day.isToday && 'text-primary',
                              !day.isSelected && day.isCurrentMonth && !day.isToday && 'text-foreground',
                              !day.isSelected && !day.isCurrentMonth && !day.isToday && 'text-muted-foreground',
                              'flex h-14 flex-col px-3 py-2 hover:bg-muted focus:z-10',
                              rowIndex === rows.length - 1 && !lastRowHasCurrentMonth && 'bg-card'
                          )}
                          onClick={() => onSelectDay(day.date)}
                      >
                        <time
                            dateTime={day.date}
                            className={cn(
                                "flex h-6 w-6 items-center justify-center rounded-full ml-auto",
                                day.isSelected && "bg-primary text-primary-foreground",
                                day.isToday && !day.isSelected && "bg-primary text-primary-foreground"
                            )}
                        >
                          {day.date.split('-').pop()?.replace(/^0/, '')}
                        </time>
                        <span className="sr-only">{day.events.length} událostí</span>
                        {day.events.length > 0 && (
                            <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                        {day.events.map((event) => (
                            <span key={event.id}
                                  className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                        ))}
                      </span>
                        )}
                      </button>
                  ))}
                </Fragment>
            ))}
          </div>
        </div>
      </div>

        {
          selectedDay?.events && selectedDay.events.length > 0 ? (
              <div className="px-4 py-6 sm:px-6 lg:hidden">
                <h3 className="text-base font-semibold text-foreground mb-3">
                  Události {new Date(selectedDay.date).toLocaleDateString('cs-CZ', {day: 'numeric', month: 'long'})}
                </h3>
                <ol className="divide-y divide-border overflow-hidden rounded-lg bg-card text-sm shadow-sm">
                  {selectedDay.events.map((event) => (
                      <li key={event.id}
                          className="group flex p-4 pr-6 focus-within:bg-muted hover:bg-muted">
                        <div className="flex-auto">
                          <p className="font-semibold text-foreground">{event.name}</p>
                          <time dateTime={event.datetime}
                                className="mt-2 flex items-center text-muted-foreground">
                            <ClockIcon className="mr-2 h-5 w-5 text-muted-foreground"
                                       aria-hidden="true"/>
                            {event.time}
                          </time>
                        </div>
                        <a
                            href={event.href}
                            className="ml-6 flex-none self-center rounded-md bg-card px-3 py-2 font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border group-hover:bg-muted"
                        >
                          Detail<span className="sr-only">, {event.name}</span>
                        </a>
                      </li>
                  ))}
                </ol>
              </div>
          ) : (
              <div className="px-4 py-6 sm:px-6 lg:hidden">
                {selectedDay && (
                    <div className="text-center p-4 text-muted-foreground">
                      <p>Žádné události {new Date(selectedDay.date).toLocaleDateString('cs-CZ', {
                        day: 'numeric',
                        month: 'long'
                      })}</p>
                    </div>
                )}
              </div>
          )}
      </>
  );
}
