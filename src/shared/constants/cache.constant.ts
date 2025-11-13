export const CacheKey = {
  UsageDailyPrefix: 'usage:daily:',
  UsageTop24h: 'usage:top:24h',
} as const;

export const CacheChannel = {
  LogCreated: 'log:created',
} as const;

export const UsageQuery = {
  DailyUsageDays: 7,
  TopClientsHours: 24,
  TopClientsLimit: 3,
} as const;
