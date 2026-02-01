import express, {Express, Request, Response, Router, NextFunction} from "express";
import dotenv from "dotenv";
import connect from "./src/database/connect";
import cors, {CorsOptions} from "cors";

dotenv.config();

const app: Express = express();
const router: Router = express.Router();
const port = Number(process.env.PORT) || 3003;

const corsOrigins = new Set([
  "http://localhost:5173",
  "https://enzolivia.fr",
]);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // origin est undefined pour certains clients (curl, apps, etc.)
    if (!origin) return callback(null, true);

    if (corsOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Important: gérer le preflight AVANT tes routes
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

// (Optionnel mais utile) pour éviter des comportements bizarres de cache/proxy
app.use((req, res, next) => {
  res.header("Vary", "Origin");
  next();
});

app.use(router);

// Routes
const indexRouter = require("./src/routes/guests");

app.use("/guests", indexRouter);

// Error handling
app.use((req: Request, res: Response) => {
  res.status(404).json({message: "404 Page Not Found"}).end();
});

connect.once("open", () => {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
})


module.exports = app;
