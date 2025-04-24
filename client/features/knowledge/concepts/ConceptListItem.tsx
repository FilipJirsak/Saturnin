import { Link } from "@remix-run/react";
import { Network, ChevronRight } from "lucide-react";
import { Concept } from "~/types/knowledge";
import { formatDate } from "~/utils/dateUtils";
import { getRelationLabel } from "~/utils/knowledge/conceptUtils";
import { cn } from "~/utils/helpers";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

interface ConceptListItemProps {
  concept: Concept;
  onToggleExpand: (conceptId: string) => void;
}

export function ConceptListItem({ concept, onToggleExpand }: ConceptListItemProps) {
  return (
      <Card className="mb-3 hover:shadow-sm transition-shadow">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleExpand(concept.id);
                    }}
                >
                  <ChevronRight className={cn(
                      "h-4 w-4 transition-transform",
                      concept.isExpanded ? "transform rotate-90" : ""
                  )} />
                </Button>

                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Network className="h-4 w-4 text-primary" />
                  <Link
                      to={`/knowledge/concepts/${concept.id}`}
                      className="cursor-pointer hover:text-primary"
                  >
                    {concept.title}
                  </Link>
                </CardTitle>
              </div>

              {!concept.isExpanded && (
                  <CardDescription className="line-clamp-1 mt-1 ml-8">
                    {concept.description}
                  </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>

        {concept.isExpanded && (
            <>
              <CardContent className="p-4 pt-0 ml-8">
                <div className="text-sm mb-3">
                  {concept.description}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {concept.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="px-2 py-0 h-5">
                        {tag}
                      </Badge>
                  ))}
                </div>

                {concept.related.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground mb-1">Propojené koncepty:</div>
                      {concept.related.map(rel => (
                          <div key={rel.id} className="flex items-center gap-2 text-sm">
                            <Badge variant="outline" className="px-2 py-0 h-5 text-xs">
                              {getRelationLabel(rel.relation)}
                            </Badge>
                            <Link
                                to={`/knowledge/concepts/${rel.id}`}
                                className="hover:text-primary cursor-pointer"
                            >
                              {rel.title}
                            </Link>
                          </div>
                      ))}
                    </div>
                )}
              </CardContent>

              <CardFooter className="p-4 pt-0 text-xs text-muted-foreground ml-8">
                Aktualizováno: {formatDate(concept.lastModified)}
              </CardFooter>
            </>
        )}
      </Card>
  );
}
