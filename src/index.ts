import express from 'express';
import { open } from 'lmdb';

const app = express();
const db = open<number, string>('db', { useVersions: true });
const key = 'counter';

app.get('/', async (req, res) => {
    let value: number | undefined;
    let success;
    do {
        let results = db.getEntry(key);
        value = (results?.value || 0) + 1;
        let version = results?.version;
        let nextVersion = (version || 0) + 1;
        success = await db.put(key, value, nextVersion, version);
    } while (!success);
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
