import express from 'express';
import { open } from 'lmdb';

const app = express();
const db = open<number, string>('db', { useVersions: true });
const key = 'counter';

app.get('/', async (req, res) => {
    let value: number | undefined;
    await db.transaction(() => {
        value = (db.get(key) || 0) + 1;
        db.put(key, value);
    });
    if (undefined === value) {
        res.status(500).send(
            JSON.stringify({
                error: 'Undefined value',
            })
        );
        return;
    }
    res.send(
        JSON.stringify({
            value,
        })
    );
});

app.listen(3000);
