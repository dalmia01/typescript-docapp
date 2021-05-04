import "reflect-metadata";
import { config as dotenv } from "dotenv";
dotenv();
import express from "express";
import mongoose from "mongoose";
import logger from "./configuration/logger.configuration";
import cors from "cors";
// custom imports
import { requestMiddleware } from "./middleware/requests.middleware";
import { mongoDBConfiguration } from "./configuration/mongodb.configuration";
import { apolloServerExpress } from "./apollo.server";
const PORT = process.env.PORT || 3003;
async function main() {
    const app = express();
    const server = await apolloServerExpress();
    server.applyMiddleware({ app });
    app.use(express.json());
    app.use(cors());
    app.use(requestMiddleware);

    app.listen(PORT, () => {
        logger.log("info", `Server is  started on:  ${process.env.PORT} `);
        mongoose.connect(mongoDBConfiguration(), { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
            if (err) logger.error("database not connected");
            if (!err) console.info(`mongodb database connected ${new Date()} @and server connected @port :: ${PORT}`);
        });
    });
}

main();
