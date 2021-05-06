import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { getSexNotation } from "../../Utils/common";

class VaccinationPrintPreview extends Component {
    render() {
        const { vaccinesData, vaccineData } = this.props;
        let sexNotation = getSexNotation(this.props.patient.sex);
        return (
            <div class="main-card mb-3 card">
                <div class="card-body">
                    <table class="mb-0 table table-borderless print-details-vaccine" style={{ textTransform: "capitalize" }}>
                        <thead>
                            <tr>
                                <td>
                                    <b>Name : </b>
                                    {this.props.patient.first_name} {this.props.patient.last_name}
                                </td>
                                <td>
                                    <b>Phone : </b>
                                    {this.props.patient.phone}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <b>Age/Sex : </b>
                                    {this.props.patient.age} <span style={{ textTransform: "lowercase" }}>y</span>
                                    {this.props.patient.salutation && ` / ${sexNotation}`}
                                </td>
                                <td>
                                    <b>Blood Group : </b>
                                    {this.props.patient.blood_grp}
                                </td>
                            </tr>
                        </thead>
                    </table>

                    <table className="mb-0 table table-bordered" style={{ marginTop: "20px" }}>
                        <thead>
                            <tr>
                                <th>Timing</th>
                                <th>Medicine Name</th>
                                <th>Medicine Brand</th>
                                <th>Given</th>
                                <th>Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vaccinesData &&
                                vaccinesData.vaccine_chart.map((vaccineItem) => {
                                    return vaccineItem.vaccines.map((vaccine, index) => {
                                        let filteredVaccine = vaccineData.find(
                                            (vaccineName) => vaccineName.medicine_name === vaccine.medicine_name
                                        );
                                        let vaccineMedicineName = "",
                                            vaccineMedicineGivenDate = "",
                                            vaccineMedicineDueDate = "";
                                        if (filteredVaccine && filteredVaccine.given_date) {
                                            vaccineMedicineName = filteredVaccine.medicine_brand || "";
                                            vaccineMedicineGivenDate = moment(filteredVaccine.given_date).format("YYYY-MM-DD") || "";
                                        }
                                        if (filteredVaccine && filteredVaccine.due_date) {
                                            vaccineMedicineDueDate = moment(filteredVaccine.due_date).format("YYYY-MM-DD") || "";
                                        }
                                        return (
                                            <tr key={`vaccine${index}`}>
                                                <td>{vaccinesData.ranges_details[vaccine.range].range_label}</td>
                                                <td>{vaccine.medicine_name}</td>
                                                <td>{vaccineMedicineName}</td>
                                                <td>{vaccineMedicineGivenDate}</td>
                                                <td>{vaccineMedicineDueDate}</td>
                                            </tr>
                                        );
                                    });
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    patient: state.DefinitionReducer.patient,
});

export default connect(mapStateToProps)(VaccinationPrintPreview);
