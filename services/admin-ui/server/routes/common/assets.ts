import path from "path";
import {Router, static as serveStatic} from "express";
import webpack from "../../configs/webpack";

const router = Router();

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
  router.use("/", serveStatic(path.join(__dirname, "../../../bundle")));
}

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  router.use(webpack);
}

export default router;
