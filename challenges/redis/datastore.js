class DataStore {
  constructor() {
    //this.data = {};
    this.data = new Map();
  }

  set(key, value) {
    //this.data[key] = value;
    this.data.set(key, value);
  }

  get(key) {
    //return this.data[key];
    return this.data.get(key);
  }
}

export { DataStore };
