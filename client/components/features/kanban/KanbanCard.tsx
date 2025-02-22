import { useDrag } from 'react-dnd';
import { ChatBubbleLeftIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {cn} from "~/lib/utils";
import {Avatar, AvatarFallback} from "~/components/ui/avatar";

interface CardProps {
  title: string;
  summary?: string;
  code: string;
  state: string;
}

const KanbanCard = ({ title, summary, code, state }: CardProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { code, state },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
      <Card
          ref={drag}
          className={cn(
              'cursor-move transition-all duration-200 hover:shadow-lg',
              isDragging ? 'opacity-50' : 'opacity-100'
          )}
      >
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-surface-500 dark:text-surface-400">
            {code}
          </span>
          </div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        {summary && (
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-surface-600 dark:text-surface-300">
                {summary}
              </p>
            </CardContent>
        )}
        <CardFooter className="p-3 border-t border-surface-100 dark:border-surface-800 flex justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-surface-500 dark:text-surface-400">
              <ChatBubbleLeftIcon className="mr-1.5 h-3.5 w-3.5" />
              <span className="text-xs">2</span>
            </div>
            <div className="flex items-center text-surface-500 dark:text-surface-400">
              <PaperClipIcon className="mr-1.5 h-3.5 w-3.5" />
              <span className="text-xs">3</span>
            </div>
          </div>
          <Avatar className="h-6 w-6 bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            <AvatarFallback className="text-xs">NL</AvatarFallback>
          </Avatar>
        </CardFooter>
      </Card>
  );
};

export default KanbanCard;

