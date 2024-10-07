# Build Your Own Redis Server

## Commands
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
