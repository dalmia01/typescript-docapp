import React from "react";
import moment from "moment";
import EmptyState from "../Common/EmptyState";

const VitalsHomeTable = (props) => {
    /**
     *  to calculate or render all values of vitals according to date and name
     * @param {Object} currentPrescription - prescription data
     * @param {String} vitalName - name of the vital
     * @return {String | number } - value of the vital -default '-'
     */

    const vitalsValues = (currentPrescription, vitalName) => {
        let foundVital = currentPrescription.vitals.data.find((vital) => {
            return vital.label === vitalName;
        });

        return foundVital && foundVital.value && foundVital.value.trim() !== "" ? foundVital.value : "-";
    };

    /**
     *  to set what vitals recorded according on which dates (to set column header(dates) and row headers(vitals names))
     */

    let vitalNames = [];
    let allDates = [];
    let allVitals = [];
    props.allPrescriptions.map((item) => {
        if (item.vitals.data && item.vitals.data.length > 0) {
            allDates.push(moment(item.updated_at).format("DD/MM/YYYY"));
            item.vitals.data.map((vital) => {
                vitalNames.push(vital.label);
            });
        }
        return null;
    });

    vitalNames = [...new Set(vitalNames)];

    allDates = allDates.map((dateItem) => <th>{dateItem}</th>);

    let vitalRecords = (vitalName) => {
        return props.allPrescriptions
            .map((currentPrescription) => {
                return (
                    currentPrescription.vitals.data &&
                    currentPrescription.vitals.data.length > 0 && (
                        <td>{currentPrescription.vitals.data.length > 0 && vitalsValues(currentPrescription, vitalName)}</td>
                    )
                );
            })
            .filter(Boolean);
    };

    allVitals = vitalNames.map((vitalName) => {
        return (
            <tr>
                <th scope="row" className="text-left">
                    {vitalName}
                </th>
                {vitalRecords(vitalName)}
            </tr>
        );
    });

    return (
        <table className="mb-0 table">
            {allVitals.length > 0 ? (
                <React.Fragment>
                    <thead>
                        <tr>
                            <th></th>
                            {allDates}
                        </tr>
                    </thead>
                    <tbody>{allVitals}</tbody>
                </React.Fragment>
            ) : (
                <EmptyState content="No Vitals Found" />
            )}
        </table>
    );
};

export default VitalsHomeTable;
