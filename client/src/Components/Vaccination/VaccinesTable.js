import React from "react";

const VaccinesTable = (props) => {
    let noOfDues = 0;
    return (
        <div className="main-card mb-3 card">
            <div className="card-body">
                {props.vaccinedPatients.length > 0 ? (
                    <React.Fragment>
                        <div className="card-title">{props.title}</div>
                        <table className="mb-0 table table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Patient</th>
                                    <th>Vaccine Group</th>
                                    <th>Medicine Name</th>
                                    <th>Medicine Brand</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.vaccinedPatients.length > 0 &&
                                    props.vaccinedPatients.map((patient) => {
                                        return patient.vaccine.map((vaccine, index) => {
                                            noOfDues++;
                                            return (
                                                <tr key={`vaccines${index}`}>
                                                    <th>{noOfDues}</th>
                                                    <td>
                                                        {patient.first_name} {patient.last_name}
                                                    </td>
                                                    <td>{vaccine.vaccine_group_name}</td>
                                                    <td>{vaccine.medicine_name}</td>
                                                    <td>{[null, "-1"].includes(vaccine.medicine_brand) ? "" : vaccine.medicine_brand}</td>
                                                </tr>
                                            );
                                        });
                                    })}
                            </tbody>
                        </table>
                    </React.Fragment>
                ) : (
                    <div>{props.noDataContent}</div>
                )}
            </div>
        </div>
    );
};

export default VaccinesTable;
