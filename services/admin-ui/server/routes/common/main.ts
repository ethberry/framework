import {Request, Response, Router} from "express";

const router = Router();

router.route("/ping").get((_request: Request, response: Response) => {
  response.status(200).json({pong: true});
});

export default router;
