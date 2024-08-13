import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  access_token_secret: process.env.ACCESS_TOKEN_SECRET as string,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET as string,
  database_url: process.env.DATABASE_URL as string,
  pb_token: process.env.PB_TOKEN as string,
  base_url: process.env.NEXT_PUBLIC_BASE_URL as string,
  node_env: process.env.NODE_ENV as string,
  smtp_host: process.env.SMTP_HOST as string,
  smtp_port: parseInt(process.env.SMTP_PORT as string),
  smtp_user: process.env.SMTP_USER as string,
  smtp_pass: process.env.SMTP_PASS as string,
};

// if missing any ENV variables, throw an error
Object.entries(ENV).map(([key, value]) => {
  if (key === "node_env") return;

  if (!value) {
    throw new Error(`Missing ENV variable: ${key}`);
  }
});
