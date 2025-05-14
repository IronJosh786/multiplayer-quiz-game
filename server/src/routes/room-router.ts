import { Router } from "express";
import passport from "passport";
import { createRoom } from "../controllers/room-controller";

const router: Router = Router();

router.post(
  "/create-room",
  passport.authenticate("jwt", { session: false }),
  createRoom
);

export default router;
