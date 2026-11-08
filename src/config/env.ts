
interface Config {
  port: number;
  nodeEnv: string;
  frontendUrl: string;

  // JWT
  jwtRefreshSecret: string;
  jwtAccessSecret: string;
  refreshTokenEx: string;
  accessTokenEx: string;

  // R2
  r2_bucket_name: string;
  r2_accessKeyId: string;
  r2_secretAccessKey: string;
  r2_public_url: string;
  s3Endpoint: string;
  
  // Redis
  redisUrl: string

  // Resend
  resendApiKey: string

  // Stripe
  stripeSecretKey: string
  stripeWebhookSecret: string

  // RabbitMQ
  rabbitMqUrl: string
}

const config: Config = {
  port: Number(process.env.PORT) || 9000,
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: (process.env.FRONTEND_URL || "http://localhost:3000").trim(),

  //   Json web token
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "",
  refreshTokenEx: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  accessTokenEx: process.env.ACCESS_TOKEN_EXPIRES_IN || "30m",

  // R2
  r2_bucket_name: process.env.R2_BUCKET_NAME || "",
  r2_public_url: process.env.R2_PUBLIC_URL || "",
  r2_accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
  r2_secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  s3Endpoint: process.env.S3_ENDPOINT || "",
  // Redis
  redisUrl: process.env.REDIS_URL || "",

  // Resend (lib)
  resendApiKey: process.env.RESEND_API_KEY || "",

  // Stripe (lib)
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",

  // RabbitMQ
  rabbitMqUrl: process.env.RABBITMQ_URL || ""
};

export default config;
