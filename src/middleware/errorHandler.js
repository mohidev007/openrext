// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

// Timeout middleware - ensure requests don't hang
export const timeoutMiddleware = (req, res, next) => {
  res.setTimeout(30000, () => {
    res.status(503).json({
      status: "error",
      message: "Request timeout",
    });
  });
  next();
};

// Request logging middleware for debugging
export const requestLogger = (req, res, next) => {
  console.log(
    `🔍 ${req.method} ${req.path} from origin: ${
      req.headers.origin || "no-origin"
    }`
  );
  console.log(`🔍 Headers:`, {
    "content-type": req.headers["content-type"],
    "user-agent": req.headers["user-agent"]?.substring(0, 50) + "...",
    origin: req.headers.origin,
    referer: req.headers.referer,
  });
  next();
};
