import { Project } from '../types';

const DB_NAME = 'orange_archive_indexed_db';
const STORE_NAME = 'portfolios';
const DB_VERSION = 1;

export class BulletproofDB {
  private static db: IDBDatabase | null = null;
  private static memoryStore: Project[] = [];
  private static useMemoryFallback = false;

  static async init(): Promise<IDBDatabase | null> {
    if (this.db) return this.db;
    if (this.useMemoryFallback) return null;

    try {
      if (typeof indexedDB === 'undefined') {
        this.useMemoryFallback = true;
        return null;
      }
      return await new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };

        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          resolve(this.db);
        };

        request.onerror = (event) => {
          console.error('IndexedDB open error:', event);
          this.useMemoryFallback = true;
          resolve(null);
        };
      });
    } catch (e) {
      console.warn('IndexedDB is blocked or disabled in this sandbox environment. Switched to lightweight memory cache:', e);
      this.useMemoryFallback = true;
      return null;
    }
  }

  static async saveAll(projects: Project[]): Promise<void> {
    try {
      const db = await this.init();
      if (!db || this.useMemoryFallback) {
        this.memoryStore = projects;
        return;
      }
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        // Clear existing records
        const clearRequest = store.clear();

        clearRequest.onsuccess = () => {
          let activeRequests = projects.length;
          if (activeRequests === 0) {
            resolve();
            return;
          }

          let failed = false;
          projects.forEach((p) => {
            const addRequest = store.put(p);
            addRequest.onsuccess = () => {
              activeRequests--;
              if (activeRequests === 0 && !failed) {
                resolve();
              }
            };
            addRequest.onerror = (ev) => {
              console.error('Failed to write project in transaction:', ev);
              if (!failed) {
                failed = true;
                this.memoryStore = projects;
                resolve();
              }
            };
          });
        };

        clearRequest.onerror = (event) => {
          this.memoryStore = projects;
          resolve();
        };
      });
    } catch (e) {
      this.memoryStore = projects;
    }
  }

  static async loadAll(): Promise<Project[]> {
    try {
      const db = await this.init();
      if (!db || this.useMemoryFallback) {
        return this.memoryStore;
      }
      return new Promise<Project[]>((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          resolve(request.result || []);
        };

        request.onerror = (event) => {
          console.error('IndexedDB loadAll error:', event);
          resolve(this.memoryStore);
        };
      });
    } catch (e) {
      return this.memoryStore;
    }
  }
}
