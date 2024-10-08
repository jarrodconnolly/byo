const c1 = 0xcc9e2d51;
const c2 = 0x1b873593;

function murmur3_32(data, seed = 0) {
    if (!data || data.length === 0) return 0;

    const buffer = Buffer.from(data);
    const nbytes = buffer.length;
    const nblocks = Math.floor(nbytes / 4);
    let h = seed;

    for (let i = 0; i < nblocks; i++) {
        let k = buffer.readUInt32LE(i * 4);
        k = Math.imul(k, c1);
        k = (k << 15) | (k >>> 17);
        k = Math.imul(k, c2);

        h ^= k;
        h = (h << 13) | (h >>> 19);
        h = Math.imul(h, 5) + 0xe6546b64;
    }

    let k = 0;
    switch (nbytes & 3) {
        // biome-ignore lint/suspicious/noFallthroughSwitchClause: <explanation>
        case 3:
            k ^= buffer[nblocks * 4 + 2] << 16;
        // biome-ignore lint/suspicious/noFallthroughSwitchClause: <explanation>
        case 2:
            k ^= buffer[nblocks * 4 + 1] << 8;
        case 1:
            k ^= buffer[nblocks * 4];
            k = Math.imul(k, c1);
            k = (k << 15) | (k >>> 17);
            k = Math.imul(k, c2);
            h ^= k;
    }

    h ^= nbytes;
    h ^= h >>> 16;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;

    return h >>> 0;
}

export default murmur3_32;
