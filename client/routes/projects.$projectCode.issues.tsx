import { useOutletContext, Link, useParams } from "@remix-run/react";
import { ProjectWithIssues, IssueFull } from "~/types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
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
import { Search, ArrowUpDown, Edit, Eye, Filter, X } from "lucide-react";
import { useState, useMemo } from "react";
import { ISSUE_STATES, ISSUE_TEAM_MEMBERS } from "~/lib/constants";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

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
  const [filters, setFilters] = useState<Filters>({
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

  const requestSort = (key: keyof IssueFull) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedIssues = useMemo(() => {
    let filteredIssues = [...issues];

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredIssues = filteredIssues.filter(issue =>
          (issue.title?.toLowerCase().includes(lowerSearchTerm) ||
              issue.summary?.toLowerCase().includes(lowerSearchTerm) ||
              issue.code.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // Apply state filter
    if (filters.state) {
      filteredIssues = filteredIssues.filter(issue => issue.state === filters.state);
    }

    // Apply assignee filter
    if (filters.assignee) {
      filteredIssues = filteredIssues.filter(issue => issue.assignee === filters.assignee);
    }

    // Apply sorting
    if (sortConfig.key) {
      filteredIssues.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof IssueFull];
        const bValue = b[sortConfig.key as keyof IssueFull];

        if (aValue == null && bValue == null) return 0;

        if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
        if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;

        const aStr = String(aValue);
        const bStr = String(bValue);

        if (aStr < bStr) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aStr > bStr) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredIssues;
  }, [issues, searchTerm, filters, sortConfig]);

  const getStateLabel = (stateValue: string) => {
    const stateObj = ISSUE_STATES.find(s => s.value === stateValue);
    return stateObj ? stateObj.label : stateValue;
  };

  const getStateVariant = (state: string) => {
    switch (state) {
      case 'new':
        return 'outline';
      case 'to_do':
        return 'secondary';
      case 'in_progress':
        return 'default';
      case 'done':
        return 'success';
      default:
        return 'outline';
    }
  };

  const resetFilters = () => {
    setFilters({
      state: null,
      assignee: null
    });
  };

  const hasActiveFilters = filters.state !== null || filters.assignee !== null;

  return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Seznam issues</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                  placeholder="Vyhledat issue..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={hasActiveFilters ? "default" : "outline"} size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtrovat
                  {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-1">
                        {Object.values(filters).filter(Boolean).length}
                      </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium leading-none">Filtry</h4>
                    {hasActiveFilters && (
                        <Button variant="ghost" size="sm" className="h-8 px-2" onClick={resetFilters}>
                          <X className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <Label htmlFor="state">Stav</Label>
                      <Select
                          value={filters.state || ""}
                          onValueChange={(value) => setFilters(prev => ({ ...prev, state: value || null }))}
                      >
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Všechny stavy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Všechny stavy</SelectItem>
                          {ISSUE_STATES.map((state) => (
                              <SelectItem key={state.value} value={state.value}>
                                {state.label}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="assignee">Přiřazená osoba</Label>
                      <Select
                          value={filters.assignee || ""}
                          onValueChange={(value) => setFilters(prev => ({ ...prev, assignee: value || null }))}
                      >
                        <SelectTrigger id="assignee">
                          <SelectValue placeholder="Všechny osoby" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Všechny osoby</SelectItem>
                          {ISSUE_TEAM_MEMBERS.map((member) => (
                              <SelectItem key={member.value} value={member.value}>
                                {member.label}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableCaption>Celkem: {filteredAndSortedIssues.length} issues</TableCaption>
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
                    filteredAndSortedIssues.map((issue) => (
                        <TableRow key={issue.code}>
                          <TableCell className="font-mono text-xs">{issue.code}</TableCell>
                          <TableCell>{issue.title || issue.summary || "Bez názvu"}</TableCell>
                          <TableCell>
                            <Badge variant={getStateVariant(issue.state)}>
                              {getStateLabel(issue.state)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {issue.last_modified
                                ? format(new Date(issue.last_modified), 'dd. MM. yyyy HH:mm', { locale: cs })
                                : "Neznámé datum"}
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
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
  );
}
