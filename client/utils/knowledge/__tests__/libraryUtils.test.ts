import { describe, it, expect } from 'vitest';
import { organizeDocumentsIntoFolders, formatTagName, getFolderWithDocuments } from '~/utils/knowledge/libraryUtils';

describe('libraryUtils', () => {
  it('formatTagName capitalizes the first letter', () => {
    expect(formatTagName('test')).toBe('Test');
    expect(formatTagName('Test')).toBe('Test');
    expect(formatTagName('tEST')).toBe('TEST');
  });

  it('organizeDocumentsIntoFolders returns empty array for empty input', () => {
    expect(organizeDocumentsIntoFolders([])).toEqual([]);
  });

  it('getFolderWithDocuments returns a folder object (mocked)', async () => {
    const folder = await getFolderWithDocuments('test');
    expect(folder).toHaveProperty('id');
    expect(folder).toHaveProperty('title');
    expect(folder).toHaveProperty('documents');
    expect(Array.isArray(folder.documents)).toBe(true);
  });
});
