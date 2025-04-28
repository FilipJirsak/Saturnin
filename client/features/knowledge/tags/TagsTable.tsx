import {
  Table, TableBody, TableCell, TableFooter, TableHead,
  TableHeader, TableRow
} from "~/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import {
  AlertCircle, Hash, FileText, Network, Brain,
  MoreHorizontal, Edit, Trash2
} from "lucide-react";
import { formatDate } from "~/utils/dateUtils";
import { KnowledgeTag } from "~/types/knowledge";

interface TagsTableProps {
  filteredTags: KnowledgeTag[];
  tagsCount: number;
  onEditTag: (tag: KnowledgeTag) => void;
  onDeleteTag: (tagId: string) => void;
}

export function TagsTable({
                            filteredTags,
                            tagsCount,
                            onEditTag,
                            onDeleteTag
                          }: TagsTableProps) {
  return (
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-5/12 sm:w-6/12">Název</TableHead>
              <TableHead className="hidden sm:table-cell w-3/12">Položky</TableHead>
              <TableHead className="hidden sm:table-cell w-2/12">Vytvořeno</TableHead>
              <TableHead className="w-1/12 text-right">Akce</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium">Žádné tagy nenalezeny</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Nebyly nalezeny žádné tagy odpovídající vašemu vyhledávání.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
            ) : (
                filteredTags.map(tag => {
                  const totalItems = tag.count.documents + tag.count.concepts + tag.count.mindmaps;

                  return (
                      <TableRow key={tag.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                                className="h-4 w-4 rounded-full flex-shrink-0"
                                style={{ backgroundColor: tag.color }}
                            />
                            <div className="max-w-full overflow-hidden">
                              <div className="font-medium">{tag.name}</div>
                              {tag.description && (
                                  <div className="text-xs text-muted-foreground truncate max-w-64">
                                    {tag.description}
                                  </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs mt-1 sm:hidden">
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3 text-muted-foreground" />
                              <span>{tag.count.documents}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Network className="h-3 w-3 text-muted-foreground" />
                              <span>{tag.count.concepts}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Brain className="h-3 w-3 text-muted-foreground" />
                              <span>{tag.count.mindmaps}</span>
                            </div>
                            <span className="text-muted-foreground">
                        (celkem: {totalItems})
                      </span>
                          </div>

                          <div className="text-xs text-muted-foreground mt-1 sm:hidden">
                            {formatDate(tag.createdAt)}
                          </div>
                        </TableCell>

                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-1 text-xs">
                              <FileText className="h-3 w-3 text-muted-foreground" />
                              <span>{tag.count.documents}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Network className="h-3 w-3 text-muted-foreground" />
                              <span>{tag.count.concepts}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Brain className="h-3 w-3 text-muted-foreground" />
                              <span>{tag.count.mindmaps}</span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                          {formatDate(tag.createdAt)}
                        </TableCell>

                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Akce</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onEditTag(tag)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Upravit</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => onDeleteTag(tag.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Smazat</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                  );
                })
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  <span>Zobrazeno {filteredTags.length} z {tagsCount} tagů</span>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
  );
}
