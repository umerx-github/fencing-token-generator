import express from 'express';
import { open } from 'lmdb';

const app = express();
const db = open<number, string>('db', { useVersions: true });
const key = 'counter';

// Required - ifVersion is still undefined when there is possibility for concurrent readers/writers, can cause conflicts.
let results = db.getEntry(key);
if (undefined === results) {
    await db.put(key, 0, 0);
}

app.get('/', async (req, res) => {
    let value: number | undefined;
    let success;
    do {
        let results = db.getEntry(key);
        value = (results?.value || 0) + 1;
        let ifVersion = results?.version;
        let nextVersion = (ifVersion || 0) + 1;
        success = await db.put(key, value, nextVersion, ifVersion);
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
