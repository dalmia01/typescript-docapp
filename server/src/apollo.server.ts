import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { AppointmentResolver } from "./graphql/resolvers/appointments.resolver";
import { ClinicsResolver } from "./graphql/resolvers/clinics.resolver";
import { CommonDefinitionResolver } from "./graphql/resolvers/common.definition.resolvers";
import { InvoiceResolver } from "./graphql/resolvers/invoices.resolver";
import { PatientBookingResolver } from "./graphql/resolvers/patients.booking.resolver";
import PatientResolver from "./graphql/resolvers/patients.resolver";
import { PrescriptionResolver } from "./graphql/resolvers/prescriptions.resolver";
import UserResolver from "./graphql/resolvers/users.resolver";
import { VaccineChartResolver } from "./graphql/resolvers/vaccine.chart.resolver";
import { verifyUser } from "./middleware/auth.middleware";

export const apolloServerExpress = async () => {
    const schema = await buildSchema({
        resolvers: [
            UserResolver,
            ClinicsResolver,
            PatientResolver,
            AppointmentResolver,
            InvoiceResolver,
            PatientBookingResolver,
            VaccineChartResolver,
            PrescriptionResolver,
            CommonDefinitionResolver,
        ],
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
