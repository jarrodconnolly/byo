# Build Your Own Redis Server

## adler32

redis-benchmark keys do not play well with adler32

take a look at the `collisions` unit test in `adler32.test.js`

`redis-benchmark -t SET,GET -q -r 10000`
```
Datastore: {
  "bucketsUsed": 847,
  "totalBuckets": 10000,
  "longestChain": 371,
  "entryCount": 100000
}
```

## murmur32
`redis-benchmark -t SET,GET -q -r 10000`
```
SET: 259067.36 requests per second
GET: 222717.16 requests per second
```
```
Datastore: {
  "bucketsUsed": 6316,
  "totalBuckets": 10000,
  "longestChain": 69,
  "entryCount": 100000
}
```

## Performance Tests
`redis-benchmark -t ping`
```
ME
374531.84 requests per second
387596.91 requests per second
```
```
REDIS
325732.88 requests per second
309597.50 requests per second
```

`redis-benchmark -t SET,GET -q`
```
ME (`data = {}`)
SET: 332225.91 requests per second
GET: 335570.47 requests per second
```
```
ME (`data = new Map();`)
SET: 341296.91 requests per second
GET: 347222.25 requests per second
```
```
REDIS
SET: 325732.88 requests per second
GET: 324675.31 requests per second
```

`redis-benchmark -t SET,GET -q -r 10000`
```
ME (`data = new Map();`)
SET: 321543.41 requests per second
GET: 332225.91 requests per second
```
```
REDIS
SET: 338983.06 requests per second
GET: 324675.31 requests per second
```

`redis-benchmark -t SET,GET -q -r 10000`
```
ME DataStoreHashtable using custom hashtable with adler32 in Node.js
SET: 319488.81 requests per second
GET: 201207.23 requests per second
```