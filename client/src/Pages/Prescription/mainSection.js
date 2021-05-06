import React from "react";
import Tabs from "react-responsive-tabs";
import "./index.scss";
import PrescriptionTabs from "../../Components/PrescriptionTabs";

const tabsContent = [
    {
        title: "Symptoms",
    },
    {
        title: "Findings",
    },
    {
        title: "Diagnosis",
    },
    {
        title: "Medicines",
    },
    {
        title: "Investigations",
    },
    {
        title: "Instructions",
    },

    {
        title: "Vitals",
    },
    {
        title: "Others",
    },
];

function getTabs(patient) {
    return tabsContent.map((tab, index) => ({
        title: tab.title,
        getContent: () => {
            return <PrescriptionTabs patient={patient} category={tab.title} clickable={true} />;
        },
        key: index,
        patient: patient,
    }));
}

export default function MainSection(props) {
    return (
        <div className="card mb-3 widget-chart">
            <div className="widget-chart-content card-custom">
                <Tabs tabsWrapperClass="body-tabs body-tabs-layout" transform={false} showInkBar={true} items={getTabs()} />
            </div>
        </div>
    );
}
