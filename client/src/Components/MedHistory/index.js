import React from "react";
import { v4 as uuid } from "uuid";
import { Row, Col, Button } from "reactstrap";

import AddDefinationName from "../PrescriptionTabs/UI/AddDefinationName";
import SelectedDefinations from "../PrescriptionTabs/UI/SelectedDefinations";
import DefinationList from "../PrescriptionTabs/UI/DefinationList";
import SelectedSection from "../PrescriptionTabs/UI/SelectedSection";

const MedHistory = (props) => {
    // get definition list when the page is loaded.

    React.useEffect(() => {
        props.fetchDefinitions({
            variables: { category: props.category, someId: uuid() },
        });
    }, []);

    return (
        <div>
            <div>
                <Row>
                    <Col>
                        <AddDefinationName category={props.category} addDefination={props.addDefination} />
                    </Col>

                    <Col md={8} style={{ textAlign: "right" }}>
                        <Button onClick={props.saveMedicalHistoryHandler} disabled={props.medicalHistory.length <= 0}>
                            Save Medical History
                        </Button>
                    </Col>
                </Row>

                <SelectedDefinations
                    category={props.category}
                    selectedDefinitions={props.selectedDefinitions}
                    selectedOption={props.selectedOption}
                    viewOption={props.viewOption}
                    removeFromSelectedOptions={props.removeFromSelectedOptions}
                />
            </div>

            <div className={Object.keys(props.selectedOption).length > 0 || props.specificLoad ? "select-grid" : "full-grid"}>
                <DefinationList
                    category={props.category}
                    filterSelect={props.filterSelect}
                    setFilterSelect={props.setFilterSelect}
                    selectedOption={props.selectedOption}
                    selectOptions={props.definitionList.nonSelected || []}
                    addFromSelectOptions={props.addFromSelectOptions}
                    definitionList={props.definitionList}
                    viewOption={props.viewOption}
                />

                {/* selected definition */}

                {props.specificLoad ? (
                    <div>Loading ... </div>
                ) : (
                    Object.keys(props.selectedOption).length > 0 && (
                        <SelectedSection
                            selectedOption={props.selectedOption}
                            category={props.category}
                            confirmItemDeleteHandler={props.confirmItemDeleteHandler}
                            editDefinition={props.editDefinition}
                            deleteDefinationField={props.deleteDefinationField}
                            setMedHistoryUiVisibility={props.setMedHistoryUiVisibility}
                            dynamic={true}
                            medHistoryFormValueChange={props.medHistoryFormValueChange}
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default MedHistory;
