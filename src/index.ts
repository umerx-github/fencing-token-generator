import { open } from 'lmdb';
import { DatabaseAdapter } from './classes/DatabaseAdapter.js';
import express from 'express';

// const db = open<number, string>('db', { useVersions: true });
const db = open<number, string>('db', {});

const app = express();
console.log('running!');
app.get('/', async (req, res) => {
    let int: number | undefined;
    // Between 3x - 4x as slow!
    // let success;
    // do {
    //     let results = db.getEntry('count');
    //     int = (results?.value || 0) + 1;
    //     let version = results?.version;
    //     let nextVersion = (version || 0) + 1;
    //     console.log({ results, int, version, nextVersion });
    //     success = await db.put('count', int, nextVersion, version);
    //     console.log({ success });
    // } while (!success);
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
    await db.transaction(() => {
        int = (db.get('count') || 0) + 1;
        db.put('count', int);
    });
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
    if (undefined === int) {
        res.status(500).send(
            JSON.stringify({
                error: 'Undefined token',
            })
        );
        return;
    }
    res.send(
        JSON.stringify({
            token: int,
        })
    );
});

app.listen(3000);
