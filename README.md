## Summary
- This project is an experimental private blockchain service.

## Node.js framework
- expressjs: https://expressjs.com/


## Endpoint documentation


Read a block

#### GET
/block/:blockheight


Example URL path:

```
// where '0' is the block height.
http://localhost:8000/block/0
```


Example Response:

```
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8
cache-control: no-cache
content-length: 179
accept-ranges: bytes
Connection: close          
{"hash":"49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3","height":0,"body":"First block in the chain - Genesis block","time":"1530311457","previousBlockHash":""}
```


#### POST

/block

Example URL path:

```
http://localhost:8000/block
```

Example request:
```
POST /block/ HTTP/1.1
Host: localhost:8000
Content-Type: application/x-www-form-urlencoded
Cache-Control: no-cache
Postman-Token: 8526a8a6-f483-4c7b-8508-b0f3b38df596

{
    "body": "Testing block with test string data"
}

```

Example Response:

```json

{
    "hash": "c65b0a58e0448e82241ee20bb38f0322ba7ca406f80ccde2116343476348c1c1",
    "height": 1,
    "body": "Testing block with test string data",
    "time": "1538969409",
    "previousBlockHash": "d49c02854870cb735a6582173f329fff678a5c434579d3d1634ac67fefcd1cf6"
}
```
