import { ClockIcon } from "@heroicons/react/20/solid";
import {CalendarDay} from "~/utils/calendarUtils";
import {cn} from "~/utils/helpers";
import {Fragment} from "react";

interface MonthViewProps {
  days: CalendarDay[];
  onSelectDay: (date: string) => void;
}

export function CalendarMonthView({ days, onSelectDay }: MonthViewProps) {
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
          className="ring-1 shadow-sm ring-surface-200 dark:ring-surface-700 rounded-lg overflow-hidden lg:flex lg:flex-auto lg:flex-col">
        <div
            className="grid grid-cols-7 gap-px border-b border-surface-300 bg-surface-200 text-center text-xs font-semibold text-surface-700 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-300 lg:flex-none">
          <div className="bg-white py-2 dark:bg-surface-900">
            Po<span className="sr-only sm:not-sr-only">n</span>
          </div>
          <div className="bg-white py-2 dark:bg-surface-900">
            Út<span className="sr-only sm:not-sr-only"></span>
          </div>
          <div className="bg-white py-2 dark:bg-surface-900">
            St<span className="sr-only sm:not-sr-only"></span>
          </div>
          <div className="bg-white py-2 dark:bg-surface-900">
            Čt<span className="sr-only sm:not-sr-only"></span>
          </div>
          <div className="bg-white py-2 dark:bg-surface-900">
            Pá<span className="sr-only sm:not-sr-only"></span>
          </div>
          <div className="bg-white py-2 dark:bg-surface-900">
            So<span className="sr-only sm:not-sr-only"></span>
          </div>
          <div className="bg-white py-2 dark:bg-surface-900">
            Ne<span className="sr-only sm:not-sr-only"></span>
          </div>
        </div>
        <div
            className="flex bg-surface-200 text-xs text-surface-700 dark:bg-surface-800 dark:text-surface-300 lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:gap-px">
            {rows.map((rowDays, rowIndex) => (
                <Fragment key={rowIndex}>
                  {rowDays.map((day) => (
                      <div
                          key={day.date}
                          className={cn(
                              day.isCurrentMonth ? 'bg-white dark:bg-surface-900' : 'bg-surface-50 text-surface-500 dark:bg-surface-800 dark:text-surface-400',
                              'relative px-3 py-2 min-h-36',
                              rowIndex === rows.length - 1 && !lastRowHasCurrentMonth && 'bg-white dark:bg-surface-900'
                          )}
                      >
                        <button
                            onClick={() => onSelectDay(day.date)}
                            className="absolute top-1 right-1 group p-1 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full"
                        >
                          <time
                              dateTime={day.date}
                              className={cn(
                                  "flex h-6 w-6 items-center justify-center rounded-full text-sm",
                                  day.isToday && !day.isSelected && "bg-primary text-primary-foreground",
                                  day.isSelected && "bg-primary text-primary-foreground font-semibold",
                                  !day.isToday && !day.isSelected && "text-surface-900 dark:text-surface-100 group-hover:bg-surface-200 dark:group-hover:bg-surface-700"
                              )}
                          >
                            {day.date.split('-').pop()?.replace(/^0/, '')}
                          </time>
                        </button>

                        {day.events.length > 0 && (
                            <ol className="mt-8">
                              {day.events.slice(0, 2).map((event) => (
                                  <li key={event.id}>
                                    <a href={event.href} className="group flex">
                                      <p className="flex-auto truncate font-medium text-surface-900 group-hover:text-primary dark:text-surface-100">
                                        {event.name}
                                      </p>
                                      <time
                                          dateTime={event.datetime}
                                          className="ml-3 hidden flex-none text-surface-500 group-hover:text-primary dark:text-surface-400 xl:block"
                                      >
                                        {event.time}
                                      </time>
                                    </a>
                                  </li>
                              ))}
                              {day.events.length > 2 &&
                                  <li className="text-surface-500 dark:text-surface-400 text-xs mt-1">+ {day.events.length - 2} více</li>
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
                              day.isCurrentMonth ? 'bg-white dark:bg-surface-900' : 'bg-surface-50 dark:bg-surface-800',
                              (day.isSelected || day.isToday) && 'font-semibold',
                              day.isSelected && 'text-white',
                              !day.isSelected && day.isToday && 'text-primary',
                              !day.isSelected && day.isCurrentMonth && !day.isToday && 'text-surface-900 dark:text-surface-100',
                              !day.isSelected && !day.isCurrentMonth && !day.isToday && 'text-surface-500 dark:text-surface-400',
                              'flex h-14 flex-col px-3 py-2 hover:bg-surface-100 focus:z-10 dark:hover:bg-surface-800',
                              rowIndex === rows.length - 1 && !lastRowHasCurrentMonth && 'bg-white dark:bg-surface-900'
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
                                  className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-surface-400 dark:bg-surface-500"/>
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
          <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-3">
            Události {new Date(selectedDay.date).toLocaleDateString('cs-CZ', {day: 'numeric', month: 'long'})}
          </h3>
          <ol className="divide-y divide-surface-100 overflow-hidden rounded-lg bg-white text-sm shadow-sm dark:divide-surface-700 dark:bg-surface-900">
            {selectedDay.events.map((event) => (
                <li key={event.id}
                    className="group flex p-4 pr-6 focus-within:bg-surface-50 hover:bg-surface-50 dark:focus-within:bg-surface-800 dark:hover:bg-surface-800">
                  <div className="flex-auto">
                    <p className="font-semibold text-surface-900 dark:text-surface-100">{event.name}</p>
                    <time dateTime={event.datetime}
                          className="mt-2 flex items-center text-surface-700 dark:text-surface-300">
                      <ClockIcon className="mr-2 h-5 w-5 text-surface-400 dark:text-surface-500"
                                 aria-hidden="true"/>
                      {event.time}
                    </time>
                  </div>
                  <a
                      href={event.href}
                      className="ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-surface-900 shadow-sm ring-1 ring-inset ring-surface-300 group-hover:bg-surface-50 dark:bg-surface-800 dark:text-surface-100 dark:ring-surface-700 dark:hover:bg-surface-700"
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
              <div className="text-center p-4 text-surface-500 dark:text-surface-400">
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
