import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import MedicineView from "./MedicineView";
import { getSexNotation } from "../../Utils/common";
class PrintPreview extends React.Component {
    /**
     *  symptoms, findings, diagnosis view jsx
     */
    sectionDataValues = (item) => {
        let itemsValues = item.fields
            ? item.fields.map((field) => {
                  if (field.value && field.value.trim() !== "") {
                      return field.value;
                  } else if (field.operator === "select") {
                      return field.possible_values && null;
                  }
              })
            : item.data.map((field) => {
                  if (field.value) {
                      return field.value;
                  } else if (field.operator === "select") {
                      return field.possible_values && "";
                  }
              });

        return [...new Set(itemsValues.filter(Boolean))].join(", ").trim().length > 0 ? (
            <React.Fragment>{itemsValues.length > 0 && `(${itemsValues.filter(Boolean)})`}</React.Fragment>
        ) : null;
    };

    vitalsSectionData = (listType, title, keyType) => {
        return (
            <div className="section">
                <div className="text-captitalize">
                    <b>{title} : </b>
                    {listType.length > 0
                        ? listType[0].fields.map((item, index) => {
                              if (item.value) {
                                  return (
                                      <span className="text-capitalize" key={keyType + index}>
                                          <span>{item.label}</span> - {item.value}, &nbsp;
                                      </span>
                                  );
                              }
                          })
                        : listType.data.map((item, index) => {
                              if (item.value) {
                                  return (
                                      <span className="text-capitalize" key={keyType + index}>
                                          <span>{item.label}</span> - {item.value}, &nbsp;
                                      </span>
                                  );
                              }
                          })}
                </div>
            </div>
        );
    };

    sectionData = (listType, title, keyType) => {
        return (
            <div className="section">
                <b>{title} : </b>
                <span>
                    {listType.map((item, index) => {
                        return (
                            <span className="section-data" key={keyType + index}>
                                {item.name}
                                {this.sectionDataValues(item)}
                                {index < listType.length - 1 ? ", " : ""}
                            </span>
                        );
                    })}
                </span>
            </div>
        );
    };

    // list: list of vaccine updated today.
    // start date will be todays date of prescription is new
    // or updated_at date, if prescription is old (and in edit mode)
    renderVaccineDetails = (list, startDate) => {
        let given = [],
            due = [];

        list.forEach((item) => {
            if (item.given_date && moment(item.given_date).format("DD/MM/YYYY") === startDate) {
                given.push(
                    <li className="section-data" key={item.range + item.medicine_name}>
                        {item.medicine_name} - {item.medicine_brand} {item.notes ? "(" + item.notes + ")" : ""}
                    </li>
                );
            }
        });

        list.forEach((item) => {
            if (!item.given_date && item.due_date && moment(item.due_date) > moment(startDate, "DD/MM/YYYY")) {
                due.push(
                    <li className="section-data" key={item.range + item.medicine_name}>
                        {item.medicine_name} {item.medicine_brand !== "-1" ? " - " + item.medicine_brand : ""}{" "}
                        {item.notes ? "(" + item.notes + ")" : ""} (Due Date: {moment(item.due_date).format("DD/MM/YYYY")})
                    </li>
                );
            }
        });

        return (
            <div className="section">
                <b>Vaccination : </b>
                {given.length ? (
                    <div>
                        <p style={{ fontWeight: "bold", marginBottom: "2px" }}>Given:</p>
                        <ol>{given}</ol>
                    </div>
                ) : null}
                {due.length ? (
                    <div>
                        <p style={{ fontWeight: "bold", marginBottom: "2px" }}>Due:</p>
                        <ol>{due}</ol>
                    </div>
                ) : null}
            </div>
        );
    };

