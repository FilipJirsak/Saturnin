import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { KnowledgeTag } from "~/types/knowledge";
import { MOCK_TAGS, COLOR_PRESETS } from "~/lib/data";
import {TagsHeader} from "~/features/knowledge/tags/TagsHeader";
import {ContentStatsCard, PopularTagsCard, TagsCountCard} from "~/features/knowledge/tags/TagsStatsCards";
import {TagsTable} from "~/features/knowledge/tags/TagsTable";
import {TagsFormDialog} from "~/features/knowledge/tags/TagsFormDialog";
import {MetaFunction} from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Znalosti - Tagy | Saturnin" },
    { name: "description", content: "Tvá znalostní báze" },
  ];
};

export default function KnowledgeTagsPage() {
  const [tags, setTags] = useState<KnowledgeTag[]>(MOCK_TAGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTagForm, setShowTagForm] = useState(false);
  const [newTag, setNewTag] = useState<Partial<KnowledgeTag>>({
    name: "",
    description: "",
    color: COLOR_PRESETS[0],
  });
  const [editMode, setEditMode] = useState(false);

  const filteredTags = tags.filter(tag =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = tags.reduce(
      (acc, tag) => ({
        documents: acc.documents + tag.count.documents,
        concepts: acc.concepts + tag.count.concepts,
        mindmaps: acc.mindmaps + tag.count.mindmaps,
      }),
      { documents: 0, concepts: 0, mindmaps: 0 }
  );

  const handleSaveTag = () => {
    if (!newTag.name) return;

    if (editMode && newTag.id) {
      setTags(prevTags =>
          prevTags.map(tag =>
              tag.id === newTag.id
                  ? { ...tag, name: newTag.name!, description: newTag.description, color: newTag.color }
                  : tag
          )
      );
    } else {
      const currentDate = new Date().toISOString();
      const newTagComplete: KnowledgeTag = {
        id: `tag-${Date.now()}`,
        name: newTag.name,
        description: newTag.description,
        color: newTag.color,
        count: {
          documents: 0,
          concepts: 0,
          mindmaps: 0,
        },
        createdAt: currentDate,
      };

      setTags(prevTags => [...prevTags, newTagComplete]);
    }

    resetForm();
  };

  const handleEditTag = (tag: KnowledgeTag) => {
    setNewTag(tag);
    setEditMode(true);
    setShowTagForm(true);
  };

  const handleDeleteTag = (tagId: string) => {
    setTags(prevTags => prevTags.filter(tag => tag.id !== tagId));
  };

  const resetForm = () => {
    setNewTag({
      name: "",
      description: "",
      color: COLOR_PRESETS[0],
    });
    setShowTagForm(false);
    setEditMode(false);
  };

  const openTagForm = () => {
    setShowTagForm(true);
  };

  return (
      <div className="space-y-6">
        <TagsHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            openTagForm={openTagForm}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
          <ContentStatsCard totalItems={totalItems} />
          <TagsCountCard tags={tags} />
          <PopularTagsCard tags={tags} totalItems={totalItems} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Seznam tagů</CardTitle>
            <CardDescription>
              Správa a organizace tagů ve znalostní bázi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TagsTable
                filteredTags={filteredTags}
                tagsCount={tags.length}
                onEditTag={handleEditTag}
                onDeleteTag={handleDeleteTag}
            />
          </CardContent>
        </Card>

        <TagsFormDialog
            open={showTagForm}
            setOpen={setShowTagForm}
            newTag={newTag}
            setNewTag={setNewTag}
            editMode={editMode}
            handleSaveTag={handleSaveTag}
            resetForm={resetForm}
        />
      </div>
  );
}
