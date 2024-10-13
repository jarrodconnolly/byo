class Heap {
  constructor() {
    this.nodes = [];
  }

  insert(node) {
    this.nodes.push(node);
    this.nodes.sort((a, b) => a.weight - b.weight);
  }

  bulkInsert(node) {
    this.nodes.push(node);
  }

  sort() {
    this.nodes.sort((a, b) => a.weight - b.weight);
  }

  extract() {
    return this.nodes.shift();
  }

  getLength() {
    return this.nodes.length;
  }
}

export { Heap };