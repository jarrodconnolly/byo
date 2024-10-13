import { suite, test } from 'node:test';
import assert from 'node:assert';
import { Readable } from 'node:stream';
import { createReadStream } from 'node:fs';
import { countFrequency } from './lib.js';
import path from 'node:path';

suite('huffman', () => {
  test('simple frequency', async (t) => {
    async function* generate() {
      yield Buffer.from('XtXtXt');
    }
    const readable = Readable.from(generate());
    const freqs = await countFrequency(readable);
    assert.strictEqual(freqs.get('X'.charCodeAt(0)), 3);
    assert.strictEqual(freqs.get('t'.charCodeAt(0)), 3);
  });

  test('les mis frequency', async (t) => {
    const filename = path.join(import.meta.dirname, '135-0.txt');
    const stream = createReadStream(filename);
    const freqs = await countFrequency(stream);
    assert.strictEqual(freqs.get('X'.charCodeAt(0)), 333);
    assert.strictEqual(freqs.get('t'.charCodeAt(0)), 223000);
    assert.strictEqual(freqs.get(':'.charCodeAt(0)), 2501);
    assert.strictEqual(freqs.get('J'.charCodeAt(0)), 2447);
    assert.strictEqual(freqs.get('\n'.charCodeAt(0)), 73589);
  });
});
