const express = require("express");
const Redis = require("ioredis");

const app = express();

// Conecta ao Redis Cluster
const redis = new Redis.Cluster([
  { host: "redis-node1", port: 6379 },
  { host: "redis-node2", port: 6380 },
  { host: "redis-node3", port: 6381 },
  { host: "redis-node4", port: 6382 },
  { host: "redis-node5", port: 6383 },
  { host: "redis-node6", port: 6384 },
]);

app.get("/data", async (req, res) => {
  const cacheKey =  req?.query?.cacheKey || "key:data"

  // Verifica se o dado está no cache
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return res.send({ source: "cache", data: JSON.parse(cachedData) });
  }

  // Simula um processamento pesado
  const data = { message: "Hello from Redis Cluster!" };
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simula atraso

  // Armazena no cache com TTL
  await redis.set(cacheKey, JSON.stringify(data), "EX", 60);

  res.send({ source: "original", data });
});

app.listen(3000, () => console.log("App running on port 3000"));
