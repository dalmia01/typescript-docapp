import React from "react";
import { Col, Input, Row, InputGroupAddon, InputGroup, Button } from "reactstrap";
import MedicineModal from "../../Common/MedicineModal";

const AddDefinitionName = (props) => {
    let [definitionName, setDefinitionName] = React.useState("");
    let [modalVisibility, setModalVisibility] = React.useState(false);

    const handleAddClick = () => {
        props.addDefination(definitionName, props.category);
        setDefinitionName("");
    };

    const medicinePopUpHandler = () => {
        setModalVisibility(true);
    };

    return (
        <React.Fragment>
            <MedicineModal
                isOpen={modalVisibility}
                title="Add Medicine"
                setModalVisibility={setModalVisibility}
                category={props.category}
            />
            <Row>
                <Col md={props.category === "MedicalHistory" ? "12" : "4"}>
                    <InputGroup>
                        {props.category !== "Medicines" && (
                            <Input
                                type="text"
                                value={definitionName}
                                onChange={(e) => setDefinitionName(e.target.value)}
                                placeholder={props.category}
                                required
                            />
                        )}
                        <InputGroupAddon addonType="append">
                            <Button
                                className={props.category === "Medicines" ? "" : definitionName.trim().length < 3 ? "disabled" : ""}
                                disabled={props.category === "Medicines" ? false : definitionName.trim().length < 3 ? true : false}
                                onClick={props.category === "Medicines" ? medicinePopUpHandler : handleAddClick}
                            >
                                Add
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default AddDefinitionName;
