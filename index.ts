import express, {Express, Request, Response, Router, NextFunction} from "express";
import dotenv from "dotenv";
import connect from "./src/database/connect";
import cors, {CorsOptions} from "cors";

dotenv.config();

const app: Express = express();
const port: string | 3003 = process.env.PORT || 3003;
const router: Router = express.Router();
const corsOrigins = ["http://localhost:5173", "https://enzolivia.fr"];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || corsOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
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
