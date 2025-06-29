# Prometheus Metrics ja PromQL näited

See teenus ekspordib järgmised Prometheus metrikad:

## Eksporditavad metrikad

### 1. http_requests_total
- **Tüüp:** Counter
- **Kirjeldus:** Total number of HTTP requests
- **Labelid:** `method`, `path`, `status_code`

### 2. http_request_duration_seconds
- **Tüüp:** Histogram
- **Kirjeldus:** Duration of HTTP requests in seconds
- **Labelid:** `method`, `path`
- **Buckets:** 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10

### 3. Node.js vaikimisi metrikad
- Näiteks: `nodejs_process_cpu_user_seconds_total`, `nodejs_heap_size_used_bytes` jne.

---

## PromQL näited

### Kokku HTTP päringute arv
```
sum(http_requests_total)
```

### HTTP päringute arv meetodi, tee ja staatuse koodi kaupa
```
sum by (method, path, status_code) (http_requests_total)
```

### HTTP päringute arv ainult GET meetodile
```
sum by (path) (http_requests_total{method="GET"})
```

### HTTP päringute kestuse 95. percentiil
```
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, method, path))
```

### HTTP päringute kestuse keskmine
```
sum(rate(http_request_duration_seconds_sum[5m])) / sum(rate(http_request_duration_seconds_count[5m]))
```

### HTTP päringute arv konkreetsele teele (nt /users)
```
sum(http_requests_total{path="/users"})
```

### Node.js CPU kasutus
```
rate(nodejs_process_cpu_user_seconds_total[5m])
```

### Node.js heap mälu kasutus
```
nodejs_heap_size_used_bytes
```

---

## Metrics endpoint

Kõik metrikad on kättesaadavad aadressil:
```
GET /metrics
```

---

Kui vajad täpsemaid PromQL näiteid või abi Grafana paneelide seadistamisel, anna teada!
