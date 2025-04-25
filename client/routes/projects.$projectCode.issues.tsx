import { useOutletContext, Link, useParams } from "@remix-run/react";
import { ProjectWithIssues, IssueFull } from "~/types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
} from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { Search, ArrowUpDown, Edit, Eye, Filter, X, Check } from "lucide-react";
import { useState, useMemo } from "react";
import { ISSUE_STATES, ISSUE_TEAM_MEMBERS } from "~/lib/constants";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { getStateLabel, getStateColorClasses, filterAndSortIssues, hasActiveFilters } from "~/utils/issueUtils";
import { formatDate } from "~/utils/dateUtils";

type ProjectContext = {
  project: ProjectWithIssues;
  issues: IssueFull[];
};

type Filters = {
  state: string | null;
  assignee: string | null;
};

export default function ProjectIssuesView() {
  const { project, issues } = useOutletContext<ProjectContext>();
  const { projectCode } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [tempFilters, setTempFilters] = useState<Filters>({
    state: null,
    assignee: null
  });
  const [activeFilters, setActiveFilters] = useState<Filters>({
    state: null,
    assignee: null
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IssueFull | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc'
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const requestSort = (key: keyof IssueFull) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedIssues = useMemo(() => {
    return filterAndSortIssues(issues, searchTerm, activeFilters, sortConfig);
  }, [issues, searchTerm, activeFilters, sortConfig]);

  const resetFilters = () => {
    const emptyFilters = {
      state: null,
      assignee: null
    };

    setTempFilters(emptyFilters);
    setActiveFilters(emptyFilters);
    setIsPopoverOpen(false);
  };

  const applyFilters = () => {
    setActiveFilters(tempFilters);
    setIsPopoverOpen(false);
  };

  const handlePopoverOpenChange = (open: boolean) => {
    if (open) {
      setTempFilters(activeFilters);
    }
    setIsPopoverOpen(open);
  };

  const areFiltersActive = hasActiveFilters(activeFilters);
  const hasChangedFilters = JSON.stringify(tempFilters) !== JSON.stringify(activeFilters);

  return (
      <Card className="bg-card text-card-foreground">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Seznam issues</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                  placeholder="Vyhledat issue..."
                  className="pl-8 bg-background border-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
              <PopoverTrigger asChild>
                <Button
                    variant={areFiltersActive ? "default" : "outline"}
                    size="sm"
                    className={`gap-2 transition-all ${areFiltersActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                >
                  <Filter className="h-4 w-4" />
                  Filtrovat
                  {areFiltersActive && (
                      <Badge variant="secondary" className="ml-1 bg-primary-foreground text-primary">
                        {Object.values(activeFilters).filter(Boolean).length}
                      </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 shadow-lg border border-border rounded-lg bg-popover text-popover-foreground">
                <div className="grid gap-5">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h4 className="font-medium text-base">Filtry</h4>
                  </div>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium">Stav</Label>
                      <Select
                          value={tempFilters.state || "all"}
                          onValueChange={(value) => setTempFilters(prev => ({ ...prev, state: value === "all" ? null : value }))}
                      >
                        <SelectTrigger id="state" className="w-full bg-background border-input focus:ring-1 focus:ring-ring">
                          <SelectValue placeholder="Všechny stavy" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 bg-popover text-popover-foreground">
                          <SelectItem value="all" className="focus:bg-muted">Všechny stavy</SelectItem>
                          {ISSUE_STATES.map((state) => {
                            const stateColors = getStateColorClasses(state.value);
                            return (
                                <SelectItem key={state.value} value={state.value} className="focus:bg-muted">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full flex-shrink-0 border ${stateColors.circle}`}></div>
                                    {state.label}
                                  </div>
                                </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignee" className="text-sm font-medium">Přiřazená osoba</Label>
                      <Select
                          value={tempFilters.assignee || "all"}
                          onValueChange={(value) => setTempFilters(prev => ({ ...prev, assignee: value === "all" ? null : value }))}
                      >
                        <SelectTrigger id="assignee" className="w-full bg-background border-input focus:ring-1 focus:ring-ring">
                          <SelectValue placeholder="Všechny osoby" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 bg-popover text-popover-foreground">
                          <SelectItem value="all" className="focus:bg-muted">Všechny osoby</SelectItem>
                          {ISSUE_TEAM_MEMBERS.map((member) => (
                              <SelectItem key={member.value} value={member.value} className="focus:bg-muted">
                                {member.label}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="pt-2 mt-1 border-border gap-2 grid grid-cols-2">
                    <Button
                        variant="outline"
                        onClick={resetFilters}
                        className="w-full"
                        disabled={!areFiltersActive && !hasActiveFilters(tempFilters)}
                    >
                      <X className="h-4 w-4 mr-1.5" />
                      Resetovat
                    </Button>
                    <Button
                        className="w-full"
                        onClick={applyFilters}
                        disabled={!hasChangedFilters}
                    >
                      <Check className="h-4 w-4 mr-1.5" />
                      Použít filtry
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableCaption className="pr-4 pb-4 italic text-end">Celkem: {filteredAndSortedIssues.length} issues</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">
                    <div className="flex items-center cursor-pointer" onClick={() => requestSort('code')}>
                      Kód
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => requestSort('title')}>
                      Název
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="w-[150px]">
                    <div className="flex items-center cursor-pointer" onClick={() => requestSort('state')}>
                      Stav
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="w-[200px]">
                    <div className="flex items-center cursor-pointer" onClick={() => requestSort('last_modified')}>
                      Poslední úprava
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Akce</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedIssues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                        Žádné issues nebyly nalezeny
                      </TableCell>
                    </TableRow>
                ) : (
                    filteredAndSortedIssues.map((issue) => {
                      const stateColors = getStateColorClasses(issue.state);
                      return (
                          <TableRow key={issue.code}>
                            <TableCell className="font-mono text-xs">{issue.code}</TableCell>
                            <TableCell>{issue.title || issue.summary || "Bez názvu"}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full flex-shrink-0 border ${stateColors.circle}`}></div>
                                <span className={`text-sm ${stateColors.text}`}>
                                  {getStateLabel(issue.state)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {formatDate(issue.last_modified)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    asChild
                                >
                                  <Link to={`/projects/${projectCode}/issue/${issue.code}`} target="_blank">
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">Zobrazit</span>
                                  </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                >
                                  {/*TODO (NL): Přidat funkcionalitu pro editační tlačítko*/}
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Upravit</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
  );
}
