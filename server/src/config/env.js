const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/golf-charity",
  useMemoryDb: process.env.USE_MEMORY_DB === "true",
  jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  adminUrl: process.env.ADMIN_URL || "http://localhost:5174",
  monthlyPlanPrice: Number(process.env.MONTHLY_PLAN_PRICE || 29),
  yearlyPlanPrice: Number(process.env.YEARLY_PLAN_PRICE || 299),
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  mailFrom: process.env.MAIL_FROM || "noreply@golfcharity.local"
};

module.exports = env;
