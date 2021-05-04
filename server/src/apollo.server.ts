import { ApolloServer } from "apollo-server-express";
import { Request } from "express";
import { buildSchema } from "type-graphql";
import UserResolver from "./graphql/resolvers/users.resolvers";
import { verifyUser } from "./middleware/auth.middleware";

export const apolloServerExpress = async () => {
    const schema = await buildSchema({
        resolvers: [UserResolver],
        emitSchemaFile: true,
        dateScalarMode: "timestamp",
    });

    return new ApolloServer({
        schema,
        context: async ({ req }) => {
            const me = await verifyUser(req);

            return {
                me,
                req,
            };
        },
    });
};
