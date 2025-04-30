import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Edit, FileText, Mail, Save, Upload, X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { User } from "~/types";
import { getInitials } from "~/utils/helpers";
import { formatDate } from "~/utils/dateUtils";

// TODO (NL): Implementovat aktualizaci profilu na backendu
// TODO (NL): Upravit texty, změnit některá data na dynamická
// TODO (NL): Přidat validaci formuláře
// TODO (NL): Přidat podporu pro sociální sítě
interface ProfileSectionProps {
  user: User;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setAvatarFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      bio: "",
    });
    setAvatarPreview(user.avatar);
    setAvatarFile(null);
    setIsEditing(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
        <div className="space-y-1">
          <CardTitle>Profil</CardTitle>
          <CardDescription>
            {isEditing ? "Zde si můžeš upravit své osobní údaje" : "Tvoje osobní informace"}
          </CardDescription>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="ml-auto"
          >
            <Edit className="h-4 w-4 mr-2" />
            Upravit
          </Button>
        )}
      </CardHeader>

      {isEditing
        ? (
          <CardContent className="space-y-6 pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-24 w-24 rounded-lg">
                  <AvatarImage src={avatarPreview} alt={formData.name} />
                  <AvatarFallback className="rounded-lg text-xl">
                    {getInitials(formData.name)}
                  </AvatarFallback>
                </Avatar>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={triggerFileInput}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Nahrát avatar
                </Button>

                {
                  /*{avatarFile && (
                      <p className="text-xs text-muted-foreground">
                        Vybrán soubor: {avatarFile.name}
                      </p>
                  )}*/
                }
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Jméno</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">O mně</Label>
                  <textarea
                    id="bio"
                    className="w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Napiš něco o sobě..."
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <CardFooter className="flex justify-between p-0 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Zrušit
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Uložit změny
              </Button>
            </CardFooter>
          </CardContent>
        )
        : (
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-32 w-32 rounded-full border-4 border-primary/10">
                  <AvatarImage src={avatarPreview} alt={formData.name} className="object-cover" />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {getInitials(formData.name)}
                  </AvatarFallback>
                </Avatar>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1">
                  Uživatel
                </Badge>
              </div>

              <div className="flex-1">
                <div className="grid gap-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-semibold tracking-tight">{formData.name}</h3>
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{formData.email}</span>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-4 mt-4">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>O mně</span>
                    </div>

                    <div className="text-sm">
                      {formData.bio ? <p>{formData.bio}</p> : (
                        <p className="text-muted-foreground italic">
                          Pro přidání informací o sobě klikni na tlačítko Upravit.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {/*TODO (NL): Zobrazit další data?*/}
                    <div className="flex items-center gap-2 text-sm rounded-lg bg-secondary/10 text-secondary-foreground px-3 py-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span>Aktivní</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm rounded-lg bg-secondary/10 text-secondary-foreground px-3 py-1.5">
                      {/*TODO (NL): Doplnit reálné členství*/}
                      <span>Člen od: {formatDate("2025-01-13")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
    </Card>
  );
}
