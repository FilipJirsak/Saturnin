import { Dispatch, SetStateAction } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Plus, Search, TagIcon } from "lucide-react";

interface TagsHeaderProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  openTagForm: () => void;
}

export function TagsHeader({ searchQuery, setSearchQuery, openTagForm }: TagsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <TagIcon className="h-5 w-5 text-primary" />
        Tagy
      </h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Hledat tagy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <Button className="flex items-center gap-1" onClick={openTagForm}>
          <Plus className="h-4 w-4" />
          <span>Nový tag</span>
        </Button>
      </div>
    </div>
  );
}
