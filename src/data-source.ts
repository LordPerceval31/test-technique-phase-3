import "reflect-metadata";
import { DataSource } from "typeorm";
import { Tool } from "./entity/Tool"; 
import dotenv from "dotenv";

dotenv.config();


export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.MYSQL_HOST || "localhost",
    port: 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: false,
    logging: true,
    entities: [Tool],
    subscribers: [],
    migrations: [],
});