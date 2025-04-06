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
import { Search, ArrowUpDown, Edit, Eye, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import {ISSUE_STATES} from "~/lib/constants";

type ProjectContext = {
  project: ProjectWithIssues;
  issues: IssueFull[];
};

export default function ProjectIssuesView() {
  const { project, issues } = useOutletContext<ProjectContext>();
  const { projectCode } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IssueFull | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc'
  });

  //TODO (NL): Přesunout do utils
  const requestSort = (key: keyof IssueFull) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedIssues = useMemo(() => {
    let filteredIssues = [...issues];

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredIssues = filteredIssues.filter(issue =>
          (issue.title?.toLowerCase().includes(lowerSearchTerm) ||
              issue.summary?.toLowerCase().includes(lowerSearchTerm) ||
              issue.code.toLowerCase().includes(lowerSearchTerm))
      );
    }

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
  }, [issues, searchTerm, sortConfig]);

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
            {/*TODO (NL): Přidat filtrační funkcionalitu*/}
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtrovat
            </Button>
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
