import  express from "express";
import client from "prom-client";

const app = express();
const port = 3030;

// registri instant mõõdikute haldamiseks
const register = new client.Registry();

const defaultBuckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]; // <--- UUS RIDA


// loendur päringute koguarvu jaoks 
const httpRequestCounter = new client.Counter({
    name : 'http_requests_total', // <-- uus nimi
    help : 'Total number of HTTP requests',
    labelNames: ['path', 'method', 'status_code'],
    registers: [register], 
});


// histogram päringute kestuse jaoks 

const httpRequestDurationSeconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'path'],
    buckets: defaultBuckets, 
    registers: [register],
});

// registeerib vaikimisi nodeJS mõõdikuid (CPU, MÄLU)

client.collectDefaultMetrics({register});


app.use(express.json());

//middleware, mis jäglib päringuid 

app.use((req, res, next) => {
    const end = httpRequestDurationSeconds.startTimer();

    res.on('finish', () => {
        const method = req.method;
        const route = req.route ? req.route.path : req.url;
        const statusCode = res.statusCode;

        httpRequestCounter.inc({
            method: method,
            path: route,
            status_code: statusCode,
        });
        end({ method: method, path: route });
    });
    next();
});

app.get('/', (req, res) => {
    res.send('Back works')
});

app.get('users', (req, res) => {
    res.json([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
    ]);
})

app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});


app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
});
