import { Router } from "express";
import AuthRouter from "./auth-router";
import RoomRouter from "./room-router";

const router: Router = Router();

router.use("/api/auth", AuthRouter);
router.use("/api/room", RoomRouter);

export default router;