    render() {
        let symptomsList = [],
            findingsList = [],
            diagnosisList = [],
            medicinesList = [],
            investigationsList = [],
            instructionsList = [],
            vaccineList = [],
            vitalsList = [],
            othersList = {},
            doctor = {};

        let startDate;
        let medicineView;

        /**
         *  separating symptoms, findings, diagnosis, medicines from prescription for prescription preview
         */

        if (Object.keys(this.props.viewPrescription).length > 0 && this.props.homePrescription) {
            doctor = this.props.doctor || {};
            symptomsList = this.props.viewPrescription.symptoms || [];
            findingsList = this.props.viewPrescription.findings || [];
            diagnosisList = this.props.viewPrescription.diagnosis || [];
            investigationsList = this.props.viewPrescription.investigations || [];
            instructionsList = this.props.viewPrescription.instructions || [];
            medicinesList = this.props.viewPrescription.medicines || [];
            vitalsList = this.props.viewPrescription.vitals || [];
            othersList = {
                additionalNotes: this.props.viewPrescription.additional_notes || "",
                patientNotes: this.props.patient.notes || "",
                followUpDate: this.props.patient.follow_up_date,
            };

            startDate = moment(this.props.viewPrescription.updated_at).format("DD/MM/YYYY");

            vaccineList = this.props.vaccine.filter((item) => {
                return moment(item.updated_at).format("DD/MM/YYYY") === startDate;
            });

            medicineView = (
                <MedicineView
                    medicinesList={medicinesList}
                    someFieldType="data"
                    prescriptionType={this.props.viewPrescription}
                    startDate={startDate}
                />
            );
        } else {
            doctor = this.props.user || {};
            symptomsList = this.props.prescription.filter((item) => {
                return item.category === "Symptoms";
            });

            findingsList = this.props.prescription.filter((item) => {
                return item.category === "Findings";
            });

            diagnosisList = this.props.prescription.filter((item) => {
                return item.category === "Diagnosis";
            });

            medicinesList = this.props.prescription.filter((item) => {
                return item.category === "Medicines";
            });

            investigationsList = this.props.prescription.filter((item) => {
                return item.category === "Investigations";
            });

            instructionsList = this.props.prescription.filter((item) => {
                return item.category === "Instructions";
            });

            vitalsList = this.props.prescription.filter((item) => {
                return item.category === "Vitals";
            });

            startDate = moment().format("DD/MM/YYYY");

            vaccineList = this.props.vaccine.filter((item) => {
                return moment(item.updated_at).format("DD/MM/YYYY") === startDate;
            });

            othersList = this.props.prescription.filter((item) => {
                return item.category === "Others";
            });

            othersList = othersList && othersList.length > 0 ? othersList[0].fields : {};

            medicineView = (
                <MedicineView
                    medicinesList={medicinesList}
                    someFieldType="fields"
                    prescriptionType="prescriptionSection"
                    startDate={startDate}
                />
            );
        }

        /**
         *  symptoms, findings, diagnosis view jsx
         */
        let sexNotation = getSexNotation(this.props.patient.sex);
        let prescriptionDate = this.props.viewPrescription
            ? this.props.viewPrescription.updated_at
                ? moment(this.props.viewPrescription.updated_at).format("DD-MM-YYYY, h:mm a")
                : ""
            : "";

        return (
            <div className="pres-container text-left">
                <div className="section">
                    <div className="split-50-ends">
                        <span>
                            <b>Name : </b>
                            <span className="text-capitalize">
                                {this.props.patient.first_name} {this.props.patient.last_name}
                            </span>
                        </span>
                        <span>
                            <b>Date : </b>
                            <span className="text-lowercase">{prescriptionDate || moment().format("DD/MM/YYYY")}</span>
                        </span>
                    </div>

                    <div className="split-50-ends">
                        <span>
                            <b>Age/Sex : </b>
                            <span>
                                {this.props.patient.age} <span style={{ textTransform: "lowercase" }}>y</span>
                                {this.props.patient.salutation && ` / ${sexNotation}`}
                            </span>
                        </span>
                        <span>
                            <b>Mobile : </b>
                            <span>{this.props.patient.phone}</span>
                        </span>
                    </div>

                    <div className="split-50-ends">
                        <span>
                            <b>Address : </b>
                            <span>
                                {this.props.patient.address.line_1}&nbsp;{this.props.patient.address.area}&nbsp;
                                {this.props.patient.address.city} &nbsp;
                                {this.props.patient.address.pincode}
                            </span>
                        </span>
                    </div>
                </div>

                {this.props.printOptions &&
                    this.props.printOptions.symptoms &&
                    symptomsList.length > 0 &&
                    this.sectionData(symptomsList, "Symptoms", "section-data-symptoms")}

                {this.props.printOptions &&
                    this.props.printOptions.findings &&
                    findingsList.length > 0 &&
                    this.sectionData(findingsList, "Findings", "section-data-findings")}

                {Object.keys(othersList).length > 0 && this.props.printOptions && this.props.printOptions.others && (
                    <div>
                        <div className="section">
                            <b>Additional Notes : </b>
                            <span>
                                <span className="section-data">{othersList.additionalNotes}</span>
                            </span>
                        </div>

                        {/* <div className="section">
                            <b>Patient Notes : </b>
                            <span>
                                <span className="section-data">{othersList.patientNotes}</span>
                            </span>
                        </div> */}
                    </div>
                )}

                {this.props.printOptions &&
                    this.props.printOptions.vitals &&
                    vitalsList.length > 0 &&
                    this.vitalsSectionData(vitalsList, "Vitals", "section-data-vitals")}

                {this.props.printOptions &&
                    this.props.printOptions.diagnosis &&
                    diagnosisList.length > 0 &&
                    this.sectionData(diagnosisList, "Diagnosis", "section-data-diagnosis")}

                {this.props.printOptions && this.props.printOptions.medicines && medicinesList.length > 0 && (
                    <div className="section">
                        <div className="table-responsive">
                            <table className="mb-0 table med-table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th className="name-header">Name</th>
                                        <th>Quantity</th>
                                        <th>Morning</th>
                                        <th>Afternoon</th>
                                        <th>Dinner</th>
                                        <th>Frequency</th>
                                        <th>Duration</th>
                                    </tr>
                                </thead>
                                <tbody>{medicineView}</tbody>
                            </table>
                        </div>
                    </div>
                )}

                {this.props.printOptions &&
                    this.props.printOptions.investigations &&
                    investigationsList.length > 0 &&
                    this.sectionData(investigationsList, "Investigations", "section-data-investigations")}

                {this.props.printOptions &&
                    this.props.printOptions.instructions &&
                    instructionsList.length > 0 &&
                    this.sectionData(instructionsList, "Instructions", "section-data-instructions")}

                {this.props.printOptions &&
                    this.props.printOptions.vaccines &&
                    vaccineList.length > 0 &&
                    this.renderVaccineDetails(vaccineList, startDate)}

                {Object.keys(othersList).length > 0 && this.props.printOptions && this.props.printOptions.others && (
                    <div>
                        {othersList.followUpDate && (
                            <div className="section">
                                <b>Follow-up date : </b>
                                <span>
                                    <span className="section-data">{moment(othersList.followUpDate).format("LL")}</span>
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    prescription: state.DefinitionReducer.prescription,
    vaccine: state.DefinitionReducer.vaccine,
    viewPrescription: state.DefinitionReducer.viewPrescription,
    patient: state.DefinitionReducer.patient,
    user: state.AuthReducer.user,
});

export default connect(mapStateToProps)(PrintPreview);
