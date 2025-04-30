import {useState, useEffect, ChangeEvent, FormEvent, useCallback, DragEvent} from "react";
import { ExternalLink, X, Tag, Link, Upload } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { IssueFull, IssueData } from "~/types";
import {cn, getInitials} from "~/utils/helpers";
import { format } from "date-fns";
import { DatePicker } from "~/components/ui/DatePicker";
import {Avatar, AvatarFallback} from "~/components/ui/avatar";
import {ISSUE_AVAILABLE_TAGS, ISSUE_STATES, ISSUE_TEAM_MEMBERS} from "~/lib/constants";
import { useToast } from "~/hooks/use-toast";

interface IssueSidebarProps {
  isOpen: boolean;
  issue: Partial<IssueFull> | null;
  projectCode: string;
  onClose: () => void;
  onSave: (issue: Partial<IssueFull>) => Promise<void>;
  isNew?: boolean;
}

export function IssueSidebar({
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
  const [link, setLink] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (issue && isOpen) {
      setFormData(issue);
      setSelectedTags(issue.tags || []);
      setDueDate(issue.due_date ? new Date(issue.due_date) : undefined);
      setLink(issue.data?.link || "");
    } else if (!isOpen) {
      setFormData({});
      setSelectedTags([]);
      setDueDate(undefined);
      setNewTag("");
      setLink("");
      setAttachedFiles([]);
    }
  }, [issue, isOpen]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer?.files || []);
    setAttachedFiles(prev => [...prev, ...files]);

    toast({
      title: "Soubory přidány",
      description: `Přidáno ${files.length} souborů`,
    });
  }, [toast]);

  const handleFileInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);

    toast({
      title: "Soubory přidány",
      description: `Přidáno ${files.length} souborů`,
    });
  }, [toast]);

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
      const issueData: IssueData = {
        ...formData.data,
        link: link.trim() || undefined,
        attachments: [
          ...(formData.data?.attachments || []),
          ...attachedFiles.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type
          }))
        ]
      };

      await onSave({
        ...formData,
        tags: selectedTags,
        due_date: dueDate ? dueDate.toISOString() : undefined,
        attachments_count: (formData.data?.attachments?.length || 0) + attachedFiles.length,
        data: issueData
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
                  {isNew ? "Nové issue" : issue?.code || "Detail issue"}
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
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="title">Název</Label>
                    <Input
                        id="title"
                        name="title"
                        placeholder="Zadej název issue"
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
                        <SelectValue placeholder="Vyber stav" />
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
                        placeholder="Krátké shrnutí issue"
                        value={formData.summary || ""}
                        onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="description">Popis</Label>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="Podrobný popis issue"
                        value={formData.description || ""}
                        onChange={handleInputChange}
                        className="min-h-[100px]"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="assignee">Přiřazená osoba</Label>
                    <Select
                        value={formData.assignee || ""}
                        onValueChange={handleAssigneeChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Vyber osobu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Nikdo</SelectItem>
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
                    <Label htmlFor="due-date">Termín</Label>
                    <DatePicker
                        selected={dueDate}
                        onSelect={handleDateChange}
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid gap-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground"/>
                    <Label>Tagy</Label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ISSUE_AVAILABLE_TAGS.map((tag) => (
                        <Badge
                            key={tag}
                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                            className={cn(
                                "cursor-pointer transition-colors",
                                selectedTags.includes(tag) ? "hover:bg-primary/80" : "hover:bg-muted"
                            )}
                            onClick={() => handleTagsChange(tag)}
                        >
                          {tag}
                        </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                        placeholder="Vlastní tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="flex-1"
                    />
                    <Button variant="outline" size="icon" onClick={handleAddCustomTag}>
                      <Tag className="h-4 w-4"/>
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

                <Separator />

                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-muted-foreground"/>
                      <Label htmlFor="link">Odkaz</Label>
                    </div>
                    <div className="flex gap-2">
                      <Input
                          id="link"
                          type="url"
                          placeholder="https://example.com"
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                          className="flex-1"
                      />
                      {link && (
                          <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              asChild
                          >
                            <a href={link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4"/>
                            </a>
                          </Button>
                      )}
                    </div>
                  </div>

                  <div
                      className={cn(
                          "grid gap-3 p-4 border-2 border-dashed rounded-lg transition-colors",
                          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
                      )}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                  >
                    <div className="flex items-center justify-center">
                      <Label
                          htmlFor="file-upload"
                          className="cursor-pointer text-center"
                      >
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Přetáhněte soubory sem nebo klikněte pro výběr
                        </span>
                        <Input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileInput}
                            multiple
                        />
                      </Label>
                    </div>
                    {attachedFiles.length > 0 && (
                        <div className="grid gap-2">
                          {attachedFiles.map((file, index) => (
                              <div
                                  key={index}
                                  className="flex items-center justify-between p-2 bg-muted rounded"
                              >
                                <span className="text-sm truncate">{file.name}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => setAttachedFiles(files => files.filter((_, i) => i !== index))}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                          ))}
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <SheetFooter className="flex-shrink-0 gap-2 pt-4">
              <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
              >
                Zrušit
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Ukládání..." : "Uložit"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
  );
}
