import { RootDatabase } from 'lmdb';
export interface Storable<V = any, K extends Key = Key> {
    get(id: K): Promise<V | undefined>;
    put(id: K, value: V): Promise<boolean>;
}
export type Key = Key[] | string | symbol | number | boolean | Uint8Array;

export class DatabaseAdapter<V = any, K extends Key = Key>
    implements Storable<V, K>
{
    private db: RootDatabase<V, K>;

    constructor(db: RootDatabase<V, K>) {
        this.db = db;
    }

    async get(id: K) {
        return await this.db.get(id);
    }

    async put(id: K, value: V) {
        return await this.db.put(id, value);
    }
}
