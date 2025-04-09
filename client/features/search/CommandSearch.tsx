import { useState, useEffect, useRef } from "react";
import { Search, Loader2, FileText, Link, File, Settings, Upload, Plus } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut
} from "~/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/utils/helpers";
import type { ProjectWithIssues } from "~/types";
import { useCommandSearch } from "~/hooks/useCommandSearch";

interface CommandSearchProps {
  projects: ProjectWithIssues[];
}

export function CommandSearch({ projects }: CommandSearchProps) {
  const [open, setOpen] = useState(false);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const {
    inputValue,
    isSearching,
    results,
    isDragging,
    handleInputChange,
    handleSelect,
    createNewIssue,
    dragAndDropHandlers
  } = useCommandSearch({
    projects,
    onClose: () => setOpen(false)
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 rounded-full bg-muted p-0"
                  onClick={() => setOpen(true)}
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Vyhledávání</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <div className="flex items-center gap-1">
                <span>Vyhledávání</span>
                <Badge className="text-[10px] py-0 px-1.5 ml-1">Ctrl+K</Badge>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <div
              ref={dropAreaRef}
              className={`relative ${isDragging ? 'bg-accent/20 ring-2 ring-primary' : ''}`}
              onDragOver={dragAndDropHandlers.handleDragOver}
              onDragLeave={dragAndDropHandlers.handleDragLeave}
              onDrop={dragAndDropHandlers.handleDrop}
          >
            {isDragging && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10 pointer-events-none">
                  <div className="flex flex-col items-center gap-2 text-center px-4 py-8">
                    <Upload className="h-6 w-6 text-primary animate-bounce" />
                    <p className="text-sm font-medium max-w-xs">Přetáhněte soubor nebo URL pro vyhledávání</p>
                  </div>
                </div>
            )}

            <CommandInput
                placeholder="Hledej napříč projekty a issues"
                value={inputValue}
                onValueChange={handleInputChange}
                className={cn("border-none focus:ring-0 focus-visible:ring-0 focus-visible:border-none", isDragging && "!h-20")}
            />
          </div>

          <CommandList>
            {isSearching && (
                <div className="py-6 text-center text-sm">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary mb-2" />
                  <p>Prohledávám projekty a issues...</p>
                </div>
            )}

            {!isSearching && !results.length && inputValue && (
                <>
                  <CommandEmpty>Nebyly nalezeny žádné výsledky</CommandEmpty>
                  <CommandGroup heading="Akce">
                    <CommandItem
                        className="flex items-center gap-2"
                        onSelect={createNewIssue}
                    >
                      <Plus className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p>Vytvořit nové issue</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {inputValue ? `"${inputValue}"` : "Nové issue"}
                        </p>
                      </div>
                    </CommandItem>
                  </CommandGroup>
                </>
            )}

            {!isSearching && !inputValue && (
                <div className="px-2 py-4 text-center text-xs text-muted-foreground">
                  <p>Začni psát pro vyhledávání v projektech a issues</p>
                  <p className="mt-2">Můžeš také přetáhnout soubor nebo odkaz z jiné aplikace</p>
                </div>
            )}

            {/* Sekce výsledků */}
            {!isSearching && results.some(r => r.type === "issue") && (
                <CommandGroup heading="Issues">
                  {results
                      .filter(r => r.type === "issue")
                      .map(result => (
                          <CommandItem
                              key={result.id}
                              value={result.title}
                              onSelect={() => handleSelect(result)}
                              className="flex items-start gap-2"
                          >
                            {result.icon || <FileText className="text-muted-foreground" />}
                            <div className="flex-1 overflow-hidden">
                              <p className="truncate">{result.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                            </div>
                          </CommandItem>
                      ))}
                </CommandGroup>
            )}

            {!isSearching && results.some(r => r.type === "project") && (
                <CommandGroup heading="Projekty">
                  {results
                      .filter(r => r.type === "project")
                      .map(result => (
                          <CommandItem
                              key={result.id}
                              value={result.title}
                              onSelect={() => handleSelect(result)}
                              className="flex items-start gap-2"
                          >
                            {result.icon || <File className="text-primary" />}
                            <div className="flex-1 overflow-hidden">
                              <p className="truncate">{result.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                            </div>
                          </CommandItem>
                      ))}
                </CommandGroup>
            )}

            {!isSearching && results.some(r => r.type === "url") && (
                <CommandGroup heading="Odkazy">
                  {results
                      .filter(r => r.type === "url")
                      .map(result => (
                          <CommandItem
                              key={result.id}
                              value={result.title}
                              onSelect={() => handleSelect(result)}
                              className="flex items-start gap-2"
                          >
                            {result.icon || <Link className="text-blue-500" />}
                            <div className="flex-1 overflow-hidden">
                              <p className="truncate">{result.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                            </div>
                            <CommandShortcut>↵</CommandShortcut>
                          </CommandItem>
                      ))}
                </CommandGroup>
            )}

            {!isSearching && results.some(r => r.type === "file") && (
                <CommandGroup heading="Soubory">
                  {results
                      .filter(r => r.type === "file")
                      .map(result => (
                          <CommandItem
                              key={result.id}
                              value={result.title}
                              onSelect={() => handleSelect(result)}
                              className="flex items-start gap-2"
                          >
                            {result.icon || <FileText className="text-green-500" />}
                            <div className="flex-1 overflow-hidden">
                              <p className="truncate">{result.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                            </div>
                          </CommandItem>
                      ))}
                </CommandGroup>
            )}

            {!isSearching && results.some(r => r.type === "page") && (
                <CommandGroup heading="Stránky">
                  {results
                      .filter(r => r.type === "page")
                      .map(result => (
                          <CommandItem
                              key={result.id}
                              value={result.title}
                              onSelect={() => handleSelect(result)}
                              className="flex items-start gap-2"
                          >
                            {result.icon || <Settings className="text-muted-foreground" />}
                            <div className="flex-1 overflow-hidden">
                              <p className="truncate">{result.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                            </div>
                            {result.id === "settings" && (
                                <CommandShortcut>⌘P</CommandShortcut>
                            )}
                          </CommandItem>
                      ))}
                </CommandGroup>
            )}
          </CommandList>
        </CommandDialog>
      </>
  );
}
