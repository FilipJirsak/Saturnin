import { describe, it, expect } from 'vitest';
import {
  filterActivitiesBySearch,
  filterActivitiesByTab,
  sortActivitiesByDate,
  getLatestIssues,
  createTooltipStyle,
  getAxisConfig,
  getGridConfig
} from '~/utils/dashboardUtils';
import { ACTIVITY_TABS, ACTIVITY_TYPES, ACTIVITY_STATUSES } from '~/lib/constants';
import type { Activity } from '~/types/dashboard';

describe('dashboardUtils', () => {
  const mockActivities: Activity[] = [
    {
      id: '1',
      type: ACTIVITY_TYPES.ISSUE,
      title: 'Test Issue',
      description: 'Test issue description',
      timestamp: '2024-01-01T00:00:00Z',
      user: { name: 'John Doe' },
      status: ACTIVITY_STATUSES.OPEN,
      priority: 'high'
    },
    {
      id: '2',
      type: ACTIVITY_TYPES.DOCUMENT,
      title: 'Test Document',
      description: 'Test document description',
      timestamp: '2024-01-02T00:00:00Z',
      user: { name: 'Jane Smith' }
    },
    {
      id: '3',
      type: ACTIVITY_TYPES.MESSAGE,
      title: 'Test Message',
      description: 'Test message description',
      timestamp: '2024-01-03T00:00:00Z',
      user: { name: 'Bob Johnson' }
    },
    {
      id: '4',
      type: ACTIVITY_TYPES.ISSUE,
      title: 'Another Issue',
      description: 'Another issue description',
      timestamp: '2024-01-04T00:00:00Z',
      user: { name: 'John Doe' },
      status: ACTIVITY_STATUSES.IN_PROGRESS,
      priority: 'medium'
    }
  ];

  describe('filterActivitiesBySearch', () => {
    it('should return all activities when search query is empty', () => {
      const result = filterActivitiesBySearch(mockActivities, '');
      expect(result).toHaveLength(4);
    });

    it('should filter activities by title', () => {
      const result = filterActivitiesBySearch(mockActivities, 'Test');
      expect(result).toHaveLength(3);
      expect(result.map(a => a.id)).toEqual(['1', '2', '3']);
    });

    it('should filter activities by description', () => {
      const result = filterActivitiesBySearch(mockActivities, 'description');
      expect(result).toHaveLength(4);
    });

    it('should filter activities by user name', () => {
      const result = filterActivitiesBySearch(mockActivities, 'John');
      expect(result).toHaveLength(3);
      expect(result.map(a => a.id)).toEqual(['1', '3', '4']);
    });

    it('should be case insensitive', () => {
      const result = filterActivitiesBySearch(mockActivities, 'test');
      expect(result).toHaveLength(3);
    });
  });

  describe('filterActivitiesByTab', () => {
    it('should return all activities for RECENT tab', () => {
      const result = filterActivitiesByTab(mockActivities, ACTIVITY_TABS.RECENT);
      expect(result).toHaveLength(4);
    });

    it('should filter issues for ISSUES tab', () => {
      const result = filterActivitiesByTab(mockActivities, ACTIVITY_TABS.ISSUES);
      expect(result).toHaveLength(2);
      expect(result.every(a => a.type === ACTIVITY_TYPES.ISSUE)).toBe(true);
    });

    it('should filter knowledge items for KNOWLEDGE tab', () => {
      const result = filterActivitiesByTab(mockActivities, ACTIVITY_TABS.KNOWLEDGE);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(ACTIVITY_TYPES.DOCUMENT);
    });

    it('should filter messages for MESSAGES tab', () => {
      const result = filterActivitiesByTab(mockActivities, ACTIVITY_TABS.MESSAGES);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(ACTIVITY_TYPES.MESSAGE);
    });
  });

  describe('sortActivitiesByDate', () => {
    it('should sort activities by timestamp in descending order', () => {
      const result = sortActivitiesByDate(mockActivities);
      expect(result.map(a => a.id)).toEqual(['4', '3', '2', '1']);
    });
  });

  describe('getLatestIssues', () => {
    it('should return latest issues with default limit', () => {
      const result = getLatestIssues(mockActivities);
      expect(result).toHaveLength(2);
      expect(result.map(a => a.id)).toEqual(['4', '1']);
    });

    it('should respect custom limit', () => {
      const result = getLatestIssues(mockActivities, 1);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('4');
    });

    it('should return empty array when no issues found', () => {
      const nonIssueActivities = mockActivities.filter(a => a.type !== ACTIVITY_TYPES.ISSUE);
      const result = getLatestIssues(nonIssueActivities);
      expect(result).toHaveLength(0);
    });
  });

  describe('createTooltipStyle', () => {
    it('should return correct tooltip style object', () => {
      const result = createTooltipStyle();
      expect(result).toEqual({
        backgroundColor: 'hsl(var(--background))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '6px',
        fontSize: '12px'
      });
    });
  });

  describe('getAxisConfig', () => {
    it('should return correct axis config object', () => {
      const result = getAxisConfig();
      expect(result).toEqual({
        stroke: 'hsl(var(--muted-foreground))',
        fontSize: 12,
        tickMargin: 8
      });
    });
  });

  describe('getGridConfig', () => {
    it('should return correct grid config object', () => {
      const result = getGridConfig();
      expect(result).toEqual({
        strokeDasharray: '3 3',
        stroke: 'hsl(var(--border))'
      });
    });
  });
});
