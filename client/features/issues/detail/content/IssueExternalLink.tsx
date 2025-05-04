import { Dispatch, SetStateAction } from "react";
import { ArrowUpRight, LinkIcon } from "lucide-react";
import { Input } from "~/components/ui/input";
import { IssueFull } from "~/types";

// TODO (NL): Přidat podporu pro více externích odkazů
interface IssueExternalLinkProps {
  link?: string;
  isEditing: boolean;
  setEditedIssue: Dispatch<SetStateAction<IssueFull>>;
}

export function IssueExternalLink({ link, isEditing, setEditedIssue }: IssueExternalLinkProps) {
  if (!isEditing && !link) {
    return null;
  }

  const formatUrl = (url: string): string => {
    if (!url) return "";

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `https://${url}`;
  };

  const handleLinkChange = (value: string) => {
    setEditedIssue((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        link: value,
      },
    }));
  };

  const formattedLink = link ? formatUrl(link) : "";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <LinkIcon className="h-4 w-4" />
        <span>Externí odkaz</span>
      </div>
      {isEditing
        ? (
          <Input
            placeholder="Zadejte URL (např. example.com)"
            value={link || ""}
            onChange={(e) => handleLinkChange(e.target.value)}
            className="border-none bg-muted/50 focus-visible:ring-2"
          />
        )
        : link && (
          <a
            href={formattedLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline bg-muted/50 p-3 rounded-lg transition-colors duration-200 hover:bg-muted"
          >
            <span className="truncate">{link}</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
    </div>
  );
}
