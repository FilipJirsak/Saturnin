import { MindMap, NewMindMap } from "~/types/knowledge";
import { NODE_COLORS } from "~/lib/constants";
import { MOCK_MINDMAPS } from "~/lib/data";

/**
 * Creates a new mind map with the provided data
 * @param data - New mind map data
 * @returns Promise with created MindMap object or null if creation failed
 */
export async function createMindMap(data: NewMindMap): Promise<MindMap | null> {
  // TODO (NL): Implementovat skutečné API volání
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const color = NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)];

    const newMindMap: MindMap = {
      id: `mindmap-${Date.now()}`,
      title: data.title,
      description: data.description,
      tags: data.tags,
      author: data.author,
      color,
      thumbnail: color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodeCount: 1,
      isPublic: false,
      viewMode: "network",
      nodes: [
        {
          id: `node-${Date.now()}`,
          text: data.title,
          x: 250,
          y: 200,
          color,
        },
      ],
      connections: [],
    };

    saveMindMapToLocalStorage(newMindMap);

    return newMindMap;
  } catch (error) {
    console.error("Chyba při vytváření myšlenkové mapy:", error);
    return null;
  }
}

/**
 * Updates an existing mind map
 * @param id - ID of the mind map to update
 * @param data - Updated mind map data
 * @returns Promise with boolean indicating success
 */
