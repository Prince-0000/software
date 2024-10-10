// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const subscriptionRoutes = require("./routes/subscriptionPlan.routes");
const contactRoutes = require("./routes/contact.routes");
const toolRoutes = require("./routes/toolRoutes");

dotenv.config();

connectDB();

const app = express();
// Use CORS
// const corsOptions = {
//     origin: 'https://softwarewallah.vercel.app',
//     methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
//     allowedHeaders: ['X-Requested-With', 'Content-Type', 'x-app-id', 'x-auth-token', 'id-mercury'],
//     credentials: true,
//   };
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'),

app.use(cors());

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/subscription", subscriptionRoutes);
// Use payment routes
app.use("/api/payment", paymentRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/tool", toolRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
