import test from 'node:test';
import assert from 'node:assert';
import adler32 from './adler32.js';

test('adler32', async (t) => {
  assert.strictEqual(adler32(''), 0x00000001);
  assert.strictEqual(adler32('Wikipedia'), 0x11e60398);
  assert.strictEqual(adler32('Adler'), 0x055a01e9);
  assert.strictEqual(adler32('This is a sample message'), 0x69d808bd);
});
