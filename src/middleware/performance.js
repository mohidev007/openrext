import compression from 'compression';

// Performance timing middleware
export const performanceTimingMiddleware = (req, res, next) => {
  const startTime = process.hrtime.bigint();
  
  // Add timing information to response headers
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    
    res.setHeader('X-Response-Time', `${duration.toFixed(2)}ms`);
    
    // Log slow requests (>1000ms)
    if (duration > 1000) {
      console.warn(`🐌 Slow request: ${req.method} ${req.path} took ${duration.toFixed(2)}ms`);
    }
    
    // Log to performance metrics (you could send to monitoring service)
    logPerformanceMetric({
      method: req.method,
      path: req.path,
      duration: duration,
      statusCode: res.statusCode,
      timestamp: new Date().toISOString()
    });
  });
  
  next();
};

// Memory monitoring middleware
export const memoryMonitoringMiddleware = (req, res, next) => {
  const memUsage = process.memoryUsage();
  
  // Log memory usage for memory-intensive operations
  if (req.path.includes('pdf') || req.path.includes('email')) {
    console.log(`📊 Memory usage for ${req.path}:`, {
      rss: `${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      external: `${(memUsage.external / 1024 / 1024).toFixed(2)} MB`
    });
  }
  
  // Warning for high memory usage (>512MB)
  if (memUsage.rss > 512 * 1024 * 1024) {
    console.warn(`⚠️  High memory usage: ${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`);
  }
  
  next();
};

// Compression middleware with optimization
export const compressionMiddleware = compression({
  // Only compress responses that are larger than 1KB
  threshold: 1024,
  
  // Compression level (1-9, 6 is default, 1 is fastest but less compression)
  level: 6,
  
  // Only compress these types
  filter: (req, res) => {
    // Don't compress if client doesn't support it
    if (req.headers['x-no-compression']) {
      return false;
    }
    
    // Use compression for JSON, HTML, CSS, JS, and text responses
    return compression.filter(req, res);
  }
});

// Request rate limiting for performance
export const requestRateLimitingMiddleware = (() => {
  const requestCounts = new Map();
  const WINDOW_MS = 60000; // 1 minute
  const MAX_REQUESTS = 100; // per minute per IP
  
  // Cleanup old entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of requestCounts.entries()) {
      if (now - data.windowStart > WINDOW_MS * 5) {
        requestCounts.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, { count: 1, windowStart: now });
      return next();
    }
    
    const data = requestCounts.get(ip);
    
    // Reset window if it's expired
    if (now - data.windowStart > WINDOW_MS) {
      data.count = 1;
      data.windowStart = now;
      return next();
    }
    
    data.count++;
    
    // Check if rate limit exceeded
    if (data.count > MAX_REQUESTS) {
      console.warn(`🚫 Rate limit exceeded for IP: ${ip} (${data.count} requests)`);
      res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', Math.ceil((data.windowStart + WINDOW_MS) / 1000));
      
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((WINDOW_MS - (now - data.windowStart)) / 1000)
      });
    }
    
    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
    res.setHeader('X-RateLimit-Remaining', MAX_REQUESTS - data.count);
    res.setHeader('X-RateLimit-Reset', Math.ceil((data.windowStart + WINDOW_MS) / 1000));
    
    next();
  };
})();

// Performance metrics storage (in production, you'd use a proper metrics service)
const performanceMetrics = [];
const MAX_METRICS = 1000; // Keep last 1000 requests

function logPerformanceMetric(metric) {
  performanceMetrics.push(metric);
  
  // Keep only the most recent metrics
  if (performanceMetrics.length > MAX_METRICS) {
    performanceMetrics.shift();
  }
}

// Get performance statistics
export function getPerformanceStats() {
  if (performanceMetrics.length === 0) {
    return {
      totalRequests: 0,
      averageResponseTime: 0,
      slowRequests: 0,
      errorRate: 0
    };
  }
  
  const total = performanceMetrics.length;
  const totalDuration = performanceMetrics.reduce((sum, m) => sum + m.duration, 0);
  const slowRequests = performanceMetrics.filter(m => m.duration > 1000).length;
  const errorRequests = performanceMetrics.filter(m => m.statusCode >= 400).length;
  
  // Group by endpoint
  const endpointStats = {};
  performanceMetrics.forEach(metric => {
    const key = `${metric.method} ${metric.path}`;
    if (!endpointStats[key]) {
      endpointStats[key] = { count: 0, totalDuration: 0, errors: 0 };
    }
    endpointStats[key].count++;
    endpointStats[key].totalDuration += metric.duration;
    if (metric.statusCode >= 400) {
      endpointStats[key].errors++;
    }
  });
  
  // Calculate averages for each endpoint
  const endpointAverages = {};
  for (const [endpoint, stats] of Object.entries(endpointStats)) {
    endpointAverages[endpoint] = {
      averageResponseTime: (stats.totalDuration / stats.count).toFixed(2),
      requestCount: stats.count,
      errorRate: ((stats.errors / stats.count) * 100).toFixed(1) + '%'
    };
  }
  
  return {
    totalRequests: total,
    averageResponseTime: (totalDuration / total).toFixed(2) + 'ms',
    slowRequests: slowRequests,
    slowRequestPercentage: ((slowRequests / total) * 100).toFixed(1) + '%',
    errorRate: ((errorRequests / total) * 100).toFixed(1) + '%',
    endpointStats: endpointAverages,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  };
}

// Clear performance metrics (useful for testing)
export function clearPerformanceMetrics() {
  performanceMetrics.length = 0;
  console.log('📊 Performance metrics cleared');
}

// Health check middleware
export const healthCheckMiddleware = (req, res, next) => {
  // Add health indicators to response
  if (req.path === '/health' || req.path === '/') {
    const stats = getPerformanceStats();
    req.healthData = {
      performance: stats,
      serverTime: new Date().toISOString(),
      nodeVersion: process.version,
      platform: process.platform,
      environment: process.env.NODE_ENV || 'development'
    };
  }
  next();
};