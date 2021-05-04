const configMap = {
    local: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        mongoConnectionString: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.ATLAS_HOSTNAME}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        mongoConnectionString: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.ATLAS_HOSTNAME}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    },
};

export const mongoDBConfiguration = () => configMap[process.env.NODE_ENV].mongoConnectionString;
