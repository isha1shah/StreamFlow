import { Router } from "express";
import {
  subscribeChannel,
  unsubscribeChannel,
  getSubscriberCount,
  getSubscribedChannels,
  getChannelSubscribers,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ➝ Protected routes (require login)
   // Unsubscribe from a channel

// ➝ Public routes
router.get("/:channelId/count", getSubscriberCount);            // Get subscriber count of a channel
router.get("/user/:userId/channels", getSubscribedChannels);    // Get channels a user has subscribed
router.get("/:channelId/subscribers", getChannelSubscribers);

router.post("/:channelId", verifyJWT, subscribeChannel);       // Subscribe to a channel
router.delete("/:channelId", verifyJWT, unsubscribeChannel);// Get subscribers of a channel

export default router;
