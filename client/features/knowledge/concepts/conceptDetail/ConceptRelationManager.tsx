import { useState } from "react";
import { Link2, X, Plus } from "lucide-react";
import { Link as RemixLink } from "@remix-run/react";
import { RelatedConcept } from "~/types/knowledge";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select";
import { RELATION_TYPES } from "~/lib/constants";
import {categorizeRelations, getRelationColor, getRelationLabel} from "~/utils/knowledge/conceptUtils";

interface ConceptRelationManagerProps {
  relations: RelatedConcept[];
  isEditing: boolean;
  availableConcepts: Array<{ id: string; title: string }>;
  onRemoveRelation: (relationId: string) => void;
  onAddRelation: (relationId: string, relationType: string) => void;
}

export function ConceptRelationManager({
                                         relations,
                                         isEditing,
                                         availableConcepts,
                                         onRemoveRelation,
                                         onAddRelation
                                       }: ConceptRelationManagerProps) {
  const [newRelationId, setNewRelationId] = useState("");
  const [newRelationType, setNewRelationType] = useState(RELATION_TYPES[0].value);

  const filteredAvailableConcepts = availableConcepts.filter(
      c => !relations.some(r => r.id === c.id)
  );

  const handleAddRelation = () => {
    if (!newRelationId) return;
    onAddRelation(newRelationId, newRelationType);
    setNewRelationId("");
  };

  const categorizedRelations = categorizeRelations(relations);

  const renderCategoryRelations = (categoryRelations: RelatedConcept[], category: string) => {
    if (categoryRelations.length === 0) return null;

    return (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${getRelationColor(category)}`}></div>
            {getRelationLabel(category)}
          </h4>
          <div className="space-y-2 pl-3">
            {categoryRelations.map(rel => (
                <div key={rel.id} className="flex items-center justify-between">
                  <RemixLink
                      to={`/knowledge/concepts/${rel.id}`}
                      className="text-sm hover:text-primary hover:underline cursor-pointer"
                      onClick={(e) => {
                        if (isEditing) e.preventDefault();
                      }}
                  >
                    {rel.title}
                  </RemixLink>
                  {isEditing && (
                      <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onRemoveRelation(rel.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                  )}
                </div>
            ))}
          </div>
        </div>
    );
  };

  return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-primary/80" />
          <span>Propojené koncepty</span>
        </h3>

        {relations.length > 0 ? (
            <div>
              {renderCategoryRelations(categorizedRelations.is_a, "is_a")}
              {renderCategoryRelations(categorizedRelations.has_a, "has_a")}
              {renderCategoryRelations(categorizedRelations.part_of, "part_of")}
              {renderCategoryRelations(categorizedRelations.depends_on, "depends_on")}
              {renderCategoryRelations(categorizedRelations.related_to, "related_to")}
            </div>
        ) : (
            <div className="text-sm text-muted-foreground text-center py-4 px-4 bg-muted/30 rounded-md">
              <p>Žádné propojené koncepty</p>
              {isEditing && (
                  <p className="mt-2 text-xs">
                    Použij formulář níže pro vytvoření propojení s jinými koncepty.
                  </p>
              )}
            </div>
        )}

        {isEditing && filteredAvailableConcepts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-sm font-medium mb-3">Přidat nové propojení</h4>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Select value={newRelationId} onValueChange={setNewRelationId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Vyberte koncept" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredAvailableConcepts.map(concept => (
                            <SelectItem key={concept.id} value={concept.id}>
                              {concept.title}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Select value={newRelationType} onValueChange={setNewRelationType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Vztah" />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATION_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleAddRelation}
                    disabled={!newRelationId}
                >
                  <Plus className="h-3 w-3 mr-1" /> Přidat propojení
                </Button>
              </div>
            </div>
        )}
      </div>
  );
}
