import { Dispatch, SetStateAction } from "react";
import { IssueFull } from '~/types';
import { CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { useToast } from "~/hooks/use-toast";
import { ISSUE_STATES } from "~/lib/constants";
import { Edit2, Trash2, Copy, Save, X, MoreHorizontal } from "lucide-react";

// TODO (NL): Přidat podporu pro více stavů issue
interface IssueDetailHeaderProps {
  issue: IssueFull;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setEditedIssue: Dispatch<SetStateAction<IssueFull>>;
  handleSave: (issue: IssueFull) => Promise<void>;
  handleCancelEdit: () => void;
  setIsDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export function IssueDetailHeader({
                                    issue,
                                    isEditing,
                                    setIsEditing,
                                    setEditedIssue,
                                    handleSave,
                                    handleCancelEdit,
                                    setIsDeleteDialogOpen
                                  }: IssueDetailHeaderProps) {
  const { toast } = useToast();
  const state = ISSUE_STATES.find(s => s.value === issue.state);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Odkaz zkopírován",
      description: "Odkaz byl uložen do schránky",
    });
  };

  return (
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-4 flex-1">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="rounded-md font-mono bg-muted/50">
                    {issue.code}
                  </Badge>
                  <span>•</span>
                  <Badge
                      variant={state?.value === 'done' ? 'default' : 'secondary'}
                      className="rounded-md transition-colors duration-200"
                  >
                    {state?.label || issue.state}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                            className="gap-2 hover:bg-muted/50"
                        >
                          <X className="h-4 w-4" />
                          Zrušit
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => handleSave(issue)}
                            className="gap-2 bg-primary hover:bg-primary/90"
                        >
                          <Save className="h-4 w-4" />
                          Uložit
                        </Button>
                      </div>
                  ) : (
                      <>
                        <div className="hidden lg:flex items-center gap-2">
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsEditing(true)}
                              className="gap-2 hover:bg-muted/50"
                          >
                            <Edit2 className="h-4 w-4" />
                            Upravit
                          </Button>
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCopyLink}
                              className="gap-2 hover:bg-muted/50"
                          >
                            <Copy className="h-4 w-4" />
                            Kopírovat odkaz
                          </Button>
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsDeleteDialogOpen(true)}
                              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                            Smazat
                          </Button>
                        </div>
                        <div className="lg:hidden">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => setIsEditing(true)} className="cursor-pointer">
                                <Edit2 className="h-4 w-4 mr-2" />
                                Upravit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                                <Copy className="h-4 w-4 mr-2" />
                                Kopírovat odkaz
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                  className="text-destructive cursor-pointer"
                                  onClick={() => setIsDeleteDialogOpen(true)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Smazat
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </>
                  )}
                </div>
              </div>
              {isEditing ? (
                  <div className="space-y-4">
                    <Input
                        value={issue.title}
                        onChange={(e) => setEditedIssue(prev => ({ ...prev, title: e.target.value }))}
                        className="text-2xl font-bold border-none bg-muted/50 focus-visible:ring-2"
                    />
                    <Textarea
                        value={issue.summary || ''}
                        onChange={(e) => setEditedIssue(prev => ({ ...prev, summary: e.target.value }))}
                        placeholder="Přidat shrnutí..."
                        className="text-lg border-none bg-muted/50 focus-visible:ring-2"
                    />
                  </div>
              ) : (
                  <>
                    <CardTitle className="text-2xl font-bold mb-2">
                      {issue.title}
                    </CardTitle>
                    {issue.summary && (
                        <p className="text-muted-foreground text-lg">
                          {issue.summary}
                        </p>
                    )}
                  </>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
  );
}
