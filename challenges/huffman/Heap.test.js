import { suite, test } from 'node:test';
import assert from 'node:assert';
import { Heap } from './Heap.js';

suite('heap', () => {
  test('ordering', async (t) => {
    const heap = new Heap();
    heap.insert({ weight: 3 });
    heap.insert({ weight: 1 });
    heap.insert({ weight: 2 });

    assert.strictEqual(heap.extract().weight, 1);
    assert.strictEqual(heap.extract().weight, 2);
    assert.strictEqual(heap.extract().weight, 3);
  });

  test('length', async (t) => {
    const heap = new Heap();
    assert.strictEqual(heap.getLength(), 0);
    heap.insert({ weight: 3 });
    assert.strictEqual(heap.getLength(), 1);
    heap.insert({ weight: 1 });
    assert.strictEqual(heap.getLength(), 2);
    heap.insert({ weight: 2 });
    assert.strictEqual(heap.getLength(), 3);
    
    heap.extract();
    assert.strictEqual(heap.getLength(), 2);
    heap.extract();
    assert.strictEqual(heap.getLength(), 1);
    heap.extract();
    assert.strictEqual(heap.getLength(), 0);
  });
});
