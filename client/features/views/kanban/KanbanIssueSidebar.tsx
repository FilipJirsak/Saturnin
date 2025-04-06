import {useState, useEffect, ChangeEvent, FormEvent} from "react";
import { ExternalLink, X, Tag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { IssueFull } from "~/types";
import {cn, getInitials} from "~/utils/helpers";
import { format } from "date-fns";
import { DatePicker } from "~/components/ui/DatePicker";
import {Avatar, AvatarFallback} from "~/components/ui/avatar";
import {ISSUE_AVAILABLE_TAGS, ISSUE_STATES, ISSUE_TEAM_MEMBERS} from "~/lib/constants";

interface IssueSidebarProps {
  isOpen: boolean;
  issue: Partial<IssueFull> | null;
  projectCode: string;
  onClose: () => void;
  onSave: (issue: Partial<IssueFull>) => Promise<void>;
  isNew?: boolean;
}

/*TODO (NL): Rozdělit do obecných komponent*/
export function KanbanIssueSidebar({
                                       isOpen,
                                       issue,
                                       projectCode,
                                       onClose,
                                       onSave,
                                       isNew = false
                                     }: IssueSidebarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<IssueFull>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [newTag, setNewTag] = useState<string>("");

  useEffect(() => {
    if (issue && isOpen) {
      console.log("Issue loaded in sidebar:", issue);
      setFormData(issue);
      setSelectedTags(issue.tags || []);
      setDueDate(issue.due_date ? new Date(issue.due_date) : undefined);
    } else if (!isOpen) {
      setFormData({});
      setSelectedTags([]);
      setDueDate(undefined);
      setNewTag("");
    }
  }, [issue, isOpen]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, state: value }));
  };

  const handleAssigneeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, assignee: value }));
  };

  const handleTagsChange = (tag: string) => {
    let newTags: string[];
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter((t) => t !== tag);
    } else {
      newTags = [...selectedTags, tag];
    }
    setSelectedTags(newTags);
    setFormData((prev) => ({ ...prev, tags: newTags }));
  };

  const handleAddCustomTag = (e: FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      const updatedTags = [...selectedTags, newTag.trim()];
      setSelectedTags(updatedTags);
      setFormData((prev) => ({ ...prev, tags: updatedTags }));
      setNewTag("");
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setDueDate(date);
    setFormData((prev) => ({ ...prev, due_date: date ? date.toISOString() : undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave({
        ...formData,
        tags: selectedTags,
        due_date: dueDate ? dueDate.toISOString() : undefined
      });
    } catch (error) {
      console.error("Failed to save issue:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openInNewTab = () => {
    if (issue?.code) {
      window.open(`/projects/${projectCode}/issue/${issue.code}`, '_blank');
    }
  };

  return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="sm:max-w-md md:max-w-lg">
          <form onSubmit={handleSubmit} className="flex h-full flex-col">
            <SheetHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <SheetTitle>
                  {isNew ? "Nový úkol" : issue?.code || "Detail úkolu"}
                </SheetTitle>
                <div className="flex space-x-2 mr-4">
                  {!isNew && issue?.code && (
                      <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={openInNewTab}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                  )}
                  {/*<Button
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={onClose}
                  >
                    <X className="h-4 w-4" />
                  </Button>*/}
                </div>
              </div>
              {!isNew && issue?.created_at && (
                  <SheetDescription>
                    Vytvořeno {format(new Date(issue.created_at), 'dd.MM.yyyy HH:mm')}
                  </SheetDescription>
              )}
            </SheetHeader>

            <div className="flex-grow overflow-y-auto py-4 px-2 custom-scrollbar">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">Název</Label>
                  <Input
                      id="title"
                      name="title"
                      placeholder="Zadejte název úkolu"
                      value={formData.title || ""}
                      onChange={handleInputChange}
                      required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="state">Stav</Label>
                  <Select
                      value={formData.state || "new"}
                      onValueChange={handleSelectChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Vyberte stav" />
                    </SelectTrigger>
                    <SelectContent>
                      {ISSUE_STATES.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="summary">Shrnutí</Label>
                  <Input
                      id="summary"
                      name="summary"
                      placeholder="Krátké shrnutí úkolu"
                      value={formData.summary || ""}
                      onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="description">Popis</Label>
                  <Textarea
                      id="description"
                      name="description"
                      placeholder="Podrobný popis úkolu"
                      rows={5}
                      value={formData.description || ""}
                      onChange={handleInputChange}
                  />
                </div>

                <Separator />

                <div className="grid gap-3">
                  <Label>Termín dokončení</Label>
                  <DatePicker
                      selected={dueDate}
                      onSelect={handleDateChange}
                  />
                </div>

                <div className="grid gap-3">
                  <Label>Přiřazeno</Label>
                  <Select
                      value={formData.assignee || ""}
                      onValueChange={handleAssigneeChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Vyberte osobu" />
                    </SelectTrigger>
                    <SelectContent>
                      {ISSUE_TEAM_MEMBERS.map((member) => (
                          <SelectItem key={member.value} value={member.value}>
                            {member.label}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.assignee && (
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{getInitials(formData.assignee)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{formData.assignee}</span>
                      </div>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label>Tagy</Label>
                  <div className="flex flex-wrap gap-2">
                    {ISSUE_AVAILABLE_TAGS.map((tag) => (
                        <Badge
                            key={tag}
                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                            className={cn(
                                "cursor-pointer",
                                selectedTags.includes(tag) ? "bg-primary" : ""
                            )}
                            onClick={() => handleTagsChange(tag)}
                        >
                          {tag}
                        </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Input
                        placeholder="Vlastní tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="flex-1"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddCustomTag}
                        disabled={!newTag.trim()}
                    >
                      Přidat
                    </Button>
                  </div>

                  {selectedTags.length > 0 && (
                      <div className="mt-2">
                        <Label className="mb-2 inline-block">Vybrané tagy:</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map((tag) => (
                              <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="flex items-center gap-1"
                              >
                                {tag}
                                <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => handleTagsChange(tag)}
                                />
                              </Badge>
                          ))}
                        </div>
                      </div>
                  )}
                </div>
              </div>
            </div>

            <SheetFooter className="flex-shrink-0 border-t pt-4">
              <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
              >
                {isLoading ? "Ukládání..." : isNew ? "Vytvořit issue" : "Uložit změny"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
  );
}
