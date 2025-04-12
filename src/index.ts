import express from 'express';
import { open } from 'lmdb';

const app = express();
const db = open<number, string>('db', {});
const key = 'counter';
const state = {
    value: (await db.get(key)) || 0,
};

app.get('/', async (req, res) => {
    state.value++;
    const value = state.value;
    await db.put(key, value);
    res.send(
        JSON.stringify({
            value,
        })
    );
});

app.listen(3000);
