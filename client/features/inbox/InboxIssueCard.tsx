import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { IssueFull, ProjectFull } from "~/types";
import { ArrowRight, File, FileText, Link, Loader2 } from "lucide-react";
import { formatDate, formatRelativeTime } from "~/utils/dateUtils";

interface IssueCardProps {
  issue: IssueFull;
  projects: ProjectFull[];
  onAssign: (issueCode: string, projectCode: string) => void;
  isAssigning: boolean;
}

export function InboxIssueCard({
  issue,
  projects,
  onAssign,
  isAssigning,
}: IssueCardProps) {
  const [selectedProject, setSelectedProject] = useState("");

  const handleAssign = () => {
    if (selectedProject) {
      onAssign(issue.code, selectedProject);
    }
  };

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-x-2">
            <FileText className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-medium">
              {issue.title || "Nepojmenované issue"}
            </CardTitle>
          </div>
          <Badge variant="success">
            {issue.state === "new" ? "Nový" : issue.state}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        {issue.description && (
          <p className="text-sm text-muted-foreground">
            {issue.description}
          </p>
        )}
        {issue.data?.link && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link className="h-4 w-4" />
            <a href={issue.data.link} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
              {issue.data.link}
            </a>
          </div>
        )}
        {issue.data?.attachments && issue.data.attachments.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Přílohy:</p>
            <ul className="space-y-1">
              {issue.data.attachments.map((file, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <File className="h-4 w-4" />
                  <span className="truncate">{file.name}</span>
                  <span className="text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        <div className="text-xs text-muted-foreground">
          <span title={formatDate(issue.last_modified)}>
            {formatRelativeTime(issue.last_modified)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={selectedProject}
            onValueChange={setSelectedProject}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vybrat projekt" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem
                  key={project.code}
                  value={project.code}
                >
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            onClick={handleAssign}
            disabled={!selectedProject || isAssigning}
          >
            {isAssigning ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
