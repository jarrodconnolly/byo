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
console.log(`Header size: ${header.length} bytes`);

let bitCount = 0;
const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    let i = 0;
    while (i < chunk.length) {
      const c = chunk[i];
      const prefix = prefixTable.get(c);
      bitCount += prefix.length;
      // for (let j = 0; j < prefix.length; j++) {
      //   const bit = prefix[j] === '0' ? 0 : 1;
      //   this.push(Buffer.from([bit]));
      //   bitCount++;
      // }
      i++;
    }
    //this.push(chunk);
    callback();
  },
});

const outputStream = createWriteStream(outputFilename);
outputStream.write(`CCH${header.length}${header}\n`);
const fileStream = createReadStream(file);
await pipeline(
  fileStream,
  myTransform,
  outputStream
);

const outputStats = await stat(outputFilename);
console.log(`Output file size: ${outputStats.size} bytes`);

console.log(`Bit count: ${bitCount}`);

const byteCount = Math.floor(bitCount / 8);
const remainder = bitCount % 8;
console.log(`Byte count: ${byteCount} + ${remainder} bits`);
