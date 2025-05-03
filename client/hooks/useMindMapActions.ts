import { useNavigate } from "@remix-run/react";
import { MindMap } from "~/types/knowledge";
import {
  deleteMindMap,
  shareMindMap,
  duplicateMindMap,
  updateMindMap
} from "~/utils/knowledge/mindmapUtils";
import { useToast } from "~/hooks/use-toast";

export function useMindMapActions(onSuccess?: (action: string, map?: MindMap) => void) {
  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * Deletes a mind map
   * @param id ID of the map to delete
   */
  const handleDeleteMindMap = async (id: string) => {
    try {
      const success = await deleteMindMap(id);

      if (success) {
        toast({
          title: "Myšlenková mapa smazána",
          description: "Myšlenková mapa byla úspěšně smazána.",
          variant: "success"
        });

        if (onSuccess) {
          onSuccess("delete", { id } as MindMap);
        }
      } else {
        toast({
          title: "Chyba při mazání mapy",
          description: "Nepodařilo se smazat myšlenkovou mapu. Zkus to prosím znovu.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Chyba při mazání myšlenkové mapy ${id}:`, error);
      toast({
        title: "Chyba při mazání mapy",
        description: "Nepodařilo se smazat myšlenkovou mapu. Zkus to prosím znovu.",
        variant: "destructive"
      });
    }
  };

  /**
   * Duplicates a mind map
   * @param id ID of the map to duplicate
   */
  const handleDuplicateMindMap = async (id: string) => {
    try {
      const duplicatedMap = await duplicateMindMap(id);

      if (duplicatedMap) {
        toast({
          title: "Myšlenková mapa duplikována",
          description: "Myšlenková mapa byla úspěšně duplikována.",
          variant: "success"
        });

        if (onSuccess) {
          onSuccess("duplicate", duplicatedMap);
        }

        await new Promise(resolve => setTimeout(resolve, 200));

        navigate(`/knowledge/mindmaps/${duplicatedMap.id}`);

        return duplicatedMap;
      } else {
        toast({
          title: "Chyba při duplikování mapy",
          description: "Nepodařilo se duplikovat myšlenkovou mapu. Zkus to prosím znovu.",
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error(`Chyba při duplikování myšlenkové mapy ${id}:`, error);
      toast({
        title: "Chyba při duplikování mapy",
        description: "Nepodařilo se duplikovat myšlenkovou mapu. Zkus to prosím znovu.",
        variant: "destructive"
      });
      return null;
    }
  };

  /**
   * Toggles the public visibility of a mind map
   * @param id ID of the map
   * @param isPublic Current visibility status to toggle (true/false)
   */
  const handleShareMindMap = async (id: string, isPublic: boolean) => {
    try {
      const newIsPublic = !isPublic;
      const success = await shareMindMap(id, isPublic);

      if (success) {
        toast({
          title: newIsPublic ? "Mapa zveřejněna" : "Mapa zneveřejněna",
          description: newIsPublic
              ? "Myšlenková mapa je nyní veřejně dostupná."
              : "Myšlenková mapa je nyní soukromá.",
          variant: "success"
        });

        if (onSuccess) {
          onSuccess("share", { id, isPublic: newIsPublic } as MindMap);
        }
      } else {
        toast({
          title: "Chyba při sdílení mapy",
          description: "Nepodařilo se změnit nastavení sdílení mapy. Zkus to prosím znovu.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Chyba při sdílení myšlenkové mapy ${id}:`, error);
      toast({
        title: "Chyba při sdílení mapy",
        description: "Nepodařilo se změnit nastavení sdílení mapy. Zkus to prosím znovu.",
        variant: "destructive"
      });
    }
  };

  /**
   * Updates a mind map
   * @param id ID of the map to update
   * @param data Updated map data
   */
  const handleUpdateMindMap = async (id: string, data: Partial<MindMap>) => {
    try {
      const success = await updateMindMap(id, data);

      if (success) {
        toast({
          title: "Myšlenková mapa aktualizována",
          description: "Změny byly úspěšně uloženy.",
          variant: "success"
        });

        if (onSuccess) {
          onSuccess("update", { id, ...data } as MindMap);
        }

        return true;
      } else {
        toast({
          title: "Chyba při ukládání mapy",
          description: "Nepodařilo se uložit změny. Zkus to prosím znovu.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error(`Chyba při aktualizaci myšlenkové mapy ${id}:`, error);
      toast({
        title: "Chyba při ukládání mapy",
        description: "Nepodařilo se uložit změny. Zkus to prosím znovu.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    handleDeleteMindMap,
    handleDuplicateMindMap,
    handleShareMindMap,
    handleUpdateMindMap
  };
}
