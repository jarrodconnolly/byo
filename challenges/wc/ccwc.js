#!/usr/bin/env node
import { createReadStream } from 'node:fs';
import { parseArgs } from 'node:util';
import { StringDecoder } from 'node:string_decoder';
import process from 'node:process';

const options = {
  c: { type: 'boolean' },
  l: { type: 'boolean' },
  w: { type: 'boolean' },
  m: { type: 'boolean' },
};

const { values, positionals } = parseArgs({ options, allowPositionals: true });

let file = positionals[0];
let isBytes = values.c ?? false;
let isLines = values.l ?? false;
let isWords = values.w ?? false;
const isChars = values.m ?? false;

if(!isBytes && !isLines && !isWords && !isChars) {
  isBytes = true;
  isLines = true;
  isWords = true;
}

let stream;
if (file) {
  stream = createReadStream(file);
} else {
  stream = process.stdin;
  file = '';
}

const decoder = new StringDecoder('utf8');
let bytes = 0;
let lines = 0;
let words = 0;
let inWord = false;
let chars = 0;

stream.on('data', (chunk) => {
  if (isBytes) {
    bytes += chunk.length;
  }
  if (isChars) {
    const s = decoder.write(chunk);
    chars += s.length;
  }
  let i = 0;
  while (i < chunk.length) {
    if (isLines && chunk[i] === 10) {
      lines++;
    }

    if (isWords) {
      if (chunk[i] === 32 || (chunk[i] >= 9 && chunk[i] <= 13)) {
        if (inWord) {
          words++;
          inWord = false;
        }
      } else {
        inWord = true;
      }
    }

    i++;
  }
});

stream.on('end', () => {
  let result = '';
  if (isLines) {
    result += `${lines} `;
  }
  if(isWords) {
    if (inWord) {
      words++;
    }
    result += `${words} `;
  }
  if (isBytes) {
    result += `${bytes} `;
  }
  if (isChars) {
    const s = decoder.end();
    chars += s.length;
    result += `${chars} `;
  }
  console.log(`${result}${file}`);
});
