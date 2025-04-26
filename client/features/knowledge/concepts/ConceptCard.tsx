import { useNavigate } from "@remix-run/react";
import { Network } from "lucide-react";
import { Concept } from "~/types/knowledge";
import { formatDate } from "~/utils/dateUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

// TODO (NL): Vylepšit vizuální design kartičky
// TODO (NL): Přidat náhled obsahu při najetí myší
// TODO (NL): Vylepšit zobrazení propojených konceptů - přidat vizuální mapu
interface ConceptCardProps {
  concept: Concept;
}

export function ConceptCard({ concept }: ConceptCardProps) {
  const navigate = useNavigate();

  return (
      <Card
          className="h-full hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate(`/knowledge/concepts/${concept.id}`)}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Network className="h-4 w-4 text-primary" />
              {concept.title}
            </CardTitle>
          </div>

          <CardDescription className="line-clamp-2 mt-1">
            {concept.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {concept.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="px-2 py-0 h-5">
                  {tag}
                </Badge>
            ))}
            {concept.tags.length > 3 && (
                <Badge variant="outline" className="px-2 py-0 h-5">
                  +{concept.tags.length - 3}
                </Badge>
            )}
          </div>

          {concept.related.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Propojeno s: {concept.related.slice(0, 2).map(r => r.title).join(", ")}
                {concept.related.length > 2 && ` a dalšími ${concept.related.length - 2}`}
              </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
          Aktualizováno: {formatDate(concept.lastModified)}
        </CardFooter>
      </Card>
  );
}
