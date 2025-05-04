import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Brain, FileText, Network } from "lucide-react";
import { Progress } from "~/components/ui/progress";
import { KnowledgeTag } from "~/types/knowledge";

interface ContentStatsCardProps {
  totalItems: {
    documents: number;
    concepts: number;
    mindmaps: number;
  };
}

export function ContentStatsCard({ totalItems }: ContentStatsCardProps) {
  const total = totalItems.documents + totalItems.concepts + totalItems.mindmaps;

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Statistika obsahu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {total}
        </div>
        <p className="text-xs text-muted-foreground">
          Celkový počet položek s tagy
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <FileText className="mr-1 h-3 w-3 text-muted-foreground" />
              <span>Dokumenty</span>
            </div>
            <span>{totalItems.documents}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <Network className="mr-1 h-3 w-3 text-muted-foreground" />
              <span>Koncepty</span>
            </div>
            <span>{totalItems.concepts}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <Brain className="mr-1 h-3 w-3 text-muted-foreground" />
              <span>Myšlenkové mapy</span>
            </div>
            <span>{totalItems.mindmaps}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TagsCountCardProps {
  tags: KnowledgeTag[];
}

export function TagsCountCard({ tags }: TagsCountCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Tagy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {tags.length}
        </div>
        <p className="text-xs text-muted-foreground">
          Celkový počet tagů v systému
        </p>
        <div className="mt-4">
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 8).map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="px-2 py-0 h-5"
                style={{
                  backgroundColor: `${tag.color}20`,
                  color: tag.color,
                  borderColor: `${tag.color}40`,
                }}
              >
                {tag.name}
              </Badge>
            ))}
            {tags.length > 8 && (
              <Badge variant="outline" className="px-2 py-0 h-5">
                +{tags.length - 8}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface PopularTagsCardProps {
  tags: KnowledgeTag[];
  totalItems: {
    documents: number;
    concepts: number;
    mindmaps: number;
  };
}

export function PopularTagsCard({ tags, totalItems }: PopularTagsCardProps) {
  const totalAll = totalItems.documents + totalItems.concepts + totalItems.mindmaps;

  const sortedTags = [...tags]
    .sort((a, b) => {
      const totalA = a.count.documents + a.count.concepts + a.count.mindmaps;
      const totalB = b.count.documents + b.count.concepts + b.count.mindmaps;
      return totalB - totalA;
    })
    .slice(0, 3);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Nejpoužívanější tagy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedTags.map((tag) => {
            const total = tag.count.documents + tag.count.concepts + tag.count.mindmaps;
            const percentage = totalAll > 0 ? (total / totalAll) * 100 : 0;

            return (
              <div key={tag.id} className="space-y-1 min-w-0">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                    <div
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="truncate">{tag.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {total} položek
                  </span>
                </div>
                <Progress
                  value={percentage}
                  className="h-1 w-full"
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
