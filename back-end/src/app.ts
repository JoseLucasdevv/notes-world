import express, { Request } from 'express';
import route from './routes/routes';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import requestIp from 'request-ip';

const allowedOrigins: string[] = [
    'http://127.0.0.1',
    'http://localhost:5173',
    'https://notes-app-vert-one.vercel.app',
    'https://notes-world-bice.vercel.app',
];

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg =
                'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
};

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    keyGenerator: (req: Request) => {
        if (!req.clientIp) throw new Error('what is wrong with your ip');

        return req.clientIp;
    },
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
const app = express();
app.use(cors(corsOptions));
app.use(helmet());

app.use(
    mongoSanitize({
        replaceWith: '_',
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(requestIp.mw());
app.use(limiter);
app.use(express.json());
app.use(route);

export = app;
