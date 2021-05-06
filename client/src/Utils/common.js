import { v4 as uuidv4 } from "uuid";

export const getDobFromAge = (age) => {
    let date = new Date();
    date.setDate("01");
    date.setMonth("00");
    date.setFullYear(date.getFullYear() - age);
    return date;
};

export const getDateObj = (string) => {
    if (!string) {
        return "";
    }
    return new Date(string);
};

export const getPrescription = (prescription, patient) => {
    let intialPrescription = [];
    if (Object.keys(prescription).length > 0) {
        prescription.symptoms.map((item) => {
            intialPrescription.push({
                id: item.defination,
                name: item.name,
                category: "Symptoms",
                fields: [...item.data],
            });
        });
        prescription.findings.map((item) => {
            intialPrescription.push({
                id: item.defination,
                name: item.name,
                category: "Findings",
                fields: [...item.data],
            });
        });
        prescription.instructions.map((item) => {
            intialPrescription.push({
                id: item.defination,
                name: item.name,
                category: "Instructions",
                fields: [...item.data],
            });
        });
        prescription.investigations.map((item) => {
            intialPrescription.push({
                id: item.defination,
                name: item.name,
                category: "Investigations",
                fields: [...item.data],
            });
        });
        prescription.diagnosis.map((item) => {
            intialPrescription.push({
                id: item.defination,
                name: item.name,
                category: "Diagnosis",
                fields: [...item.data],
            });
        });

        prescription.medicines.map((item) => {
            intialPrescription.push({
                id: item.defination,
                name: item.name,
                category: "Medicines",
                fields: [...item.data],
            });
        });

        intialPrescription.push({
            id: uuidv4(),
            name: "Others",
            category: "Others",
            fields: {
                additionalNotes: prescription.additional_notes,
                patientNotes: patient.notes || "",
                followUpDate: patient.follow_up_date || "",
            },
        });

        if (prescription.vitals.defination) {
            intialPrescription.push({
                id: prescription.vitals.defination,
                name: prescription.vitals.name,
                category: "Vitals",
                fields: [...prescription.vitals.data],
            });
        }
    }

    return intialPrescription;
};

export const getAPIBaseUrl = function () {
    return process.env.NODE_ENV === "development" ? "http://localhost:5000" : window.location.origin;
};

export const getPatienSerialId = (id) => id ? `PV${id}` : "";

export const getSexNotation = (sex) => {
    let sexNotation = "";
    switch (sex) {
        case "male":
            sexNotation = "M";
            break;
        case "female":
            sexNotation = "F";
            break;
        case "transgender":
            sexNotation = "T";
            break;
        default:
            sexNotation = "";
    }
    return sexNotation;
}