import { Router } from "express";
import {
  createTweet,
  getAllTweets,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public
router.get("/", getAllTweets); // get all tweets
router.get("/user/:userId", getUserTweets); // get tweets of a specific user

// Protected (need login)
router.post("/", verifyJWT, createTweet); // create tweet
router.put("/:tweetId", verifyJWT, updateTweet); // update tweet
router.delete("/:tweetId", verifyJWT, deleteTweet); // delete tweet

export default router;
