import { open } from 'lmdb';
import { DatabaseAdapter } from './classes/DatabaseAdapter.js';

const db = open<number, string>({
    path: 'db',
});
