import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cs } from "date-fns/locale";

import { cn } from "~/utils/helpers";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";

interface DatePickerProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  className?: string;
}

export function DatePicker({ selected, onSelect, className }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected
            ? (
              format(selected, "PPP", { locale: cs })
            )
            : <span>Vyber datum</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          initialFocus
          locale={cs}
        />
      </PopoverContent>
    </Popover>
  );
}
