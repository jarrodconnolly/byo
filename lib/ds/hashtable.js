class HashTable {
  constructor(size, hashFunction) {
    this.size = size;
    this.hashFunction = hashFunction;
    this.table = new Array(size);
  }

  hashKey(key) {
    return this.hashFunction(key) % this.size;
  }

  insert(key, value) {
    const index = this.hashKey(key);
    if (!this.table[index]) {
      this.table[index] = [];
    }
    this.table[index].push([key, value]);
  }

  get(key) {
    const index = this.hashKey(key);
    if (!this.table[index]) {
      return null;
    }
    for (const [k, v] of this.table[index]) {
      if (k === key) {
        return v;
      }
    }
    return null;
  }

  stats() {
    let entryCount = 0;
    let bucketsUsed = 0;
    let longestChain = 0;
    for (const bucket of this.table) {
      if (bucket) {
        entryCount += bucket.length;
        bucketsUsed++;
        longestChain = Math.max(longestChain, bucket.length);
      }
    }
    return { bucketsUsed, totalBuckets: this.size, longestChain, entryCount };
  }
}

export default HashTable;