import HashTable from '../../lib/ds/hashtable.js';
import adler32 from '../../lib/hash/adler32.js';
import murmur3_32 from '../../lib/hash/murmur.js';

class DataStoreMap {
  constructor() {
    this.data = new Map();
  }
  set(key, value) {
    this.data.set(key, value);
  }
  get(key) {
    return this.data.get(key);
  }
}

class DataStoreObject {
  constructor() {
    this.data = {};
  }
  set(key, value) {
    this.data[key] = value;
  }
  get(key) {
    return this.data[key];
  }
}

class DataStoreHashtable {
  constructor(size = 1000) {
    this.data = new HashTable(size, murmur3_32);
  }
  set(key, value) {
    this.data.insert(key, value);
  }
  get(key) {
    return this.data.get(key);
  }
  stats() {
    return this.data.stats();
  }
}

export { DataStoreMap, DataStoreObject, DataStoreHashtable };
