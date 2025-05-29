// lib/redis.js
import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL, // e.g. redis://localhost:6379
});

client.on("error", (err) => console.error("Redis Client Error", err));

if (!client.isOpen) {
  await client.connect();
}

export default client;
