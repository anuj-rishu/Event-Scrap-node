require("dotenv").config();
const express = require("express");
const cors = require("cors");
const hackathonRoutes = require("./Routes/hackathonRoutes");
const logger = require("./Utils/logger");

const app = express();

const { apiLimiter } = require("./Middleware/rateLimiter");

app.use(cors());
app.use(express.json());

// Apply rate limiter to all API routes
app.use("/api", apiLimiter);
app.use("/api", hackathonRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
