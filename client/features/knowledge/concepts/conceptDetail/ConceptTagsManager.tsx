import { useState } from "react";
import { Tag, X, Plus } from "lucide-react";
import { cn } from "~/utils/helpers";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

interface ConceptTagsManagerProps {
  tags: string[];
  isEditing: boolean;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export function ConceptTagsManager({ tags, isEditing, onAddTag, onRemoveTag }: ConceptTagsManagerProps) {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag("");
    }
  };

  return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary/80" />
          <span>Tagy</span>
        </h3>

        <div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.map(tag => (
                <Badge
                    key={tag}
                    variant="secondary"
                    className={cn(
                        "px-2 py-0.5 h-6 bg-primary/10 text-primary hover:bg-primary/20 transition-colors",
                        isEditing && "pr-1"
                    )}
                >
                  {tag}
                  {isEditing && (
                      <button
                          onClick={() => onRemoveTag(tag)}
                          className="ml-1 p-0.5 hover:bg-primary/20 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                  )}
                </Badge>
            ))}
            {tags.length === 0 && (
                <div className="text-sm text-muted-foreground py-2">
                  Žádné tagy
                </div>
            )}
          </div>

          {isEditing && (
              <div className="flex gap-2">
                <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Nový tag"
                    className="h-8 text-xs flex-1"
                />
                <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs px-2"
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Přidat
                </Button>
              </div>
          )}
        </div>
      </div>
  );
}
