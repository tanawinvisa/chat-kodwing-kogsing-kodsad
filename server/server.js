const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const http = require("http");
const Server = require("socket.io");

const userRoutes = require('./routes/users');  // Import the routes

const socketControllers = require('./controllers/socket'); // Import the handlers

// Load environment variables
dotenv.config({ path: "config/config.env" });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.use(hpp());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);  // Use the user routes

const server = http.createServer(app);
const io = Server(server);

socketControllers(io);

server.listen(process.env.PORT, () => {
  console.log(`Server start on port ${process.env.PORT}`);
});