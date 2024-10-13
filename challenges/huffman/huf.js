#!/usr/bin/env node
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { countFrequency } from './lib.js';
import { Tree } from './Tree.js';

const { positionals } = parseArgs({ allowPositionals: true });
const file = positionals[0];

if(!file) {
  console.error('Usage: huf <file>');
  process.exit(1);
}

const outputFilename = `${file}.huf`;

const stats = await stat(file);
console.log(`File size: ${stats.size} bytes`);

const stream = createReadStream(file);
const frequencyMap = await countFrequency(stream);
console.log(`Unique bytes: ${frequencyMap.size}`);

const huffmanTree = Tree.buildTree(frequencyMap);
console.log(`Tree depth: ${huffmanTree.getRoot().weight}`);

const prefixTable = huffmanTree.toPrefixTable();
console.log(`Prefix table size: ${prefixTable.size}`);

const header = JSON.stringify(Array.from(prefixTable.entries()));
const fileHeader = `CCH${header.length}${header}\n`;
console.log(`Header size: ${fileHeader.length} bytes`);

let bitCount = 0;
let current = 0;
let shifted = 0;
const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    let i = 0;
    while (i < chunk.length) {
      const c = chunk[i];
      const prefix = prefixTable.get(c);
      bitCount += prefix.length;
      for (let j = 0; j < prefix.length; j++) {
        if (prefix[j] === '1') {
          current = (current << 1) | 1;
          shifted++;
        } else {
          current = current << 1;
          shifted++;
        }
        if (shifted === 8) {
          this.push(Buffer.from([current]));
          current = 0;
          shifted = 0;
        }
      }
      i++;
    }
    callback();
  },
  flush(callback) {
    if (shifted > 0) {
      this.push(Buffer.from([current << (8 - shifted)]));
    }
    callback();
  }
});

const outputStream = createWriteStream(outputFilename);
outputStream.write(fileHeader);
const fileStream = createReadStream(file);
await pipeline(
  fileStream,
  myTransform,
  outputStream
);

const byteCount = Math.floor(bitCount / 8);
const remainder = bitCount % 8;
console.log(`Byte count: ${byteCount} + ${remainder} bits`);
console.log(`Output Total: ${byteCount + (remainder > 0 ? 1 : 0) + fileHeader.length} bytes`);

const outputStats = await stat(outputFilename);
console.log(`Output file size: ${outputStats.size} bytes`);

console.log(`Compression ratio: ${(outputStats.size / stats.size * 100).toFixed(2)}%`);