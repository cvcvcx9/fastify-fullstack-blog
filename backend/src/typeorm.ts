import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import { Post } from "./modules/post/post.entity";
import { User } from "./modules/user/user.entity";

dotenv.config();
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "mydatabase",
  synchronize: true,
  logging: true,
  entities: [Post,User],
});
