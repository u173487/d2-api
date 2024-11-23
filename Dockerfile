FROM node:18-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies and d2
RUN apt-get update && apt-get install -y curl && \
    curl -Lo /tmp/d2.tar.gz https://github.com/terrastruct/d2/releases/download/v0.6.8/d2-v0.6.8-linux-amd64.tar.gz && \
    tar -xzf /tmp/d2.tar.gz -C /usr/local/bin && \
    rm /tmp/d2.tar.gz && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/local/bin/d2-v0.6.8/bin/d2 /usr/local/bin/d2

# Verify D2 installation
RUN d2 --version

# Create app directory
WORKDIR /app

# Copy app code
COPY package*.json ./
RUN npm install
COPY . .

# Expose port
EXPOSE 3000

# Command to run the server
CMD ["node", "server.js"]
