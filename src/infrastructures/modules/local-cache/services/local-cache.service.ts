import { Injectable, Logger } from '@nestjs/common';
import { config } from '../../../../config';

interface ICacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * Local in-memory LRU cache service
 * Used as fallback when Redis is unavailable
 */
@Injectable()
export class LocalCacheService {
  private readonly logger = new Logger(LocalCacheService.name);
  private readonly cache: Map<string, ICacheEntry<unknown>>;
  private readonly accessOrder: string[];
  private readonly maxSize: number;

  constructor() {
    this.cache = new Map();
    this.accessOrder = [];
    this.maxSize = config.cache.localMaxSizeEntries;
    this.logger.log(
      `LocalCacheService initialized with max size: ${this.maxSize}`,
    );
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      return null;
    }

    // Update access order (move to end - most recently used)
    this.updateAccessOrder(key);

    return entry.value as T;
  }

  /**
   * Set value in cache with TTL
   */
  set<T>(key: string, value: T, ttlSeconds: number): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;

    // If cache is full, evict least recently used
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    this.cache.set(key, { value, expiresAt });
    this.updateAccessOrder(key);
  }

  /**
   * Delete key from cache
   */
  delete(key: string): boolean {
    const removed = this.cache.delete(key);

    if (removed) {
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
    }

    return removed;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder.length = 0;
    this.logger.log('Cache cleared');
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; maxSize: number; utilizationPercent: number } {
    const size = this.cache.size;
    return {
      size,
      maxSize: this.maxSize,
      utilizationPercent: (size / this.maxSize) * 100,
    };
  }

  /**
   * Update access order for LRU tracking
   */
  private updateAccessOrder(key: string): void {
    // Remove from current position
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }

    // Add to end (most recently used)
    this.accessOrder.push(key);
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    if (this.accessOrder.length === 0) {
      return;
    }

    // Remove oldest entry
    const lruKey = this.accessOrder[0];
    this.delete(lruKey);
  }
}
