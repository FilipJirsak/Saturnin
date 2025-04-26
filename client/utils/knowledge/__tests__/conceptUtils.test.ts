if (typeof globalThis.window === 'undefined') {
  // @ts-ignore
  globalThis.window = globalThis;
}

let localStore: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => localStore[key] ?? null,
  setItem: (key: string, value: string) => { localStore[key] = value; },
  removeItem: (key: string) => { delete localStore[key]; },
  clear: () => { localStore = {}; },
  key: (i: number) => Object.keys(localStore)[i] ?? null,
  get length() { return Object.keys(localStore).length; }
} as Storage;

let sessionStore: Record<string, string> = {};
const mockSessionStorage = {
  getItem: (key: string) => sessionStore[key] ?? null,
  setItem: (key: string, value: string) => { sessionStore[key] = value; },
  removeItem: (key: string) => { delete sessionStore[key]; },
  clear: () => { sessionStore = {}; },
  key: (i: number) => Object.keys(sessionStore)[i] ?? null,
  get length() { return Object.keys(sessionStore).length; }
} as Storage;

Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

Object.defineProperty(globalThis, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true
});

import { describe, it, expect, beforeEach } from 'vitest';
import {
  initializeConceptsIfEmpty,
  saveConceptToLocalStorage,
  getConceptsFromLocalStorage,
  getConceptFromLocalStorage,
  deleteConceptFromLocalStorage,
  getRelationLabel,
  getRelationColor,
  filterConcepts,
  categorizeRelations,
  createNewConcept
} from '~/utils/knowledge/conceptUtils';

import type { Concept, RelatedConcept } from '~/types/knowledge';

describe('conceptUtils', () => {
  it('getRelationLabel returns correct label or key', () => {
    expect(getRelationLabel('is_a')).toBe('je typ');
    expect(getRelationLabel('unknown')).toBe('unknown');
  });

  it('getRelationColor returns correct color or default', () => {
    expect(getRelationColor('is_a')).toMatch(/^#/);
    expect(getRelationColor('unknown')).toBe('#6b7280');
  });

  it('filterConcepts filters by title, description, or tags', () => {
    const concepts: Concept[] = [
      { id: '1', title: 'Alpha', description: 'desc', tags: ['foo'], related: [], createdAt: '', lastModified: '', author: '' },
      { id: '2', title: 'Beta', description: 'desc2', tags: ['bar'], related: [], createdAt: '', lastModified: '', author: '' }
    ];
    expect(filterConcepts(concepts, 'Alpha')).toHaveLength(1);
    expect(filterConcepts(concepts, 'desc2')).toHaveLength(1);
    expect(filterConcepts(concepts, 'bar')).toHaveLength(1);
    expect(filterConcepts(concepts, '')).toHaveLength(2);
  });

  it('categorizeRelations groups by relation type', () => {
    const rels: RelatedConcept[] = [
      { id: '1', title: 'A', relation: 'is_a' },
      { id: '2', title: 'B', relation: 'has_a' }
    ];
    const grouped = categorizeRelations(rels);
    expect(grouped.is_a).toHaveLength(1);
    expect(grouped.has_a).toHaveLength(1);
  });

  it('createNewConcept creates a concept with defaults', () => {
    const concept = createNewConcept({ title: 'Test' }, 'user');
    expect(concept.title).toBe('Test');
    expect(concept.author).toBe('user');
    expect(concept.id).toMatch(/^concept-/);
  });
});

describe('conceptUtils localStorage CRUD', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    if (typeof window !== 'undefined') {
      (window as any).__CONCEPTS_DATA = undefined;
    }
    initializeConceptsIfEmpty();
  });

  it('initializeConceptsIfEmpty initializes storage if empty', () => {
    const concepts = getConceptsFromLocalStorage();
    expect(concepts.length).toBeGreaterThan(0);
    expect(concepts[0]).toHaveProperty('id');
  });

  it('saveConceptToLocalStorage saves and updates a concept', () => {
    const uniqueId = 'test-unique-id';
    const seedCount = getConceptsFromLocalStorage().length;
    expect(getConceptFromLocalStorage(uniqueId)).toBeNull();

    const concept = {
      id: uniqueId,
      title: 'A',
      relation: 'is_a',
      description: '',
      tags: [],
      related: [],
      lastModified: '',
      createdAt: '',
      author: '',
      isShared: false
    };
    saveConceptToLocalStorage(concept);

    let all = getConceptsFromLocalStorage();
    expect(all.length).toBe(seedCount + 1);
    expect(all.find(c => c.id === uniqueId)).toBeDefined();

    const updated = { ...concept, title: 'B' };
    saveConceptToLocalStorage(updated);

    all = getConceptsFromLocalStorage();
    expect(all.length).toBe(seedCount + 1);
    expect(all.find(c => c.id === uniqueId)?.title).toBe('B');
  });

  it('getConceptsFromLocalStorage returns seed array if nothing is stored', () => {
    const concepts = getConceptsFromLocalStorage();
    expect(concepts.length).toBeGreaterThan(0);
  });

  it('getConceptFromLocalStorage returns correct concept or null', () => {
    const uniqueId = 'test-unique-id';
    expect(getConceptFromLocalStorage(uniqueId)).toBeNull();

    const concept = {
      id: uniqueId,
      title: 'C',
      relation: 'has_a',
      description: '',
      tags: [],
      related: [],
      lastModified: '',
      createdAt: '',
      author: '',
      isShared: false
    };
    saveConceptToLocalStorage(concept);

    expect(getConceptFromLocalStorage(uniqueId)?.title).toBe('C');
    expect(getConceptFromLocalStorage('notfound')).toBeNull();
  });

  it('deleteConceptFromLocalStorage removes a concept', () => {
    const uniqueId = 'test-unique-id';
    const seedCount = getConceptsFromLocalStorage().length;
    expect(getConceptFromLocalStorage(uniqueId)).toBeNull();

    const concept = {
      id: uniqueId,
      title: 'D',
      relation: 'part_of',
      description: '',
      tags: [],
      related: [],
      lastModified: '',
      createdAt: '',
      author: '',
      isShared: false
    };
    saveConceptToLocalStorage(concept);
    expect(getConceptFromLocalStorage(uniqueId)).not.toBeNull();

    deleteConceptFromLocalStorage(uniqueId);
    expect(getConceptFromLocalStorage(uniqueId)).toBeNull();

    const after = getConceptsFromLocalStorage().length;
    expect(after).toBe(seedCount);
  });
});
