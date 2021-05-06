import React from "react";
import { Row, Col } from "reactstrap";

import "../assets/scss/_vitals.scss";
import EmptyState from "../../Common/EmptyState";
import DynamicForm from "../DynamicForm";

/**
 *
 *
 * @param {*} props
 * @returns
 */
const VitalsUI = (props) => {
    React.useEffect(() => {
        props.getDefinitionDetails({
            variables: { category: "Vitals", id: "" },
        });
    }, []);

    let dynamicForm = null;
    if (props.selectedOption && props.selectedOption.fields) {
        dynamicForm = (
            <DynamicForm
                selectedOption={props.selectedOption}
                prescription={props.prescription}
                editDefinition={props.editDefinition}
                inputChange={props.inputChange}
                deleteDefinationField={props.deleteDefinationField}
            />
        );
    }
    const isEmptyState = !!(
        props.selectedOption &&
        Object.keys(props.selectedOption).length > 0 &&
        props.selectedOption.fields &&
        props.selectedOption.fields.length > 0
    );

    return (
        <div className="card mb-3 widget-chart">
            <div className="widget-chart-content card-custom">
                <Row className="heading form-inline">
                    <Col md="8" className="text-left">
                        <p>Vitals</p>
                    </Col>
                    <Col md="4" className="text-right">
                        <i onClick={props.rightSideDrawerHandler} className="pe-7s-plus btn-icon-wrapper icon clickable"></i>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="vitals-content">
                            {isEmptyState ? (
                                <div className="formElements-vitals">{dynamicForm}</div>
                            ) : (
                                <EmptyState content="Data not available yet" />
                            )}
                        </div>
                        <div className="other-details">
                            {props.selectedOption && props.selectedOption.fields && props.selectedOption.fields.length > 0 && (
                                <span>{props.selectedOption.fields.length} Vitals</span>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default VitalsUI;
