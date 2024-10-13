import test from 'node:test';
import assert from 'node:assert';
import HashTable from './hashtable.js';
import adler32 from '../hash/adler32.js';

test('hash table', async (t) => {
  const hashTable = new HashTable(10, adler32);
  hashTable.insert('foo', 1);
  hashTable.insert('bar', 2);
  hashTable.insert('baz', 3);
  assert.strictEqual(hashTable.get('foo'), 1);
  assert.strictEqual(hashTable.get('bar'), 2);
  assert.strictEqual(hashTable.get('baz'), 3);
  assert.strictEqual(hashTable.get('qux'), null);
});
