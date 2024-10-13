#!/usr/bin/env node
import { createReadStream } from 'node:fs';
import { parseArgs } from 'node:util';
import { countFrequency } from './lib.js';

const { positionals } = parseArgs({ allowPositionals: true });
const file = positionals[0];

if(!file) {
  console.error('Usage: huf <file>');
  process.exit(1);
}

const stream = createReadStream(file);
const freqs = await countFrequency(stream);

