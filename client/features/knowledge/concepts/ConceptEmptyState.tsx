import { Network, Plus } from "lucide-react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

interface EmptyConceptStateProps {
  searchTerm?: string;
  onCreateClick: () => void;
}

export function ConceptEmptyState({ searchTerm, onCreateClick }: EmptyConceptStateProps) {
  return (
    <Card className="py-10">
      <div className="flex flex-col items-center justify-center gap-3">
        <Network className="h-10 w-10 text-muted-foreground" />
        <h3 className="text-xl font-medium">Žádné koncepty nenalezeny</h3>
        <p className="text-muted-foreground">
          {searchTerm
            ? `Nebyly nalezeny žádné koncepty odpovídající vyhledávání "${searchTerm}".`
            : "Zatím nemáš vytvořené žádné koncepty."}
        </p>
        <Button className="mt-2" onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Vytvořit první koncept
        </Button>
      </div>
    </Card>
  );
}
