# Build Your Own Compression Tool

* Missing handling of final byte, should respect remainder bits and stop.
* Final byte count correct on test.txt but not 135-0.txt

`./challenges/huffman/huf.js ./challenges/huffman/135-0.txt`

```
Input file size: 3369045 bytes

Unique bytes: 123
Tree depth: 3369045
Prefix table size: 123
Header size: 1228 bytes
Byte count: 1969960 + 7 bits
Total: 1971189 bytes

Compressed file size: 1971189 bytes
Compression ratio: 58.51%

Decompressing...
Decompressed file size: 3369032 bytes
```

`./challenges/huffman/huf.js ./challenges/huffman/test.txt`

```
Input file size: 1668 bytes

Unique bytes: 46
Tree depth: 1668
Prefix table size: 46
Header size: 380 bytes
Byte count: 906 + 7 bits
Total: 1287 bytes

Compressed file size: 1287 bytes
Compression ratio: 77.16%

Decompressing...
Decompressed file size: 1668 bytes
```
