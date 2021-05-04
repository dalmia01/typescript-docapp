import { createLogger, transports, format } from "winston";
import "winston-daily-rotate-file";

const dailyTransport = new transports.DailyRotateFile({
    filename: "application-%DATE%.log",
    dirname: `../../winstonLogs/`,
    datePattern: "YYYY-MM-DD",
    level: "error",
    handleExceptions: true,
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
});

const logger = createLogger({
    transports: [
        new transports.File({ filename: "info.log", level: "info", format: format.combine(format.timestamp(), format.json()) }),
        dailyTransport,
    ],
});

export default logger;
