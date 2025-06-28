"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prom_client_1 = __importDefault(require("prom-client"));
const app = (0, express_1.default)();
const port = 3030;
// registri instant mõõdikute haldamiseks
const register = new prom_client_1.default.Registry();
const defaultBuckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]; // <--- UUS RIDA
// loendur päringute koguarvu jaoks 
const httpRequestCounter = new prom_client_1.default.Counter({
    name: 'http_requests_total', // <-- uus nimi
    help: 'Total number of HTTP requests',
    labelNames: ['path', 'method', 'status_code'],
    registers: [register],
});
// histogram päringute kestuse jaoks 
const httpRequestDurationSeconds = new prom_client_1.default.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'path'],
    buckets: defaultBuckets,
    registers: [register],
});
// registeerib vaikimisi nodeJS mõõdikuid (CPU, MÄLU)
prom_client_1.default.collectDefaultMetrics({ register });
app.use(express_1.default.json());
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
    res.send('Back works');
});
app.get('users', (req, res) => {
    res.json([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
    ]);
});
app.get('/metrics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader('Content-Type', register.contentType);
    res.end(yield register.metrics());
}));
app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
});
