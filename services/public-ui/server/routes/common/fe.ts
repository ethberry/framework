import * as path from "path";
import { Router } from "express";

const router = Router();

router.route("*").get((_req, res) => {
  res.sendFile(path.join(__dirname, "../../../bundle/index.html"));
});

export default router;
