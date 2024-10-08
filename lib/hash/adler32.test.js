import test from 'node:test';
import assert from 'node:assert';
import adler32 from './adler32.js';

test('adler32', async (t) => {
  assert.strictEqual(adler32(''), 0x00000001);
  assert.strictEqual(adler32('Wikipedia'), 0x11e60398);
  assert.strictEqual(adler32('Adler'), 0x055a01e9);
  assert.strictEqual(adler32('This is a sample message'), 0x69d808bd);
});

// redis-benchmark keys do not play well with adler32
test('collisions', async (t) => {
  const keys = [
    'key:000000005388',
    'key:000000006198',
    'key:000000006279',
    'key:000000002796',
    'key:000000002958',
    'key:000000004659',
    'key:000000003849',
    'key:000000003687',
    'key:000000004497',
    'key:000000002877',
    'key:000000001986',
    'key:000000004578',
    'key:000000007089',
    'key:000000003768',
    'key:000000005469',
  ];

  const initial = adler32(keys[0]);

  for (const key of keys) {
    const h = adler32(key);
    assert.strictEqual(h, initial);
  }
});
