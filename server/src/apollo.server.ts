import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ClinicsResolver } from "./graphql/resolvers/clinics.resolver";
import PatientResolver from "./graphql/resolvers/patients.resolver";
import UserResolver from "./graphql/resolvers/users.resolver";
import { verifyUser } from "./middleware/auth.middleware";

export const apolloServerExpress = async () => {
    const schema = await buildSchema({
        resolvers: [UserResolver, ClinicsResolver, PatientResolver],
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
