import express from "express";
import path from "path";
import cookieParser from "cookie-parser";


//routes import
import userRoutes from './routes/user.routes.js'
import healthcheckRoutes from "./routes/healthcheck.routes.js"
import tweetRoutes from "./routes/tweet.routes.js"
import subscriptionRoutes from "./routes/subscription.routes.js"
import videoRoutes from "./routes/video.routes.js"
import commentRoutes from "./routes/comment.routes.js"
import likeRoutes from "./routes/like.routes.js"
import playlistRoutes from "./routes/playlist.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true, // allow cookies
}));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // <-- add this
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(cookieParser());
// app.use(express.static("public"))
// app.use(cookieParser())


//routes declaration
app.use("/api/v1/healthcheck", healthcheckRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/tweets", tweetRoutes)
app.use("/api/v1/subscriptions", subscriptionRoutes)
app.use("/api/v1/videos", videoRoutes)
app.use("/api/v1/comments", commentRoutes)
app.use("/api/v1/likes", likeRoutes)
app.use("/api/v1/playlist", playlistRoutes)
app.use("/api/v1/dashboard", dashboardRoutes)

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
  success: false,
  message: err.message || "Internal Server Error",
  errors: err.errors || []
});

});
// Handle 404 (route not found)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


export { app };
