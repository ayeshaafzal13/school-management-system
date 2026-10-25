// A student record used by the typed routes.
export interface Student {
  id: number;
  name: string;
  surname: string;
  className: string;
}

// GENERIC TYPE 1: every API response has the same shape, only the data changes.
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// GENERIC TYPE 2: a reusable in-memory store for any record that has an id.
export interface HasId {
  id: number;
}

export class Repository<T extends HasId> {
  private items: T[];

  constructor(initial: T[] = []) {
    this.items = [...initial];
  }

  getAll(): T[] {
    return this.items;
  }

  getById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  add(item: Omit<T, "id">): T {
    const nextId = this.items.reduce((max, i) => Math.max(max, i.id), 0) + 1;
    // The cast is needed because TypeScript can't prove Omit<T,"id"> + id is T.
    const created = { ...item, id: nextId } as T;
    this.items.push(created);
    return created;
  }

  remove(id: number): boolean {
    const before = this.items.length;
    this.items = this.items.filter((item) => item.id !== id);
    return this.items.length < before;
  }
}

// Helper builders that use the generic response type.
export const ok = <T>(data: T): ApiResponse<T> => ({ success: true, data });
export const fail = (error: string): ApiResponse<never> => ({
  success: false,
  error,
});