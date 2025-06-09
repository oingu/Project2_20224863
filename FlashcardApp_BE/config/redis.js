const redis = require("redis");

const redisClient = redis.createClient({
    username: "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: "redis-15650.fcrce180.us-east-1-1.ec2.redns.redis-cloud.com",
        port: 15650,
    },
});
const connect = async () => {
    try {
        redisClient.on("error", (err) => {
            console.error("❌ Redis connection error:", err);
        });

        await redisClient.connect();
        console.log("✅ Redis connected successfully");
    } catch (error) {
        console.log("❌ Redis connection error:");
    }
};

connect();
module.exports = redisClient;
