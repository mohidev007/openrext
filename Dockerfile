# Use official Node.js 18 alpine for smaller size and faster builds
FROM node:18-alpine

# Install minimal dependencies needed for @sparticuz/chromium
RUN apk add --no-cache \
    ca-certificates \
    fontconfig \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Environment variables for @sparticuz/chromium
ENV NODE_ENV=production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Set working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install dependencies with npm ci for faster, reliable builds
RUN npm ci --only=production && npm cache clean --force

# Copy the rest of the application
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose the port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "const http = require('http'); \
    const options = { hostname: 'localhost', port: 5000, path: '/health', timeout: 2000 }; \
    const req = http.request(options, (res) => { \
    if (res.statusCode === 200) process.exit(0); \
    else process.exit(1); }); \
    req.on('error', () => process.exit(1)); \
    req.end();"

# Start the server
CMD ["node", "server.js"] 