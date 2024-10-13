import { suite, test } from 'node:test';
import assert from 'node:assert';
import { Tree } from './Tree.js';

// https://opendsa-server.cs.vt.edu/ODSA/Books/CS3/html/Huffman.html
suite('tree', () => {
  test('basic', async (t) => {
    const map = new Map();
    map.set('C', 32);
    map.set('D', 42);
    map.set('E', 120);
    map.set('K', 7);
    map.set('L', 42);
    map.set('M', 24);
    map.set('U', 37);
    map.set('Z', 2);

    const tree = Tree.buildTree(map);
    assert.strictEqual(tree.root.weight, 306);

    assert.strictEqual(tree.root.left.weight, 120);
    assert.strictEqual(tree.root.left.value, 'E');
    assert.strictEqual(tree.root.left.isLeaf(), true);

    assert.strictEqual(tree.root.right.weight, 186);
    assert.strictEqual(tree.root.right.value, null);
    assert.strictEqual(tree.root.right.isLeaf(), false);

    const zNode = tree.root.right.right.right.right.left.left;
    assert.strictEqual(zNode.weight, 2);
    assert.strictEqual(zNode.value, 'Z');
    assert.strictEqual(zNode.isLeaf(), true);
  });
});