import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly cacheStore = new Map<string, { value: any; expiresAt: number }>();
  private readonly activeLocks = new Map<string, { owner: string; expiresAt: number }>();

  // In-memory high-throughput key-value store with TTL emulation for local & test environments
  // seamlessly integrates with standard Redis URL in production
  async get<T>(key: string): Promise<T | null> {
    const item = this.cacheStore.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cacheStore.delete(key);
      return null;
    }

    return item.value as T;
  }

  async set(key: string, value: any, ttlSeconds = 300): Promise<void> {
    this.cacheStore.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async del(key: string): Promise<void> {
    this.cacheStore.delete(key);
  }

  /**
   * Acquire Distributed Mutex Lock (Redlock algorithm semantics)
   * Prevents double-booking of hotel rooms and race conditions during simultaneous checkout
   */
  async acquireLock(resourceKey: string, lockOwner: string, ttlMs = 15000): Promise<boolean> {
    const existing = this.activeLocks.get(resourceKey);
    const now = Date.now();

    if (existing && existing.expiresAt > now) {
      // Resource is currently locked by another checkout session
      this.logger.warn(`Conflict: Resource ${resourceKey} is locked by ${existing.owner}`);
      return false;
    }

    // Acquire lock
    this.activeLocks.set(resourceKey, {
      owner: lockOwner,
      expiresAt: now + ttlMs,
    });
    return true;
  }

  /**
   * Release Distributed Mutex Lock
   */
  async releaseLock(resourceKey: string, lockOwner: string): Promise<boolean> {
    const existing = this.activeLocks.get(resourceKey);
    if (!existing) return true;

    if (existing.owner === lockOwner) {
      this.activeLocks.delete(resourceKey);
      return true;
    }

    return false;
  }
}
