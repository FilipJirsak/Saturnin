import { Calendar, Clock, User } from "lucide-react";
import { FileText } from "lucide-react";
import { formatDate } from "~/utils/dateUtils";

interface ConceptInfoProps {
  author: string;
  createdAt: string;
  lastModified: string;
}

export function ConceptInfo({ author, createdAt, lastModified }: ConceptInfoProps) {
  return (
    <div>
      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary/80" />
        <span>Informace</span>
      </h3>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Autor:</span>
          <span className="font-medium">{author}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Vytvořeno:</span>
          <span>{formatDate(createdAt)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Aktualizováno:</span>
          <span>{formatDate(lastModified)}</span>
        </div>
      </div>
    </div>
  );
}
