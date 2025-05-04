import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { Concept } from "~/types/knowledge";
import { useToast } from "~/hooks/use-toast";
import {
  createNewConcept,
  deleteConceptFromLocalStorage,
  getConceptsFromLocalStorage,
  saveConceptToLocalStorage,
} from "~/utils/knowledge/conceptUtils";

interface UseConceptProps {
  initialConcepts?: Concept[];
  currentUser?: string;
}

export function useConcepts({ initialConcepts = [], currentUser = "Uživatel" }: UseConceptProps = {}) {
  const [concepts, setConcepts] = useState<Concept[]>(initialConcepts);
  const [isCreatingConcept, setIsCreatingConcept] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedConcepts = getConceptsFromLocalStorage();
    if (storedConcepts.length > 0) {
      setConcepts(storedConcepts);
    }
  }, []);

  const toggleConceptExpand = (conceptId: string) => {
    setConcepts((prevConcepts) =>
      prevConcepts.map((concept) => {
        if (concept.id === conceptId) {
          return { ...concept, isExpanded: !concept.isExpanded };
        }
        return concept;
      })
    );
  };

  const handleCreateConcept = async (newConcept: Partial<Concept>) => {
    setIsLoading(true);
    try {
      const createdConcept = createNewConcept(newConcept, currentUser);
      saveConceptToLocalStorage(createdConcept);
      setConcepts([createdConcept, ...concepts]);
      setIsCreatingConcept(false);

      setTimeout(() => {
        navigate(`/knowledge/concepts/${createdConcept.id}`);
      }, 300);

      toast({
        title: "Koncept vytvořen",
        description: "Nový koncept byl úspěšně vytvořen",
        variant: "success",
      });
    } catch (error) {
      console.error("Chyba při vytváření konceptu:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se vytvořit koncept",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateConcept = async (updatedConcept: Concept) => {
    setIsLoading(true);
    try {
      const updatedDate = new Date().toISOString();
      const conceptToUpdate = {
        ...updatedConcept,
        lastModified: updatedDate,
      };

      saveConceptToLocalStorage(conceptToUpdate);
      setConcepts((prevConcepts) =>
        prevConcepts.map((concept) => concept.id === conceptToUpdate.id ? conceptToUpdate : concept)
      );

      toast({
        title: "Koncept aktualizován",
        description: "Změny byly úspěšně uloženy",
        variant: "success",
      });

      return true;
    } catch (error) {
      console.error("Chyba při aktualizaci konceptu:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se aktualizovat koncept",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConcept = async (conceptId: string) => {
    setIsLoading(true);
    try {
      deleteConceptFromLocalStorage(conceptId);
      setConcepts((prevConcepts) => prevConcepts.filter((concept) => concept.id !== conceptId));

      toast({
        title: "Koncept smazán",
        description: "Koncept byl úspěšně odstraněn",
        variant: "success",
      });

      return true;
    } catch (error) {
      console.error("Chyba při mazání konceptu:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se smazat koncept",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    concepts,
    setConcepts,
    isCreatingConcept,
    setIsCreatingConcept,
    isLoading,
    toggleConceptExpand,
    handleCreateConcept,
    handleUpdateConcept,
    handleDeleteConcept,
  };
}
