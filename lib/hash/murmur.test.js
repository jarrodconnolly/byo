import test from 'node:test';
import assert from 'node:assert';
import murmur3_32 from './murmur.js';

test('murmur3_32', async (t) => {
  assert.strictEqual(murmur3_32('test'), 0xba6bd213);
  assert.strictEqual(murmur3_32('test', 0x9747b28c), 0x704b81dc);

  assert.strictEqual(murmur3_32('The quick brown fox jumps over the lazy dog'), 0x2e4ff723);
  assert.strictEqual(murmur3_32('The quick brown fox jumps over the lazy dog', 0x9747b28c), 0x2FA826CD);
});

test('collisions', async (t) => {
  const keys = ['key:000000006567', 'key:000000004061', 'key:000000003783'];

  const modulo = 10000;
  const initial = murmur3_32(keys[0]) % modulo;
  
  for (const key of keys) {
    const h = murmur3_32(key) % modulo;
    assert.strictEqual(h , initial);
  }
});