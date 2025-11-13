export class StringUtil {
  static camelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '')
      .replace(/_/g, '');
  }

  static snakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  }

  static camelCaseKey<T extends Record<string, unknown>>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) =>
        StringUtil.camelCaseKey(item as Record<string, unknown>),
      ) as unknown as T;
    }

    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = StringUtil.camelCase(key);
      acc[camelKey as keyof T] = StringUtil.camelCaseKey(
        obj[key] as Record<string, unknown>,
      ) as T[keyof T];
      return acc;
    }, {} as T);
  }

  static snakeCaseKey<T extends Record<string, unknown>>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) =>
        StringUtil.snakeCaseKey(item as Record<string, unknown>),
      ) as unknown as T;
    }

    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = StringUtil.snakeCase(key);
      acc[snakeKey as keyof T] = StringUtil.snakeCaseKey(
        obj[key] as Record<string, unknown>,
      ) as T[keyof T];
      return acc;
    }, {} as T);
  }
}
