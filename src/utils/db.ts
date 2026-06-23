import { Project } from '../types';

const DB_NAME = 'orange_archive_indexed_db';
const STORE_NAME = 'portfolios';
const DB_VERSION = 1;

export class BulletproofDB {
  private static db: IDBDatabase | null = null;

  static async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
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
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  static async saveAll(projects: Project[]): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
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
              reject((ev.target as IDBRequest).error);
            }
          };
        });
      };

      clearRequest.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }

  static async loadAll(): Promise<Project[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = (event) => {
        console.error('IndexedDB loadAll error:', event);
        reject((event.target as IDBRequest).error);
      };
    });
  }
}
