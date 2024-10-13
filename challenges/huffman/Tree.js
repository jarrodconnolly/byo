import { Heap } from "./Heap.js";

class Node {
  constructor(value, weight) {
    this.value = value;
    this.weight = weight;
    this.left = null;
    this.right = null;
  }
  isLeaf() {
    return this.left === null && this.right === null;
  }
}

class Tree {
  constructor(root) {
    this.root = root;
  }

  getRoot() {
    return this.root;
  }

  toPrefixTable() {
    const table = new Map();
    this._toPrefixTable(this.root, table, '');
    return table;
  }
  _toPrefixTable(node, table, prefix) {
    if (node.isLeaf()) {
      table.set(node.value, prefix);
    } else {
      this._toPrefixTable(node.left, table, `${prefix}0`);
      this._toPrefixTable(node.right, table, `${prefix}1`);
    }
  }

  static buildTree(map) {
    const heap = new Heap();
    for (const [value, weight] of map) {
      heap.bulkInsert(new Node(value, weight));
      heap.sort();
    }
    while (heap.getLength() > 1) {
      const left = heap.extract();
      const right = heap.extract();
      const node = new Node(null, left.weight + right.weight);
      node.left = left;
      node.right = right;
      heap.insert(node);
    }
    const root = heap.extract();
    return new Tree(root);
  }
}

export { Tree };