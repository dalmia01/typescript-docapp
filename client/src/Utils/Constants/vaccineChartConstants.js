export const vaccinesData = {
    ranges_details: {
        1: {
            start_range: 0,
            end_range: 0,
            range_unit: "days",
            range_label: "Birth",
        },
        2: {
            start_range: 6,
            end_range: 6,
            range_unit: "weeks",
            range_label: "6 Weeks",
        },
        3: {
            start_range: 10,
            end_range: 10,
            range_unit: "weeks",
            range_label: "10 Weeks",
        },
        4: {
            start_range: 14,
            end_range: 14,
            range_unit: "weeks",
            range_label: "14 Weeks",
        },
        5: {
            start_range: 6,
            end_range: 6,
            range_unit: "months",
            range_label: "6 Months",
        },
        6: {
            start_range: 9,
            end_range: 12,
            range_unit: "months",
            range_label: "9-12 Months",
        },
        7: {
            start_range: 15,
            end_range: 18,
            range_unit: "months",
            range_label: "15-18 Months",
        },
        8: {
            start_range: 18,
            end_range: 24,
            range_unit: "months",
            range_label: "18-24 Months",
        },
        9: {
            start_range: 4,
            end_range: 6,
            range_unit: "years",
            range_label: "4-6 Years",
        },
    },
    range_order: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    vaccine_group: [
        { id: 1, vaccine_group_name: "MMR" },
        { id: 2, vaccine_group_name: "Polio" },
        { id: 3, vaccine_group_name: "DTP" },
        { id: 4, vaccine_group_name: "BCG" },
        { id: 5, vaccine_group_name: "Hib" },
        { id: 6, vaccine_group_name: "Rotavirus" },
        { id: 7, vaccine_group_name: "Hep B" },
        { id: 8, vaccine_group_name: "Typhoid" },
        { id: 9, vaccine_group_name: "Pneumococcal" },
        { id: 10, vaccine_group_name: "Meningococcal" },
    ],
    vaccine_chart: [
        {
            range: 1,
            vaccines: [
                {
                    vaccine_group_name: "BCG",
                    range: 1,
                    medicine_name: "BCG",
                    medicine_brands: ["Tubervac"],
                },
                {
                    vaccine_group_name: "Polio",
                    range: 1,
                    medicine_name: "OPV 0",
                    medicine_brands: [
                        "BioPolio B 1/3",
                        "Biopolio",
                        "Bivalent/b-OPV 1&3",
                        "Oral Bivalent Type 1&3",
                        "Polio Sabin (Oral)",
                        "Polio Sabin 1&3 (Oral)",
                        "mOPV1",
                    ],
                },
            ],
        },
        {
            range: 2,
            vaccines: [
                {
                    vaccine_group_name: "Polio",
                    range: 2,
                    medicine_name: "IPV 1",
                    medicine_brands: ["Easy 6", "Hexaxim", "Imovax", "Infanrix Hexa", "Pentaxim", "Poliovac", "Polprotec", "Tetraxim"],
                },
                {
                    vaccine_group_name: "Polio",
                    range: 2,
                    medicine_name: "OPV",
                    medicine_brands: [
                        "BioPolio B 1/3",
                        "Biopolio",
                        "Bivalent/b-OPV 1&3",
                        "Oral Bivalent Type 1&3",
                        "Polio Sabin (Oral)",
                        "Polio Sabin 1&3 (Oral)",
                        "mOPV1",
                    ],
                },
                {
                    vaccine_group_name: "DTP",
                    range: 2,
                    medicine_name: "DTP 1",
                    medicine_brands: [
                        "ComBE Five",
                        "Comvac 4",
                        "Comvac 5",
                        "Comvac4-HB",
                        "Easy 4",
                        "Easy 5",
                        "Easy 6",
                        "Easy4-TT Vial",
                        "Hexaxim",
                        "Infanrix",
                        "Infanrix Hexa",
                        "Pentashield",
                        "Pentavac",
                        "Pentavac PFS",
                        "Pentavac SD",
                        "Pentaxim",
                        "Quadrovax",
                        "Quinvaxem",
                        "Shan 5",
                        "Tetraxim",
                        "Tripacel",
                        "Triple Antigen",
                    ],
                },
                {
                    vaccine_group_name: "Hib",
                    range: 2,
                    medicine_name: "HIB 1",
                    medicine_brands: [
                        "ActHIB",
                        "ComBE Five",
                        "Comvac 4",
                        "Comvac 5",
                        "Easy 4",
                        "Easy 5",
                        "Easy 6",
                        "HIBpro",
                        "Hexaxim",
                        "Hiberix",
                        "Infanrix Hexa",
                        "Pentashield",
                        "Pentavac",
                        "Pentaxim",
                        "Quadrovax",
                        "Quinvaxem",
                        "Shan 5",
                    ],
                },
                {
                    vaccine_group_name: "Rotavirus",
                    range: 2,
                    medicine_name: "Rotavirus 1",
                    medicine_brands: ["Rotarix", "Rotasil", "Rotasure", "Rotateq", "Rotavac"],
                },
            ],
        },
        {
            range: 3,
            vaccines: [
                {
                    vaccine_group_name: "Polio",
                    range: 3,
                    medicine_name: "IPV 2",
                    medicine_brands: ["Easy 6", "Hexaxim", "Imovax", "Infanrix Hexa", "Pentaxim", "Poliovac", "Polprotec", "Tetraxim"],
                },
                {
                    vaccine_group_name: "Polio",
                    range: 3,
                    medicine_name: "OPV",
                    medicine_brands: [
                        "BioPolio B 1/3",
                        "Biopolio",
                        "Bivalent/b-OPV 1&3",
                        "Oral Bivalent Type 1&3",
                        "Polio Sabin (Oral)",
                        "Polio Sabin 1&3 (Oral)",
                        "mOPV1",
                    ],
                },
                {
                    vaccine_group_name: "DTP",
                    range: 3,
                    medicine_name: "DTP 2",
                    medicine_brands: [
                        "ComBE Five",
                        "Comvac 4",
                        "Comvac 5",
                        "Comvac4-HB",
                        "Easy 4",
                        "Easy 5",
                        "Easy 6",
                        "Easy4-TT Vial",
                        "Hexaxim",
                        "Infanrix",
                        "Infanrix Hexa",
                        "Pentashield",
                        "Pentavac",
                        "Pentavac PFS",
                        "Pentavac SD",
                        "Pentaxim",
                        "Quadrovax",
                        "Quinvaxem",
                        "Shan 5",
                        "Tetraxim",
                        "Tripacel",
                        "Triple Antigen",
                    ],
                },
                {
                    vaccine_group_name: "Hib",
                    range: 3,
                    medicine_name: "HIB 2",
                    medicine_brands: [
                        "ActHIB",
                        "ComBE Five",
                        "Comvac 4",
                        "Comvac 5",
                        "Easy 4",
                        "Easy 5",
                        "Easy 6",
                        "HIBpro",
                        "Hexaxim",
                        "Hiberix",
                        "Infanrix Hexa",
                        "Pentashield",
                        "Pentavac",
                        "Pentaxim",
                        "Quadrovax",
                        "Quinvaxem",
                        "Shan 5",
                    ],
                },
                {
                    vaccine_group_name: "Rotavirus",
                    range: 3,
                    medicine_name: "Rotavirus 2",
                    medicine_brands: ["Rotarix", "Rotasil", "Rotasure", "Rotateq", "Rotavac"],
                },
                {
                    vaccine_group_name: "Hep B",
                    range: 3,
                    medicine_name: "Hep B",
                    medicine_brands: [
                        "Bevac",
                        "ComBE Five",
                        "Comvac 5",
                        "Easy 5",
                        "Easy 6",
                        "Engerix B",
                        "Genevac B",
                        "Hexaxim",
                        "Infanrix Hexa",
                        "Pentashield",
                        "Pentavac",
                        "Quinvaxem",
                        "Revac B",
                        "Shan 5",
                        "Shanvac B",
                    ],
                },
            ],
        },
        {
            range: 4,
            vaccines: [
                {
                    vaccine_group_name: "Polio",
                    range: 4,
                    medicine_name: "IPV 3",
                    medicine_brands: ["Easy 6", "Hexaxim", "Imovax", "Infanrix Hexa", "Pentaxim", "Poliovac", "Polprotec", "Tetraxim"],
                },
                {
                    vaccine_group_name: "Polio",
                    range: 4,
                    medicine_name: "OPV",
                    medicine_brands: [
                        "BioPolio B 1/3",
                        "Biopolio",
                        "Bivalent/b-OPV 1&3",
                        "Oral Bivalent Type 1&3",
                        "Polio Sabin (Oral)",
                        "Polio Sabin 1&3 (Oral)",
                        "mOPV1",
                    ],
                },
                {
                    vaccine_group_name: "DTP",
                    range: 4,
                    medicine_name: "DTP 3",
                    medicine_brands: [
                        "ComBE Five",
                        "Comvac 4",
                        "Comvac 5",
                        "Comvac4-HB",
                        "Easy 4",
                        "Easy 5",
                        "Easy 6",
                        "Easy4-TT Vial",
                        "Hexaxim",
                        "Infanrix",
                        "Infanrix Hexa",
                        "Pentashield",
                        "Pentavac",
                        "Pentavac PFS",
                        "Pentavac SD",
                        "Pentaxim",
                        "Quadrovax",
                        "Quinvaxem",
                        "Shan 5",
                        "Tetraxim",
                        "Tripacel",
                        "Triple Antigen",
                    ],
                },
                {
                    vaccine_group_name: "Hib",
                    range: 4,
                    medicine_name: "HIB 3",
                    medicine_brands: [
                        "ActHIB",
                        "ComBE Five",
                        "Comvac 4",
                        "Comvac 5",
                        "Easy 4",
                        "Easy 5",
                        "Easy 6",
                        "HIBpro",
                        "Hexaxim",
                        "Hiberix",
                        "Infanrix Hexa",
                        "Pentashield",
                        "Pentavac",
                        "Pentaxim",
                        "Quadrovax",
                        "Quinvaxem",
                        "Shan 5",
                    ],
                },
                {
                    vaccine_group_name: "Rotavirus",
                    range: 4,
                    medicine_name: "Rotavirus 3",
                    medicine_brands: ["Rotarix", "Rotasil", "Rotasure", "Rotateq", "Rotavac"],
                },
            ],
        },
        {
            range: 5,
            vaccines: [
                {
                    vaccine_group_name: "Hep B",
                    range: 5,
                    medicine_name: "Hep B3",
                    medicine_brands: [
                        "Bevac",
                        "ComBE Five",
                        "Comvac 5",
                        "Easy 5",
                        "Easy 6",
                        "Engerix B",
                        "Genevac B",
                        "Hexaxim",
                        "Infanrix Hexa",
                        "Pentashield",
                        "Pentavac",
                        "Quinvaxem",
                        "Revac B",
                        "Shan 5",
                        "Shanvac B",
                    ],
                },
                {
                    vaccine_group_name: "Polio",
                    range: 5,
                    medicine_name: "OPV 1",
                    medicine_brands: [
                        "BioPolio B 1/3",
                        "Biopolio",
                        "Bivalent/b-OPV 1&3",
                        "Oral Bivalent Type 1&3",
                        "Polio Sabin (Oral)",
                        "Polio Sabin 1&3 (Oral)",
                        "mOPV1",
                    ],
                },
            ],
        },
        {
            range: 6,
            vaccines: [
                {
                    vaccine_group_name: "Typhoid",
                    range: 6,
                    medicine_name: "Typhoid",
                    medicine_brands: [
                        "Bio Typh PFS",
                        "Bio Typh SD",
                        "Biovac Typhoid",
                        "Enteroshield",
                        "Peda Typh-PFS",
                        "Typbar TCV",
                        "Typhim Vi",
                        "Tyvax-CV",
                        "Vac-T",
                        "ZyVac-TCV",
                    ],
                },
                {
                    vaccine_group_name: "Polio",
                    range: 6,
                    medicine_name: "OPV 2",
                    medicine_brands: [
                        "BioPolio B 1/3",
                        "Biopolio",
                        "Bivalent/b-OPV 1&3",
                        "Oral Bivalent Type 1&3",
                        "Polio Sabin (Oral)",
                        "Polio Sabin 1&3 (Oral)",
                        "mOPV1",
                    ],
                },
            ],
        },
        {
            range: 7,
            vaccines: [
                {
                    vaccine_group_name: "Pneumococcal",
                    range: 7,
                    medicine_name: "PCV B1",
                    medicine_brands: ["Prevenar-13", "Prevenar-7", "Synflorix"],
                },
                {
                    vaccine_group_name: "Polio",
                    range: 7,
                    medicine_name: "OPV",
                    medicine_brands: [
                        "BioPolio B 1/3",
                        "Biopolio",
                        "Bivalent/b-OPV 1&3",
                        "Oral Bivalent Type 1&3",
                        "Polio Sabin (Oral)",
                        "Polio Sabin 1&3 (Oral)",
                        "mOPV1",
                    ],
                },
                {
                    vaccine_group_name: "Polio",
                    range: 7,
                    medicine_name: "IPV B1",
                    medicine_brands: ["Easy 6", "Hexaxim", "Imovax", "Infanrix Hexa", "Pentaxim", "Poliovac", "Polprotec", "Tetraxim"],
                },
                {
                    vaccine_group_name: "DTP",
                    range: 7,
                    medicine_name: "DTP B1",
                    medicine_brands: [
                        "Adacel",
                        "Boostrix",
                        "ComBE Five",
                        "Comvac 4",
                        "Comvac 5",
                        "Comvac4-HB",
                        "Easy 4",
                        "Easy 5",
                        "Easy 6",
                        "Easy4-TT Vial",
                        "Hexaxim",
                        "Infanrix",
                        "Infanrix Hexa",
                        "Pentashield",
                        "Pentavac",
                        "Pentavac PFS",
                        "Pentavac SD",
                        "Pentaxim",
                        "Quadrovax",
                        "Quinvaxem",
                        "Shan 5",
                        "Tetraxim",
                        "Tripacel",
                        "Triple Antigen",
                    ],
                },
                {
                    vaccine_group_name: "Hib",
                    range: 7,
                    medicine_name: "HIB B1",
                    medicine_brands: [
                        "ActHIB",
                        "ComBE Five",
                        "Comvac 4",
                        "Comvac 5",
                        "Easy 4",
                        "Easy 5",
                        "Easy 6",
                        "HIBpro",
                        "Hexaxim",
                        "Hiberix",
                        "Infanrix Hexa",
                        "Pentashield",
                        "Pentavac",
                        "Pentaxim",
                        "Quadrovax",
                        "Quinvaxem",
                        "Shan 5",
                    ],
                },
            ],
        },
        {
            range: 8,
            vaccines: [
                {
                    vaccine_group_name: "Meningococcal",
                    range: 8,
                    medicine_name: "Meningococcal",
                    medicine_brands: ["A&C", "Menactra", "Mencevax ACWY", "Menveo"],
                },
                {
                    vaccine_group_name: "Typhoid",
                    range: 8,
                    medicine_name: "Typhoid B1",
                    medicine_brands: [
                        "Bio Typh PFS",
                        "Bio Typh SD",
                        "Biovac Typhoid",
                        "Enteroshield",
                        "Peda Typh-PFS",
                        "Typbar TCV",
                        "Typhim Vi",
                        "Tyvax-CV",
                        "Vac-T",
                        "ZyVac-TCV",
                    ],
                },
            ],
        },
        {
            range: 9,
            vaccines: [
                {
                    vaccine_group_name: "Polio",
                    range: 9,
                    medicine_name: "OPV 3",
                    medicine_brands: [
                        "BioPolio B 1/3",
                        "Biopolio",
                        "Bivalent/b-OPV 1&3",
                        "Oral Bivalent Type 1&3",
                        "Polio Sabin (Oral)",
                        "Polio Sabin 1&3 (Oral)",
                        "mOPV1",
                    ],
                },
                {
                    vaccine_group_name: "MMR",
                    range: 9,
                    medicine_name: "MMR",
                    medicine_brands: ["MR-Vac", "Priorix", "Priorix Tetra", "Tresivac", "Tresivac PFS"],
                },
                {
                    vaccine_group_name: "DTP",
                    range: 9,
                    medicine_name: "DTP B2",
                    medicine_brands: [
                        "Adacel",
                        "Boostrix",
                        "ComBE Five",
                        "Comvac 4",
                        "Comvac 5",
                        "Comvac4-HB",
                        "Easy 4",
                        "Easy 5",
                        "Easy 6",
                        "Easy4-TT Vial",
                        "Hexaxim",
                        "Infanrix",
                        "Infanrix Hexa",
                        "Pentashield",
                        "Pentavac",
                        "Pentavac PFS",
                        "Pentavac SD",
                        "Pentaxim",
                        "Quadrovax",
                        "Quinvaxem",
                        "Shan 5",
                        "Tetraxim",
                        "Tripacel",
                        "Triple Antigen",
                    ],
                },
            ],
        },
    ],
};