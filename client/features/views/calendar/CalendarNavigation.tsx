import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import {formatCurrentDate} from "~/utils/calendarUtils";

interface CalendarNavigationProps {
  currentDate: Date;
  viewType: 'month' | 'week' | 'day';
  onNavigate: (direction: 'prev' | 'next') => void;
  onToday: () => void;
  onViewChange: (view: 'month' | 'week' | 'day') => void;
}

export function CalendarNavigation({
                                     currentDate,
                                     viewType,
                                     onNavigate,
                                     onToday,
                                     onViewChange
                                   }: CalendarNavigationProps) {
  return (
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-surface-900 dark:text-surface-50">
          {formatCurrentDate(viewType, currentDate)}
        </h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center rounded-full bg-white shadow-sm dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
            <Button
                variant="ghost"
                size="icon"
                className="rounded-l-full h-9 w-9 flex items-center justify-center"
                onClick={() => onNavigate('prev')}
            >
              <ChevronLeftIcon className="h-5 w-5 text-surface-500 dark:text-surface-400" aria-hidden="true" />
              <span className="sr-only">Předchozí</span>
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="h-9 text-sm px-4 font-medium hidden md:block border-x border-surface-200 dark:border-surface-700 rounded-none"
                onClick={onToday}
            >
              Dnes
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="rounded-r-full h-9 w-9 flex items-center justify-center"
                onClick={() => onNavigate('next')}
            >
              <ChevronRightIcon className="h-5 w-5 text-surface-500 dark:text-surface-400" aria-hidden="true" />
              <span className="sr-only">Další</span>
            </Button>
          </div>
          <div className="hidden md:flex md:items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-x-1.5 bg-white dark:bg-surface-800">
                  {viewType === 'month' ? 'Měsíc' : viewType === 'week' ? 'Týden' : 'Den'}
                  <ChevronDownIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => onViewChange('day')}>
                  Den
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewChange('week')}>
                  Týden
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewChange('month')}>
                  Měsíc
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <EllipsisHorizontalIcon className="h-5 w-5" />
                <span className="sr-only">Další možnosti</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onToday}>
                Přejít na dnešek
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onViewChange('day')}>
                Denní zobrazení
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewChange('week')}>
                Týdenní zobrazení
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewChange('month')}>
                Měsíční zobrazení
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
  );
}
