import { Dispatch, SetStateAction } from "react";
import { Calendar, Edit2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { DatePicker } from "~/components/ui/DatePicker";
import { IssueFull } from "~/types";
import { ISSUE_STATES, ISSUE_TEAM_MEMBERS } from "~/lib/constants";
import { getInitials } from "~/utils/helpers";

interface IssueSettingsProps {
  editedIssue: IssueFull;
  setEditedIssue: Dispatch<SetStateAction<IssueFull>>;
}

export function IssueSettings({ editedIssue, setEditedIssue }: IssueSettingsProps) {
  return (
    <div className="space-y-6 bg-muted/30 p-6 rounded-lg">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Edit2 className="h-5 w-5 text-muted-foreground" />
        Nastavení issue
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Badge variant="outline" className="rounded-md bg-muted/50 h-5 w-5 p-0 flex items-center justify-center">
              <span className="sr-only">Stav</span>
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </Badge>
            Stav
          </label>
          <Select
            value={editedIssue.state}
            onValueChange={(value) => setEditedIssue((prev) => ({ ...prev, state: value }))}
          >
            <SelectTrigger>
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

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Avatar className="h-5 w-5 text-xs">
              <AvatarFallback className="bg-primary/10 text-primary">
                {editedIssue.assignee ? getInitials(editedIssue.assignee) : "?"}
              </AvatarFallback>
            </Avatar>
            Přiřazená osoba
          </label>
          <Select
            value={editedIssue.assignee || "none"}
            onValueChange={(value) =>
              setEditedIssue((prev) => ({
                ...prev,
                assignee: value === "none" ? "" : value,
              }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Vyber osobu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nikdo</SelectItem>
              {ISSUE_TEAM_MEMBERS.map((member) => (
                <SelectItem key={member.value} value={member.value}>
                  {member.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Termín dokončení
          </label>
          <DatePicker
            selected={editedIssue.due_date ? new Date(editedIssue.due_date) : undefined}
            onSelect={(date) =>
              setEditedIssue((prev) => ({
                ...prev,
                due_date: date ? date.toISOString() : undefined,
              }))}
          />
        </div>
      </div>
    </div>
  );
}
