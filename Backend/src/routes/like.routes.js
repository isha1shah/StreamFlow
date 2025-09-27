import express from "express";
import { likeItem, unlikeItem, getLikes } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/like", verifyJWT, likeItem);
router.post("/unlike", verifyJWT, unlikeItem);
router.get("/likes", getLikes);

export default router;