export async function updateMindMap(id: string, data: Partial<MindMap>): Promise<boolean> {
  try {
    let map = getMindMapFromLocalStorage(id);

    if (!map) {
      const mockMap = MOCK_MINDMAPS.find((m) => m.id === id);
      if (!mockMap) {
        console.error(`Mapa s ID ${id} nebyla nalezena`);
        return false;
      }
      map = { ...mockMap };
    }

    const updatedMap = {
      ...map,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    saveMindMapToLocalStorage(updatedMap);

    const mockIndex = MOCK_MINDMAPS.findIndex((m) => m.id === id);
    if (mockIndex >= 0) {
      MOCK_MINDMAPS[mockIndex] = {
        ...MOCK_MINDMAPS[mockIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };
    }

    return true;
  } catch (error) {
    console.error(`Chyba při aktualizaci myšlenkové mapy ${id}:`, error);
    return false;
  }
}

/**
 * Deletes a mind map by ID
 * @param id - ID of the mind map to delete
 * @returns Promise with boolean indicating success
 */
export async function deleteMindMap(id: string): Promise<boolean> {
  try {
    const removed = removeMindMapFromLocalStorage(id);

    const mockIndex = MOCK_MINDMAPS.findIndex((m) => m.id === id);
    if (mockIndex >= 0) {
      MOCK_MINDMAPS.splice(mockIndex, 1);
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    return true;
  } catch (error) {
    console.error(`Chyba při mazání myšlenkové mapy ${id}:`, error);
    return false;
  }
}

/**
 * Duplicates an existing mind map
 * @param id - ID of the mind map to duplicate
 * @returns Promise with the new ID or null if failed
 */
export async function duplicateMindMap(id: string): Promise<MindMap | null> {
  try {
    let originalMap = getMindMapFromLocalStorage(id);

    if (!originalMap) {
      originalMap = MOCK_MINDMAPS.find((m) => m.id === id) ?? null;
    }

    if (!originalMap) {
      console.error(`Mapa s ID ${id} nebyla nalezena pro duplikaci`);
      return null;
    }

    const clonedMap = JSON.parse(JSON.stringify(originalMap));
    const newId = `mindmap-${Date.now()}`;

    const duplicatedMap: MindMap = {
      ...clonedMap,
      id: newId,
      title: `${clonedMap.title} (kopie)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: false,
    };
    saveMindMapToLocalStorage(duplicatedMap);

    await new Promise((resolve) => setTimeout(resolve, 300));

    return duplicatedMap;
  } catch (error) {
    console.error(`Chyba při duplikování myšlenkové mapy ${id}:`, error);
    return null;
  }
}

/**
 * Generates a thumbnail for a mind map
 * @param mindmap - Mind map data
 * @returns A color value or thumbnail URL
 */
export function generateMindMapThumbnail(mindmap: Partial<MindMap>): string {
  // TODO (NL): Implementovat skutečné generování náhledů

  if (mindmap.color) {
    return mindmap.color;
  }

  const colorOptions = NODE_COLORS;
  const title = mindmap.title || "Untitled";

  let hashValue = 0;
  for (let i = 0; i < title.length; i++) {
    hashValue = (hashValue + title.charCodeAt(i)) % colorOptions.length;
  }

  return colorOptions[hashValue];
}

/**
 * Shares or unshares a mind map
 * @param id - ID of the mind map
 * @param isPublic - Whether the mind map should be public
 * @returns Promise with boolean indicating success
 */
export async function shareMindMap(id: string, isPublic: boolean): Promise<boolean> {
  try {
    const map = getMindMapFromLocalStorage(id);

    if (map) {
      map.isPublic = !isPublic;
      map.updatedAt = new Date().toISOString();

      saveMindMapToLocalStorage(map);

      const mockIndex = MOCK_MINDMAPS.findIndex((m) => m.id === id);
      if (mockIndex >= 0) {
        MOCK_MINDMAPS[mockIndex] = {
          ...MOCK_MINDMAPS[mockIndex],
          isPublic: !isPublic,
          updatedAt: new Date().toISOString(),
        };
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    return true;
  } catch (error) {
    console.error(`Chyba při sdílení myšlenkové mapy ${id}:`, error);
    return false;
  }
}

/**
 * Saves a mind map to local storage
 * @param mindmap - Mind map to save
 */
export function saveMindMapToLocalStorage(mindmap: MindMap): void {
  try {
    let storedMaps = [];
    const storedMapsJson = localStorage.getItem("mindmaps");

    if (storedMapsJson) {
      try {
        storedMaps = JSON.parse(storedMapsJson);
      } catch (err) {
        console.error("Chyba při parsování dat z localStorage:", err);
        storedMaps = [];
      }
    }

    if (!Array.isArray(storedMaps)) {
      console.warn("Data v localStorage nejsou pole, resetuji...");
      storedMaps = [];
    }

    const existingIndex = storedMaps.findIndex((m: MindMap) => m.id === mindmap.id);

    if (existingIndex >= 0) {
      storedMaps[existingIndex] = mindmap;
    } else {
      storedMaps.unshift(mindmap);
    }

    localStorage.setItem("mindmaps", JSON.stringify(storedMaps));
    sessionStorage.setItem("mindmaps", JSON.stringify(storedMaps));

    if (typeof window !== "undefined") {
      (window as any).__MINDMAPS_DATA = storedMaps;
    }
  } catch (error) {
    console.error("Chyba při ukládání mapy do localStorage:", error);
  }
}

/**
 * Gets all mind maps from local storage
 * @returns Array of mind maps
 */
export function getMindMapsFromLocalStorage(): MindMap[] {
  try {
    let maps: MindMap[] = [];
    let source = "none";

    const localStorageData = localStorage.getItem("mindmaps");
    if (localStorageData) {
      try {
        const parsed = JSON.parse(localStorageData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          maps = parsed;
          source = "localStorage";
        }
      } catch (e) {
        console.error("Chyba při parsování localStorage:", e);
      }
    }

    if (maps.length === 0) {
      const sessionData = sessionStorage.getItem("mindmaps");
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            maps = parsed;
            source = "sessionStorage";

            localStorage.setItem("mindmaps", sessionData);
          }
        } catch (e) {
          console.error("Chyba při parsování sessionStorage:", e);
        }
      }
    }

    if (maps.length > 0) {
      const mapsJson = JSON.stringify(maps);

      if (source !== "localStorage") {
        localStorage.setItem("mindmaps", mapsJson);
      }

      if (source !== "sessionStorage") {
        sessionStorage.setItem("mindmaps", mapsJson);
      }

      if (typeof window !== "undefined") {
        (window as any).__MINDMAPS_DATA = maps;
      }
    } else {
      localStorage.removeItem("mindmaps");
      sessionStorage.removeItem("mindmaps");
      if (typeof window !== "undefined") {
        (window as any).__MINDMAPS_DATA = [];
      }
    }

    return maps;
  } catch (error) {
    console.error("Chyba při načítání map z úložišť:", error);
    return [];
  }
}

export function getMindMapFromLocalStorage(id: string): MindMap | null {
  try {
    const maps = getMindMapsFromLocalStorage();
    const map = maps.find((m: MindMap) => m.id === id);

    return map || null;
  } catch (error) {
    console.error(`Chyba při načítání mapy ${id} z localStorage:`, error);
    return null;
  }
}

export function removeMindMapFromLocalStorage(id: string): boolean {
  try {
    const maps = getMindMapsFromLocalStorage();
    const initialLength = maps.length;

    const filteredMaps = maps.filter((m: MindMap) => m.id !== id);

    if (filteredMaps.length < initialLength) {
      localStorage.setItem("mindmaps", JSON.stringify(filteredMaps));
      sessionStorage.setItem("mindmaps", JSON.stringify(filteredMaps));

      if (typeof window !== "undefined") {
        (window as any).__MINDMAPS_DATA = filteredMaps;
      }

      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(`Chyba při odstraňování mapy ${id} z localStorage:`, error);
    return false;
  }
}
