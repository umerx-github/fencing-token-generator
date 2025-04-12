import { open } from 'lmdb';
import { DatabaseAdapter } from './classes/DatabaseAdapter.js';
import express from 'express';

// const db = open<number, string>('db', { useVersions: true });
const db = open<number, string>('db', {});

const app = express();
console.log('running!');
const state = {
    int: (await db.get('counter')) || 0,
};
app.get('/', async (req, res) => {
    state.int++;
    const val = state.int;
    await db.put('counter', val);
    res.send(
        JSON.stringify({
            token: val,
        })
    );
});

app.listen(3000);
