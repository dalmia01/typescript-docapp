import React from "react";
import { Row, Col, Button, ButtonGroup } from "reactstrap";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SelectView = (props) => {
    // change handler to set select values
    const checkClickHandler = (e) => {
        if (e.target.value === props.value) {
            props.valuesChangeHandler(props.name);
        } else {
            props.valuesChangeHandler(e);
        }
    };

    return (
        <React.Fragment>
            <Row className="selection-tabs">
                <Col md="12">
                    <div className="formElement">
                        <label className="row-flex">
                            {props.label}
                            {props.icons && (
                                <span>
                                    <FontAwesomeIcon icon={faPencilAlt} onClick={props.editDefinition} />
                                    <FontAwesomeIcon icon={faTrash} onClick={props.deleteDefinationField} title="delete" color="red" />
                                </span>
                            )}
                        </label>

                        <ButtonGroup size="sm">
                            {props.options && props.options.map((option, index) => (
                                <Button
                                    color="primary tab"
                                    name={props.name}
                                    value={option.value || option}
                                    active={props.value === (option.value || option)}
                                    onClick={(e) => checkClickHandler(e)}
                                >
                                    {option.text || option}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default SelectView;
