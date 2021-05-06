import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Row, Col, ButtonGroup, Button } from "reactstrap";
import GivenVaccination from "../../Components/Vaccination/GivenVaccination";
import DueVaccination from "../../Components/Vaccination/DueVaccination";

import "./index.scss";

const VaccinationDetails = (props) => {
    let [vaccineOption, setVaccineOption] = React.useState(1);
    return (
        <ReactCSSTransitionGroup
            component="div"
            transitionName="TabsAnimation"
            transitionAppear={true}
            transitionAppearTimeout={0}
            transitionEnter={false}
            transitionLeave={false}
        >
            <Row className="selection-tabs">
                <Col md="12">
                    <ButtonGroup size="sm">
                        <Button color="primary tab" onClick={() => setVaccineOption(1)} active={vaccineOption === 1}>
                            Given
                        </Button>
                        <Button color="primary tab" onClick={() => setVaccineOption(2)} active={vaccineOption === 2}>
                            Due
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
            {vaccineOption === 1 && <GivenVaccination />}
            {vaccineOption === 2 && <DueVaccination />}
        </ReactCSSTransitionGroup>
    );
};

export default VaccinationDetails;
