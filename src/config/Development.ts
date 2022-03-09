const config: object = {
    mongo: {
        transaction: process.env?.TRANSACTION,
        transactionOptions: {
            readConcern: {
                level: "snapshot"
            },
            writeConcern: {
                w: "majority"
            }
        },
        useMongoClient: true,
        connectionUri: `${process.env.DB_CONNECTION_STRING.replace("<DB_NAME>", process.env.JD_APP_DB_PATH)}`,
        options: {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true,
            poolSize: 10
        }
    }
};
export default config;