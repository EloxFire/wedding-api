import express, {Express, Request, Response, Router} from "express";
import dotenv from "dotenv";
import connect from "./src/database/connect";

dotenv.config();

const app: Express = express();
const port: string | 3003 = process.env.PORT || 3003;
const router: Router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

// Routes 
const indexRouter = require("./src/routes/guests");

app.use("/", indexRouter);

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
